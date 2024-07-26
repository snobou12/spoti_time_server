/** @format */

import { CronJob } from "cron";
import { Job } from "./job.class";
import { PromisePool } from "@supercharge/promise-pool";
import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import OrderModel from "../db/models/order.model";
import { Types } from "mongoose";
import AAIOService from "../aaio/aaio.service";
import { supportNickname, support_chat_id } from "../const/const";
import { resolve } from "path";
import UserService from "../db/services/user.service";
import { IUser } from "../db/models/user.model";
import InvoiceModel from "../db/models/invoice.model";
import PromocodeService from "../db/services/promocode.service";

const source = resolve("./bot/assets/greeting.jpg");

export class CheckOrderJob extends Job {
	allOrdersId: string[];
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
		this.allOrdersId = [];
	}
	// TODO: исправить баг с 2мя заказами, которые попадают после оплаты в invoices
	checkExpired(orderId: Types.ObjectId) {
		return new Promise(async (resolve, reject) => {
			try {
				const order = await OrderModel.findById(orderId);
				if (!order) {
					reject("Что-то пошло не так");
				}
				const aaoi_order_id = order?.order_id;
				if (!aaoi_order_id) {
					reject("Что-то пошло не так");
				}
				if (aaoi_order_id) {
					const status = await AAIOService.checkStatusByOrderId(aaoi_order_id);
					if (status === "expired") {
						await OrderModel.deleteOne({ order_id: order.order_id });
						resolve(1);
					}
					if (status === "in_process") {
						order.status = status;
						await order.save();
						resolve(1);
					}
					if (status === "success" || status === "hold") {
						order.status = status;
						await order.save();

						const user: IUser | string | undefined =
							await UserService.getUserById(order.customerId);
						if (!(typeof user === "string") && user) {
							const invoice = await InvoiceModel.create({
								customerId: user.id,
								service_title: order.service_title,
								service_tariff: order.service_tariff,
								service_price: order.service_price,
								service_months: order.service_months,
								service_query: order.service_query,
								used_promocode: order.used_promocode,
								order_id: order.order_id,
							});

							await this.bot.telegram.sendMessage(
								order.customerId,
								`Оплата прошла <b>успешно</b> ✅\nОжидайте, с <b>Вами</b> скоро свяжется наша техподдержка - ${supportNickname}`,
								{
									parse_mode: "HTML",
								}
							);
							const username =
								user.username === " "
									? `<a href="tg://user?id=${user.id}">${user.first_name} ${
											user.last_name ? user.last_name : ""
									  }</a>`
									: `@${user.username}`;

							await this.bot.telegram.sendPhoto(
								support_chat_id,
								{ source },
								{
									caption: `<b>Пришел новый заказ от ${username}\n${order.service_tariff} - ${order.service_price}р</b>\nПромокод: ${order.used_promocode}\nuserID - ${order.customerId}`,
									parse_mode: "HTML",
									reply_markup: {
										inline_keyboard: [
											[
												Markup.button.callback(
													"Отправить сообщение, чтобы написал нам",
													`data_order_mess_${user.id}`
												),
											],
										],
									},
								}
							);

							await OrderModel.deleteOne({ order_id: order.order_id });
							await PromocodeService.deletePromocodeAfterPay(user.id);
							await UserService.addCategoryAfterPay(
								user.id,
								invoice.service_months
							);
							resolve(1);
						}
						reject("Что-то пошло не так");
					}
					resolve(1);
				}
			} catch (e) {
				reject(e);
			}
		});
	}

	handle(): void {
		const checkOrderJob = new CronJob("*/59 * * * * *", async () => {
			const orders = await OrderModel.find();

			PromisePool.for(orders)
				.withConcurrency(1)
				.process(async order => {
					await this.checkExpired(order._id);
				});
		});

		checkOrderJob.start();
	}
}

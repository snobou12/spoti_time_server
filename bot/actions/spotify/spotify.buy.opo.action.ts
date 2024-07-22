/** @format */

import SHA256 from "sha256";
import { v4 as uuid } from "uuid";
import { IConfigService } from "../../../config/config.interface";
import { IBotContext } from "../../context/context.interface";
import { IService } from "../../db/models/service.model";
import OrderService from "../../db/services/order.service";
import { resolve } from "path";
import { Markup } from "telegraf";
import axios from "axios";
import AAIOService from "../../aaio/aaio.service";

const source = resolve("./bot/assets/offers/one_plus_one.png");

const spotifyOpoBuyAction = async (
	ctx: IBotContext,
	message_id: number | undefined,
	service: IService,
	configService: IConfigService
) => {
	try {
		const customerId = ctx.chat?.id;
		if (!customerId) {
			await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
			return;
		}

		let amount = service.price;
		let caption = `Тариф: <b>${service.tariff}</b>\nЦена: <b>${amount}р</b>\n\nПосле оплаты c <b>Вами</b> сразу свяжется техподдержка - @SpotiTime_ru_support\n<b><i>❗️В случае, если не удается оплатить, отпишите в техподдержку, вам сразу помогут!</i></b>`;

		const merchant_id = configService.get("AAIO_MERCHANT_ID");
		const order_id = uuid();
		const desc = service.tariff.split(" ").join("+");
		const currency = "RUB";
		const url = configService.get("AAIO_PAY_LINK");
		const sign = SHA256(
			`${merchant_id}:${amount}:${currency}:${configService.get(
				"AAIO_SECRET_KEY_1"
			)}:${order_id}`
		);

		const fetchAAIOLink = `${url}?merchant_id=${merchant_id}&amount=${amount}&currency=${currency}&order_id=${order_id}&sign=${sign}&desc=${desc}&lang=ru`;

		await axios.get(fetchAAIOLink);

		const invoice_id = await AAIOService.getInvoiceIdByOrderId(order_id);
		const link = `${url}?invoice_uid=${invoice_id}&lang=ru`;

		const order = await OrderService.createOrder(
			customerId,
			service.title,
			service.tariff,
			amount,
			service.months,
			service.query,
			order_id,
			"in_process",
			link,
			"1 + 1"
		);

		if (order) {
			await ctx.telegram.editMessageMedia(
				ctx.chat?.id,
				message_id,
				"",
				{
					media: { source },
					type: "photo",
					caption,
					parse_mode: "HTML",
				},
				{
					reply_markup: {
						inline_keyboard: [[Markup.button.url("К оплате", link)]],
					},
				}
			);
		}
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

export default spotifyOpoBuyAction;

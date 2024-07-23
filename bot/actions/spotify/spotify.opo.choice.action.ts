/** @format */

import { Markup } from "telegraf";
import { IBotContext } from "../../context/context.interface";
import { giveawaysLink, reviewsLink, supportLink } from "../../const/const";
import { IService } from "../../db/models/service.model";
import { resolve } from "path";
const source = resolve("./bot/assets/offers/one_plus_one.png");

const spotifyOpoChoiceAction = async (
	ctx: IBotContext,
	message_id: number | undefined,
	service: IService
) => {
	try {
		const months = service.months + "m";
		const userId = ctx.chat?.id;
		if (!userId) {
			await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
			return;
		}

		const price = service.price;
		const caption = `Тариф: <b>${service.tariff}</b>\nЦена: <b>${price}р</b>\n\nПосле оплаты c <b>Вами</b> сразу свяжется техподдержка - @SpotiTime_ru_support.`;

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
					inline_keyboard: [
						[
							Markup.button.callback(
								"Купить по акции 1️⃣ + 1️⃣",
								`data_buy_opo_spotify_${months}`
							),
						],
						[Markup.button.callback("◀️ Назад", "data_back_to_opo_spotify")],
						[
							Markup.button.url("Отзывы ⭐", reviewsLink),
							// Markup.button.url("Розыгрыши 🏆", giveawaysLink),
						],
						[Markup.button.url("Связаться с нами 🤖", supportLink)],
					],
				},
			}
		);
	} catch (e) {
		console.log(e);
	}
};

export default spotifyOpoChoiceAction;

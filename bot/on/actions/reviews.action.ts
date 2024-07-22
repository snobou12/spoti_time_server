/** @format */

import { resolve } from "path";
import { IBotContext } from "../../context/context.interface";
import { Markup } from "telegraf";
import { reviewsCaption, reviewsLink } from "../../const/const";

const source = resolve("./bot/assets/reviews.png");

const reviewsAction = async (ctx: IBotContext) => {
	try {
		await ctx.replyWithPhoto(
			{
				source,
			},
			{
				caption: reviewsCaption,
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [[Markup.button.url("✏️ Перейти", reviewsLink)]],
				},
			}
		);
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

export default reviewsAction;

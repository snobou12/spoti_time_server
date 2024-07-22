
import { resolve } from "path";
import { IBotContext } from "../../context/context.interface";
import { giveawaysCaption, giveawaysLink } from "../../const/const";
import { Markup } from "telegraf";

const source = resolve("./bot/assets/giveaways.png");

const giveawaysAction = async (ctx: IBotContext) => {
	try {
		await ctx.replyWithPhoto(
			{
				source,
			},
			{
				caption: giveawaysCaption,
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [[Markup.button.url("✏️ Перейти", giveawaysLink)]],
				},
			}
		);
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

export default giveawaysAction;

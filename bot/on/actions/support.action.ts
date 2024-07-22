
import { resolve } from "path";
import { IBotContext } from "../../context/context.interface";
import { Markup } from "telegraf";
import { supportCaption, supportLink } from "../../const/const";

const source = resolve("./bot/assets/support.png");

const supportAction = async (ctx: IBotContext) => {
	try {
		await ctx.replyWithPhoto(
			{
				source,
			},
			{
				caption:supportCaption,
				parse_mode:"HTML",
				reply_markup: {
					inline_keyboard: [[Markup.button.url("✏️ Написать", supportLink)],[Markup.button.callback("❓ Популярные вопросы","data_popular_questions")]],
				},
			}
		);
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

export default supportAction;

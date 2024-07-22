import { resolve } from "path";
import { IBotContext } from "../../context/context.interface";
import { offerLink } from "../../const/const";

const source = resolve("./bot/assets/greeting.jpg");

const aboutUsAction = async (ctx: IBotContext) => {
	try {
		await ctx.replyWithPhoto(
			{
				source,
			},
			{
				caption:`<b>Договор оферты</b> - <a href="${offerLink}">Прочитать</a>`,
				parse_mode:"HTML",
			}
		);
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

export default aboutUsAction;

import { resolve } from "path";
import { IBotContext } from "../../context/context.interface";
import { popularQueCaption } from "../../const/const";

const source = resolve("./bot/assets/support.png");

const popularQueAction = async (ctx: IBotContext) => {
	try {
		await ctx.sendMessage(popularQueCaption,{parse_mode:"HTML"});
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

export default popularQueAction;

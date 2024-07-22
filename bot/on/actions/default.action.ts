
import { IBotContext } from "../../context/context.interface";
import { errorCaption } from "../../const/const";


const defaultAction = async (ctx: IBotContext) => {
	try {
		await ctx.reply(errorCaption,{parse_mode:"HTML"});
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

export default defaultAction;

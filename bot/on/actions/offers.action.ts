/** @format */

import { resolve } from "path";
import { IBotContext } from "../../context/context.interface";
import { offerKeyboard } from "../../keyboards";
import { offersCaption } from "../../const/const";

const source = resolve("./bot/assets/offers.png");

const offerAction = async (ctx: IBotContext, isEditMessage: boolean) => {
	try {
		if (!isEditMessage) {
			const { message_id } = await ctx.replyWithPhoto(
				{ source },
				{
					caption: offersCaption,
					parse_mode: "HTML",
					reply_markup: { inline_keyboard: offerKeyboard },
				}
			);
			ctx.session.last_message_id = message_id;
		} else {
			await ctx.telegram.editMessageMedia(
				ctx.chat?.id,
				ctx.session.last_message_id,
				"",
				{
					media: { source },
					type: "photo",
					caption: offersCaption,
					parse_mode: "HTML",
				},
				{
					reply_markup: { inline_keyboard: offerKeyboard },
				}
			);
		}
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

export default offerAction;

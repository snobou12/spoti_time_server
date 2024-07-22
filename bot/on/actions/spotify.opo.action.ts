/** @format */

import { resolve } from "path";
import { getSpotifyOpoCaption, supportNickname } from "../../const/const";
import { IBotContext } from "../../context/context.interface";
import { spotifyOpoKeyboard } from "../../keyboards";

const source = resolve("./bot/assets/offers/one_plus_one.png");

export const spotifyOpoAction = async (
	ctx: IBotContext,
	isEditMessage: boolean
) => {
	try {
		if (!isEditMessage) {
			const { message_id } = await ctx.replyWithPhoto(
				{ source },
				{
					caption: getSpotifyOpoCaption(supportNickname),
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: spotifyOpoKeyboard,
					},
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
					caption: getSpotifyOpoCaption(supportNickname),
					parse_mode: "HTML",
				},
				{
					reply_markup: { inline_keyboard: spotifyOpoKeyboard },
				}
			);
		}
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

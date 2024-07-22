/** @format */

import { resolve } from "path";
import { getSpotifyCaption, supportNickname } from "../../const/const";
import { IBotContext } from "../../context/context.interface";
import { spotifyKeyboard } from "../../keyboards";

const source = resolve("./bot/assets/spotify/spotify.png");

export const spotifyAction = async (
	ctx: IBotContext,
	isEditMessage: boolean
) => {
	try {
		if (!isEditMessage) {
			const { message_id } = await ctx.replyWithPhoto(
				{ source },
				{
					caption: getSpotifyCaption(supportNickname),
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: spotifyKeyboard,
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
					caption: getSpotifyCaption(supportNickname),
					parse_mode: "HTML",
				},
				{
					reply_markup: { inline_keyboard: spotifyKeyboard },
				}
			);
		}
	} catch (e) {
		console.log(e);
		await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
	}
};

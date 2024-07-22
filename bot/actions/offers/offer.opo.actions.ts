



import { Markup } from "telegraf";
import { IBotContext } from "../../context/context.interface";
import { opoCaption } from "../../const/const";
import { resolve } from "path";
const source = resolve("./bot/assets/offers/one_plus_one.png");
export const offerOpoAction = async (
	ctx: IBotContext,
	message_id: number | undefined,
) => {
	try {
		await ctx.telegram.editMessageMedia(
			ctx.chat?.id,
			message_id,
			"",
			{
				media: { source },
				type: "photo",
				caption:opoCaption,
				parse_mode: "HTML",
			},
			{
				reply_markup: {
					inline_keyboard: [
						[Markup.button.callback("Попробовать 🤔", "data_offer_opo_spotify")],
						[Markup.button.callback("◀️ Назад", "data_back_to_offers")],
					],
				},
			}
		);
	} catch (e) {
		console.log(e);
	}
};


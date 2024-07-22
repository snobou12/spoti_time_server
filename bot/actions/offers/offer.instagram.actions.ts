



import { Markup } from "telegraf";
import fs from "fs";
import { IBotContext } from "../../context/context.interface";
import { resolve } from "path";
import { offerInstCaption, supportLink } from "../../const/const";
const source = resolve("./bot/assets/offers/instagram.png");
export const offerInstagramAction = async (
	ctx: IBotContext,
	message_id: number | undefined
) => {
	try {
		await ctx.telegram.editMessageMedia(
			ctx.chat?.id,
			message_id,
			"",
			{
				media: { source },
				type: "photo",
				caption:offerInstCaption,
				parse_mode: "HTML",
			},
			{
				reply_markup: {
					inline_keyboard: [
						[Markup.button.callback("Фото 🖼️", "data_offer_inst_story_media")],
						[Markup.button.url("Тех поддержка", supportLink)],

						[Markup.button.callback("◀️ Назад", "data_back_to_offers")],
					],
				},
			}
		);
	} catch (e) {
		console.log(e);
	}
};

export const offerInstagramMediaAction = async (ctx: IBotContext) => {
	const files = fs.readdirSync("./bot/assets/offers/instagram-media");
	files.forEach(async (fileName)=>{
		const filePath = resolve(`./bot/assets/offers/instagram-media/${fileName}`);
		const {message_id}  = await ctx.replyWithDocument({ source: filePath });
		setTimeout(async () => {
			await ctx.deleteMessage(message_id);
		}, 15000);

	})
};

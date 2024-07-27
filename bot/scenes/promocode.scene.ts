
import { Scenes, Markup } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Message } from "@telegraf/types";
import { spotifyAction } from "../on/actions/spotify.actions";
import { CallBackType } from "../actions/actions";
import PromocodeService from "../db/services/promocode.service";
import { IPromocode } from "../db/models/promocode.model";
import { resolve } from "path";
const source = resolve("./bot/assets/promocode.png");
const scene = new Scenes.BaseScene<IBotContext>("promocode-scene");

scene.enter(async ctx => {
	const userId = ctx.message?.chat.id;
	let userPromocode: IPromocode | undefined | string = "";
	let caption = "";
	if (userId) {
		userPromocode = await PromocodeService.getUserPromocode(userId);
	}
	if (userPromocode !== undefined && typeof userPromocode !== "string") {
		caption = `Введеный промокод: <b>${userPromocode.title} на ${userPromocode.discount}%</b> \n`;
	}
	caption += "Специальные предложения (акции) <b>не суммируются с промокодами</b> ❌\nЕсли что-то не получается, можете обратиться в тех поддержку -> @SpotiTime_ru_support\nДля того, чтобы выйти из меню с промокодом - нажмите кнопку 'Выйти'\n\nВведите промокод <b>сообщением:</b>";

	const { message_id } = await ctx.replyWithPhoto(
		{ source },
		{
			caption,
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[Markup.button.callback("◀️ Выйти", "data_scene_leave")],
				],
			},
		}
	);
	ctx.session.last_message_id = message_id;
});

scene.on("message", async ctx => {
	const userId = ctx.message.from.id;
	const messageId = ctx.message.message_id;
	const message = (ctx.message as Message.TextMessage).text;
	
	//либо текст с ошибкой, либо сам промокод(success)
	const res: IPromocode | string | undefined =
		await PromocodeService.sendPromocode(userId, message);
	if (typeof res !== "string" && res && message.toLowerCase() === res.title.toLowerCase()) {
		await ctx.reply(`Промокод ${res.title} на ${res.discount}% активирован`);
		await ctx.scene.leave();
		await ctx.deleteMessage(messageId);
		await spotifyAction(ctx, true);
		return;
	}
	if (typeof res === "string") {
		const { message_id } = await ctx.reply(res);
		setTimeout(async () => {
			await ctx.deleteMessage(message_id);
			await ctx.deleteMessage(messageId);
		}, 3000);

		return;
	}
});

scene.action(/data_scene_.+/, async ctx => {
	const callback = (ctx.callbackQuery as CallBackType).data;

	switch (callback) {
		case "data_scene_leave":
			await ctx.scene.leave();
			await spotifyAction(ctx, true);
			return;
		default:
			return;
	}
});
export default scene;

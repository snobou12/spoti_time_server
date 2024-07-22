/** @format */

import { Telegraf } from "telegraf";
import { Message } from "@telegraf/types";
import { OnClass } from "./on.class";
import { IBotContext } from "../context/context.interface";
import { onAllowMessages } from "../const/const";
import defaultAction from "./actions/default.action";
import supportAction from "./actions/support.action";
import { spotifyAction } from "./actions/spotify.actions";
import offerAction from "./actions/offers.action";
import reviewsAction from "./actions/reviews.action";
import aboutUsAction from "./actions/about.us.action";
import giveawaysAction from "./actions/giveaways.action";
import ServiceModel from "../db/models/service.model";

export class OnMessages extends OnClass {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.on("message", async ctx => {
			const message = (ctx.message as Message.TextMessage).text;
			if (!onAllowMessages.includes(message)) {
				await defaultAction(ctx);
				return;
			}
			switch (message) {
				case "Spotify Premium 🎸":
					await spotifyAction(ctx, false);
					return;
				case "Ввести промокод 🎫":
					await ctx.scene.enter("promocode-scene");
					return;
				case "Акции 🤑":
					await offerAction(ctx, false);
					return;

				case "Отзывы ⭐":
					await reviewsAction(ctx);
					return;

				case "О нас ⁉️":
					await aboutUsAction(ctx);
					return;

				case "Связаться с нами 🤖":
					await supportAction(ctx);
					return;
				default:
					await defaultAction(ctx);
					return;
			}
		});
	}
}

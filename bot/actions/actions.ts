/** @format */

import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Action } from "./action.class";
import { CallbackQuery } from "@telegraf/types";

import { spotifyAction } from "../on/actions/spotify.actions";
import offerAction from "../on/actions/offers.action";
import spotifyChoiceAction from "./spotify/spotify.choice.action";
import {
	offerInstagramAction,
	offerInstagramMediaAction,
} from "./offers/offer.instagram.actions";
import { offerOpoAction } from "./offers/offer.opo.actions";
import ServiceService from "../db/services/service.service";
import { IService } from "../db/models/service.model";
import spotifyBuyAction from "./spotify/spotify.buy.action";
import { IConfigService } from "../../config/config.interface";
import { spotifyOpoAction } from "../on/actions/spotify.opo.action";
import spotifyOpoChoiceAction from "./spotify/spotify.opo.choice.action";
import spotifyOpoBuyAction from "./spotify/spotify.buy.opo.action";
import popularQueAction from "../on/actions/popular.que.action";

type CallBackAdditional = {
	data: string;
};
export type CallBackType = CallBackAdditional & CallbackQuery;

export class Actions extends Action {
	constructor(bot: Telegraf<IBotContext>, configService: IConfigService) {
		super(bot, configService);
	}

	handle(): void {
		this.bot.action(/data_.+/, async (ctx: IBotContext) => {
			const callback = (ctx.callbackQuery as CallBackType).data;
			const message_id = ctx.session.last_message_id;
			if (callback.startsWith("data_order_mess")) {
				const callbackArr = callback.split("_");
				const userId = callbackArr[callbackArr.length - 1];

				await this.bot.telegram.sendMessage(
					userId,
					`Добрый день. Не можем вас найти, отпишите пожалуйста в тех поддержку -> @SpotiTime_ru_support
					\nОтправьте ему кодовое слово - ${userId}`
				);
				return;
			}

			if (
				callback.startsWith("data_spotify") ||
				callback.startsWith("data_opo_spotify")
			) {
				//spotify
				const res: IService | string | undefined =
					await ServiceService.getServiceByQuery(callback);

				//res:service
				if (res !== undefined && typeof res !== "string") {
					if (callback.startsWith("data_spotify")) {
						await spotifyChoiceAction(ctx, message_id, res);
					} else {
						await spotifyOpoChoiceAction(ctx, message_id, res);
					}
					return;
				}

				//res:error
				if (typeof res === "string") {
					await ctx.reply(res);
				}

				return;
			}

			//spotify buy
			if (
				callback.startsWith("data_buy_spotify") ||
				callback.startsWith("data_buy_opo_spotify")
			) {
				const query = callback.replace("buy_", "");
				const res: IService | string | undefined =
					await ServiceService.getServiceByQuery(query);

				//res:service
				if (res !== undefined && typeof res !== "string") {
					if (callback.startsWith("data_buy_spotify")) {
						await spotifyBuyAction(ctx, message_id, res, this.configService);
					}
					if (callback.startsWith("data_buy_opo_spotify")) {
						await spotifyOpoBuyAction(ctx, message_id, res, this.configService);
					}
					return;
				}

				//res:error
				if (typeof res === "string") {
					await ctx.reply(res);
				}
				return;
			}

			switch (callback) {
				//offers
				case "data_offer_one_plus_one":
					await offerOpoAction(ctx, message_id);
					return;
				case "data_offer_inst_story":
					await offerInstagramAction(ctx, message_id);
					return;
				case "data_offer_inst_story_media":
					await offerInstagramMediaAction(ctx);
					return;
				case "data_back_to_offers":
					await offerAction(ctx, true);
					return;
				case "data_offer_opo_spotify":
					await spotifyOpoAction(ctx, true);
					return;
				//others
				case "data_back_to_spotify":
					await spotifyAction(ctx, true);
					return;
				case "data_back_to_opo_spotify":
					await spotifyOpoAction(ctx, true);
					return;
				case "data_popular_questions":
					await popularQueAction(ctx);
					return;

				default:
					await ctx.reply("Что-то пошло не так, попробуйте еще раз.");
					return;
			}
		});
	}
}

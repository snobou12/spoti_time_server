
import { Telegraf } from "telegraf";
import { resolve } from "path";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { greetingKeyboard } from "../keyboards";
import { getGreetingCaption, giveawaysNickname, reviewsNickname, supportNickname } from "../const/const";
import UserService from "../db/services/user.service";
const source = resolve("./bot/assets/greeting.jpg");

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		this.bot.start(async (ctx)=> {
			const chat = ctx.update.message;
			const {id, first_name,last_name="",username=" " } = chat.from;
			try{
				await UserService.saveUser(id,first_name,last_name,username);
			}
			catch(e){
				console.log(e);
				await ctx.reply("Что-то пошло не так, попробуйте еще раз.")
				return;
			}
			
			await ctx.replyWithPhoto(
				{ source },
				{
					caption: getGreetingCaption(first_name,reviewsNickname,giveawaysNickname,supportNickname),
					parse_mode: "HTML",
					reply_markup: {
						keyboard: greetingKeyboard,
						resize_keyboard: true,
					},
				}
			);
		});
	}
}

/** @format */

import { Scenes, Telegraf } from "telegraf";
import mongoose from "mongoose";
import { IConfigService } from "../config/config.interface";
import { ConfigService } from "../config/config.service";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import { OnClass } from "./on/on.class";
import { OnMessages } from "./on/on.message";
import { Action } from "./actions/action.class";
import promoScene from "./scenes/promocode.scene";
import { Actions } from "./actions/actions";
import { Job } from "./crons/job.class";
import { CheckOrderJob } from "./crons/check.order.job";
import { CheckEndedJob } from "./crons/check.ended.job";

class Bot {
	bot: Telegraf<IBotContext>;
	commands: Command[] = [];
	ons: OnClass[] = [];
	actions: Action[] = [];
	jobs: Job[] = [];
	constructor(private readonly configService: IConfigService) {
		//main init
		this.bot = new Telegraf<IBotContext>(this.configService.get("BOT_TOKEN"), {
			telegram: {
				webhookReply: true,
			},
		});
		// session
		this.bot.use(new LocalSession({ database: "sessions.json" }).middleware());
		//scenes
		this.bot.use(new Scenes.Stage([promoScene]).middleware());
	}

	init() {
		//db
		mongoose
			.connect(this.configService.get("MONGO_DB_URL"))
			.then(() => console.log("DB connection successful"))
			.catch(e => {
				console.log("DB connection failed ", e);
				return;
			});

		this.commands = [new StartCommand(this.bot)];
		this.ons = [new OnMessages(this.bot)];
		this.actions = [new Actions(this.bot, this.configService)];
		this.jobs = [new CheckOrderJob(this.bot), new CheckEndedJob(this.bot)];

		// add commands
		for (const command of this.commands) {
			command.handle();
		}
		//add ons
		for (const on of this.ons) {
			on.handle();
		}
		//add actions
		for (const action of this.actions) {
			action.handle();
		}
		// jobs(crons)
		for (const job of this.jobs) {
			job.handle();
		}

		this.bot.launch();
	}
}
const bot = new Bot(new ConfigService());

export default bot;

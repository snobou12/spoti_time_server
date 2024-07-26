/** @format */

import { CronJob } from "cron";
import { Job } from "./job.class";
import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import UserService from "../db/services/user.service";

export class CheckEndedJob extends Job {
	allOrdersId: string[];
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
		this.allOrdersId = [];
	}

	handle(): void {
		// Задача каждый день в 00:00
		const jobTime = "0 0 0 * * *";
		const checkEndedJob = new CronJob(
			jobTime,
			async () => {
				await UserService.checkEndedSubscription();
			},
			null,
			true,
			"Europe/Moscow"
		);

		checkEndedJob.start();
	}
}

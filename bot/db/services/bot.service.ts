/** @format */

import { support_chat_id } from "../../const/const";
import { resolve } from "path";

import bot from "../../index";
import UserModel from "../models/user.model";
import FeaturesModel from "../../../web/models/features.model";
const source = resolve("./bot/assets/greeting.jpg");

class BotService {
	async sendMessageFromBot(id: number, message: string) {
		try {
			await bot.bot.telegram.sendMessage(id, message);
			return "Сообщение отправлено";
		} catch (e) {
			console.log(e);
		}
	}
	// TODO:
	async getBannedUsers() {
		const users = await UserModel.find();
		const ids: number[] = [];
		const bannedIds: number[] = [];
		users.forEach(user => ids.push(user.id));

		// for (const userId of ids) {
		// 	try {
		// 		console.log("kek");
		// 		await bot.bot.telegram.getChat(userId);
		// 	} catch (e) {
		// 		console.log(`Пользователь ${userId} заблокировал меня`);
		// 		bannedIds.push(userId);
		// 	}
		// }

		try {
			const message = await bot.bot.telegram.sendMessage(674301145, ".");
			await bot.bot.telegram.deleteMessage(674301145, message.message_id);
		} catch (e: any) {
			if (e.response.description === "Forbidden: bot was blocked by the user") {
				console.log("Юзер забанил тебя");
			}
		}
		console.log(bannedIds.length);
		return bannedIds;
	}
	async sendMessageAboutEndSub(telegramIds: string[]) {
		// по 10 человек каждые 15 секунд
		const batchSize = 10; //  Количество пользоветелй в каждом батче (размер группы)
		const delay = 15 * 1000; // 30 секунд задержка

		const sendMessageBatch = async (users: string[]) => {
			for (const userId of users) {
				try {
					const user = await UserModel.findOne({ id: userId });

					await bot.bot.telegram.sendPhoto(
						userId,
						{ source },
						{
							caption: `Привет, у тебя кажется закончилась подписка <b>Spotify</b>\nТы знаешь к кому обращаться 🫢\nНапиши мне /start для продления!`,
							parse_mode: "HTML",
						}
					);

					if (user) {
						user.category = undefined;
						await user.save();
					}
				} catch (error) {
					console.error(
						`Ошибка при отправке сообщения пользователю с ID: ${userId}`,
						error
					);
				}
			}
		};

		const sendMessagesWithDelay = async (
			users: string[],
			delay: number,
			batchSize: number
		) => {
			for (let i = 0; i < users.length; i += batchSize) {
				const batch = users.slice(i, i + batchSize);
				await sendMessageBatch(batch);
				if (i + batchSize < users.length) {
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
		};

		await sendMessagesWithDelay(telegramIds, delay, batchSize);
	}

	async sendTestPost(message: string) {
		try {
			const features = await FeaturesModel.findOne();
			if (!features) {
				console.error("Что-то пошло не так");
			}

			let src = source;
			const postPreviewImageSrc = features?.postPreviewImageSrc;

			if (postPreviewImageSrc) {
				const splittedSrc = features?.postPreviewImageSrc.split("/");
				src = resolve(`./uploads/${splittedSrc[splittedSrc.length - 1]}`);
			}

			await bot.bot.telegram.sendPhoto(
				support_chat_id,
				{ source: src },
				{
					caption: message,
					parse_mode: "HTML",
				}
			);
			return "Сообщение отправлено";
		} catch (e) {
			console.log(e);
		}
	}

	async sendPost(text: string, isAllUsers: boolean) {
		// по 10 человек каждые 15 секунд
		const batchSize = 10; //  Количество пользоветелй в каждом батче (размер группы)
		const delay = 15 * 1000; // 15 секунд задержка
		const features = await FeaturesModel.findOne();
		if (!features) {
			console.error("Что-то пошло не так");
		}

		let src = source;
		const postPreviewImageSrc = features?.postPreviewImageSrc;

		const sendMessageBatch = async (users: string[]) => {
			if (postPreviewImageSrc) {
				const splittedSrc = features?.postPreviewImageSrc.split("/");
				src = resolve(`./uploads/${splittedSrc[splittedSrc.length - 1]}`);
			}
			for (const userId of users) {
				try {
					await bot.bot.telegram.sendPhoto(
						userId,
						{ source: src },
						{
							caption: text,
							parse_mode: "HTML",
						}
					);
					console.log(`Сообщение отправлено пользователю с ID: ${userId}`);
				} catch (error) {
					console.error(
						`Ошибка при отправке сообщения пользователю с ID: ${userId}`,
						error
					);
				}
			}
		};

		const sendMessagesWithDelay = async (
			users: string[],
			delay: number,
			batchSize: number
		) => {
			for (let i = 0; i < users.length; i += batchSize) {
				const batch = users.slice(i, i + batchSize);
				await sendMessageBatch(batch);
				if (i + batchSize < users.length) {
					console.log(
						`Ожидание ${
							delay / 1000
						} секунд перед отправкой следующей партии сообщений...`
					);
					console.log(
						`Осталось ${
							((batch.length / batchSize) * (delay / 1000)) / 60
						} минут`
					);
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
		};

		const users = await UserModel.find();

		const telegramIds: string[] = [];
		if (!isAllUsers) {
			users.forEach(user => {
				if (!user.category) {
					telegramIds.push(String(user.id));
				}
			});
		} else {
			users.forEach(user => {
				telegramIds.push(String(user.id));
			});
		}
		console.log("Начало рассылки");
		const approximateTime = `Примерное время рассылки: ${
			((users.length / batchSize) * (delay / 1000)) / 60
		} минут`;
		console.log(approximateTime);
		await sendMessagesWithDelay(telegramIds, delay, batchSize);
		return "Рассылка успешно сделана";
	}
}

export default new BotService();

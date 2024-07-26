/** @format */

import UserModel from "../models/user.model";
import BotService from "./bot.service";

const formatMonthWithLeadingZero = (month: number) => {
	return String(month).padStart(2, "0");
};
class UserService {
	async saveUser(
		id: number,
		first_name: string,
		last_name: string = "",
		username = "anonym"
	) {
		try {
			const candidate = await UserModel.findOne({ id });
			if (!candidate || candidate === null) {
				await UserModel.create({
					id,
					first_name,
					last_name,
					username,
					usedPromocode: "",
				});
				return;
			}

			await UserModel.updateOne(
				{ id },
				{
					first_name,
					last_name,
					username,
				}
			);
		} catch (e) {
			console.log(e);
		}
		return;
	}

	async getUserById(id: number) {
		try {
			const user = await UserModel.findOne({ id });
			if (!user) {
				return "Что-то пошло не так. Попробуйте еще раз.";
			}
			return user;
		} catch (e) {
			console.log(e);
		}
		return;
	}

	async checkEndedSubscription() {
		try {
			const users = await UserModel.find();
			const date = new Date();
			const months = String(date.getMonth() + 1).padStart(2, "0");
			const days = date.getDate();
			const year = date.getFullYear();
			const dateString = `${year}-${months}-${days}`;
			const neededUsersTelegramId: string[] = [];
			users.forEach(user => {
				const userEndDate = user.category?.endDate;
				if (userEndDate && userEndDate === dateString) {
					neededUsersTelegramId.push(String(user.id));
				}
			});

			await BotService.sendMessageAboutEndSub(neededUsersTelegramId);
		} catch (e) {
			console.log(e);
		}
	}

	async addCategoryAfterPay(telegramUserId: number, months: 3 | 6 | 12) {
		const user = await UserModel.findOne({ id: telegramUserId });
		if (!user) {
			return "Что-то пошло не так. Попробуйте еще раз.";
		}
		const date = new Date();
		const dateMonths = String(date.getMonth() + 1).padStart(2, "0");
		const dateDays = date.getDate();
		const dateYear = date.getFullYear();

		const startDateString = `${dateYear}-${dateMonths}-${dateDays}`;

		const dateObj = new Date(startDateString);

		const endDate = new Date(dateObj.setMonth(dateObj.getMonth() + months));
		const endMonths = formatMonthWithLeadingZero(endDate.getMonth() + 1);
		const endDays = formatMonthWithLeadingZero(endDate.getDate());
		const endYear = endDate.getFullYear();

		const endDateString = `${endYear}-${endMonths}-${endDays}`;

		user.category = {
			startDate: startDateString,
			endDate: endDateString,
			categoryType: months,
		};
		await user.save();
		return "Категория пользователя добавлена";
	}
}

export default new UserService();

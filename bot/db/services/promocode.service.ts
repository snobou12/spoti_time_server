/** @format */

import PromocodeModel, { IPromocode } from "../models/promocode.model";
import UserModel from "../models/user.model";

class PromocodeService {
	async sendPromocode(id: number, title: string) {
		try {
			const user = await UserModel.findOne({ id });
			if (!user) {
				return "Что-то пошло не так. Попробуйте еще раз.";
			}
			const promocode = await PromocodeModel.findOne({
				title: { $regex: new RegExp(title, "i") },
			});
			if (!promocode || promocode.disabled) {
				return `Промокод - ${title} не найден`;
			}
			user.usedPromocode = promocode.title;
			await user.save();
			return promocode;
		} catch (e) {
			console.log(e);
		}
	}

	async getUserPromocode(id: number) {
		try {
			const user = await UserModel.findOne({ id });
			if (!user) {
				return "Что-то пошло не так. Попробуйте еще раз.";
			}
			const promocode = await PromocodeModel.findOne({
				title: user.usedPromocode,
			});
			if (!promocode) {
				return "Что-то пошло не так. Попробуйте еще раз.";
			}
			if (promocode.disabled) {
				return "";
			}
			return promocode;
		} catch (e) {
			console.log(e);
		}
	}

	async deletePromocodeAfterPay(id: number) {
		try {
			const user = await UserModel.findOne({ id });
			if (user) {
				const promo = await PromocodeModel.findOne({
					title: user.usedPromocode,
				});
				if (promo) {
					if (promo.oneTimeUsage) {
						await promo.deleteOne();
					}
					user.usedPromocode = "";
					await user.save();
				}
			}
		} catch (e) {
			console.log(e);
		}
	}
}

export default new PromocodeService();

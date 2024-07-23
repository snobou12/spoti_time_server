/** @format */

import PromocodeModel, {
	IPromocode,
} from "../../bot/db/models/promocode.model";
import ApiError from "../exceptions/api.errors";
class PromocodesService {
	async getPromocodes() {
		const promocodes = await PromocodeModel.find();
		return promocodes;
	}

	async deletePromocode(promocodeId: string) {
		const promo = await PromocodeModel.findById(promocodeId);
		if (!promo) {
			throw ApiError.BadRequest("Промокод не найден");
		}
		await promo.deleteOne();
		return promo._id;
	}

	async createPromocode(
		title: string,
		disabled: boolean,
		discount: number,
		oneTimeUsage: boolean
	) {
		const promocode = await PromocodeModel.findOne({ title });
		if (promocode) {
			throw ApiError.BadRequest("Такой промокод уже существует");
		}
		const newPromo = await PromocodeModel.create({
			title,
			disabled,
			discount,
			oneTimeUsage,
		});
		return newPromo;
	}
}
export default new PromocodesService();

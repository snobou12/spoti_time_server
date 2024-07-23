/** @format */

import ApiError from "../exceptions/api.errors";
import ServiceModel, { IService } from "../../bot/db/models/service.model";
class ServicesService {
	// async createPrice(title, plan) {
	// 	const candidate = await PriceModel.findOne({ title });
	// 	if (candidate) {
	// 		throw ApiError.BadRequest("This service name already exists");
	// 	}
	// 	const price = await PriceModel.create({
	// 		title,
	// 		plan,
	// 	});
	// 	return "Service price added";
	// }

	async getPrices() {
		const prices = await ServiceModel.find();
		return prices;
	}

	async changeService(newService: IService) {
		const currentService = await ServiceModel.findById(newService._id);
		if (!currentService) {
			throw ApiError.BadRequest("Сервис не найден");
		}
		// Пока только цену
		currentService.price = newService.price;
		await currentService.save();
		return newService;
		// const price = await PriceModel.findOne({ title });
		// if (!price) {
		// 	throw ApiError.BadRequest("Что-то пошло не так");
		// }
		// let prevPlan = [...price.plan];
		// let newPlanPrices = [...prevPlan].map(servicePlan => {
		// 	if (servicePlan.query === newPlan.query) {
		// 		return { ...newPlan };
		// 	} else {
		// 		return { ...servicePlan };
		// 	}
		// });
		// price.plan = newPlanPrices;
		// price.save();
		// return "Price updated";
	}
}
export default new ServicesService();

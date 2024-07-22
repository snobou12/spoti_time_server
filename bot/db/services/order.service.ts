/** @format */

import OrderModel from "../models/order.model";

class OrderService {
	async createOrder(
		customerId: number,
		service_title: string,
		service_tariff: string,
		service_price: number,
		service_months: number,
		service_query: string,
		order_id: string,
		status: string,
		link: string,
		used_promocode: string
	) {
		try {
			const order = await OrderModel.create({
				customerId,
				service_title,
				service_tariff,
				service_price,
				service_months,
				service_query,
				order_id,
				status,
				link,
				used_promocode,
			});
			return order;
		} catch (e) {
			console.log(e);
		}
		return;
	}
	async checkStatus(customerId: number, orderId: string) {
		const order = await OrderModel.findById(orderId);
		if (!order) {
			return "Оплата просрочена";
		}
		if (order.customerId !== customerId) {
			return "Что-то пошло не так. Попробуйте еще раз.";
		}
		switch (order.status) {
			case "in_process":
				return "Оплата все еще в процессе";
			case "expired":
				return "Оплата просрочена";
			case "success":
				return "Успешно произведена оплата";

			default:
				return "Что-то пошло не так. Попробуйте еще раз.";
		}
	}
}

export default new OrderService();

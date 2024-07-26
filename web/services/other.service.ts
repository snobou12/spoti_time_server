/** @format */

import UserModel from "../../bot/db/models/user.model";
import InvoiceModel, { IInvoice } from "../../bot/db/models/invoice.model";

const uniqueByKey = (array: IInvoice[], key: string) => {
	const map = new Map();
	array.forEach((item: any) => {
		if (!map.has(item[key])) {
			map.set(item[key], item);
		}
	});
	return Array.from(map.values()) as IInvoice[];
};
class OtherService {
	async getMainData() {
		// количество подписчиков всего
		const allUsersLength = await UserModel.countDocuments();
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const todayEnd = new Date();
		todayEnd.setHours(23, 59, 59, 999);
		const queryLengthToday = {
			createdAt: {
				$gte: todayStart,
				$lte: todayEnd,
			},
		};
		// количество подписчиков за день
		const todayUsersLength = await UserModel.countDocuments(queryLengthToday);

		const allInvoices = await InvoiceModel.find();
		const uniqueAllInvoices = uniqueByKey(allInvoices, "order_id");
		// количество всего денег

		let allMoney = 0;
		uniqueAllInvoices.forEach(invoice => {
			allMoney += invoice.service_price;
		});

		const invoicesTodayAggregate = await InvoiceModel.aggregate([
			{
				$match: {
					createdAt: {
						$gte: todayStart,
						$lte: todayEnd,
					},
				},
			},
			{
				$group: {
					_id: null,
					totalRevenue: { $sum: "$service_price" },
				},
			},
		]);
		// Количество денег за день
		const todayMoney =
			invoicesTodayAggregate.length > 0
				? invoicesTodayAggregate[0].totalRevenue
				: 0;

		// Количество заказов за день
		const todayInvoicesLength = await InvoiceModel.countDocuments(
			queryLengthToday
		);
		// Количество заказов всего
		const allInvoicesLength = await InvoiceModel.countDocuments();

		const data = {
			allUsersLength,
			todayUsersLength,
			todayInvoicesLength,
			allInvoicesLength,
			allMoney,
			todayMoney,
		};
		return data;
	}
}
export default new OtherService();

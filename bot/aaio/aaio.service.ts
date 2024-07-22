/** @format */

import { ConfigService } from "../../config/config.service";
import axios from "axios";
class AAIOService {
	async getInvoiceIdByOrderId(order_id: string) {
		try {
			const configService = new ConfigService();
			const url = `${configService.get(
				"AAIO_INFO_PAY_LINK"
			)}?order_id=${order_id}&merchant_id=${configService.get(
				"AAIO_MERCHANT_ID"
			)}`;
			const res = await axios.get(url, {
				headers: {
					"X-Api-Key": configService.get("AAIO_API_KEY"),
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
			});
			if (!res) {
				throw Error("Что-то пошло не так");
			}
			return res.data.id;
		} catch (e) {
			console.log(e);
		}
		return;
	}
	async checkStatusByOrderId(order_id: string) {
		const configService = new ConfigService();
		const url = `${configService.get(
			"AAIO_INFO_PAY_LINK"
		)}?order_id=${order_id}&merchant_id=${configService.get(
			"AAIO_MERCHANT_ID"
		)}`;
		const res = await axios.get(url, {
			headers: {
				"X-Api-Key": configService.get("AAIO_API_KEY"),
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
		});

		if (!res) {
			throw Error("Что-то пошло не так");
		}
		return res.data.status;
	}
}

export default new AAIOService();

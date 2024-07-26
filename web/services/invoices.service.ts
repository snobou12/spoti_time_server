/** @format */

import InvoiceModel, { IInvoice } from "../../bot/db/models/invoice.model";
import ApiError from "../exceptions/api.errors";

class InvoicesService {
	async getInvoices(page: number = 1) {
		const PAGE_SIZE = 10;
		const skip = (page - 1) * PAGE_SIZE;
		const allInvoices = await InvoiceModel.find();
		const maxPage = Math.ceil(allInvoices.length / 10);
		const invoices = await InvoiceModel.find({}).skip(skip).limit(PAGE_SIZE);

		return { invoices: invoices.reverse(), maxPage };
	}

	async deleteInvoice(id: string) {
		const invoice = await InvoiceModel.findById(id);
		if (!invoice) {
			throw ApiError.BadRequest("Заказ не найден");
		}
		await invoice.deleteOne();
		return id;
	}
}

export default new InvoicesService();

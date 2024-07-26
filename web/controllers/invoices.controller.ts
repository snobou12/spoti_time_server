/** @format */

import { Request, Response, NextFunction } from "express";
import InvoicesService from "../services/invoices.service";

class InvoicesController {
	// TODO: change req type
	async getInvoices(req: any, res: Response, next: NextFunction) {
		try {
			const page = parseInt(req.query.page);
			const invoices = await InvoicesService.getInvoices(page);
			return res.json(invoices);
		} catch (e) {
			next(e);
		}
	}
	async deleteInvoice(req: any, res: Response, next: NextFunction) {
		try {
			const { id } = req.body;
			const invoiceId = await InvoicesService.deleteInvoice(id);
			return res.json(invoiceId);
		} catch (e) {
			next(e);
		}
	}
}
export default new InvoicesController();

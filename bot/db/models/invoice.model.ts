/** @format */

import { Schema, model } from "mongoose";

export interface IInvoice {
	customerId: number;
	service_title: string;
	service_tariff: string;
	service_price: number;
	service_months: 3 | 6 | 12;
	service_query: string;
	used_promocode: string;
	order_id: string;
}
const InvoiceSchema = new Schema<IInvoice>(
	{
		customerId: { type: Number, unique: false, required: true },
		service_title: { type: String, unique: false, required: true },
		service_tariff: { type: String, unique: false, required: true },
		service_price: { type: Number, unique: false, required: true },
		service_months: { type: Number, unique: false, required: true },
		service_query: { type: String, unique: false, required: true },
		used_promocode: { type: String, unique: false, required: true },
		order_id: { type: String, unique: false, required: true },
	},
	{
		timestamps: true,
	}
);

const InvoiceModel = model<IInvoice>("Invoice", InvoiceSchema);
export default InvoiceModel;

/** @format */

import { Schema, model } from "mongoose";

export interface IOrder {
	customerId: number;
	service_title: string;
	service_tariff: string;
	service_price: number;
	service_months: number;
	service_query: string;
	order_id: string;
	status: string;
	link: string;
	used_promocode: string;
}
const orderSchema = new Schema<IOrder>(
	{
		customerId: { type: Number, unique: false, required: true },
		service_title: { type: String, unique: false, required: true },
		service_tariff: { type: String, unique: false, required: true },
		service_price: { type: Number, unique: false, required: true },
		service_months: { type: Number, unique: false, required: true },
		service_query: { type: String, unique: false, required: true },
		order_id: { type: String, unique: false, required: true },
		status: { type: String, unique: false, required: true },
		link: { type: String, unique: false, required: true },
		used_promocode: { type: String, unique: false, required: true },
	},
	{
		timestamps: true,
	}
);

const OrderModel = model<IOrder>("Order", orderSchema);
export default OrderModel;

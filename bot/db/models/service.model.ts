/** @format */

import { Schema, Types, model } from "mongoose";

export interface IService {
	_id: Types.ObjectId;
	title: string; // spotify
	tariff: string; // Spotify Premium 1 месяц
	months: number; // 1
	price: number; // 349
	discountAllowed: boolean; // false | true
	query: string; // data_$$$
}
const serviceSchema = new Schema<IService>(
	{
		query: { type: String, unique: true, required: true },
		title: { type: String, unique: false, required: true },
		tariff: { type: String, unique: false, required: true },
		months: { type: Number, unique: false, required: true },
		price: { type: Number, unique: false, required: true },
		discountAllowed: { type: Boolean, unique: false, required: true },
	},
	{
		timestamps: true,
	}
);

const ServiceModel = model<IService>("Service", serviceSchema);
export default ServiceModel;

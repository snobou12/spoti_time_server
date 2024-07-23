/** @format */

import { Schema, Types, model } from "mongoose";

export interface IPromocode {
	_id: Types.ObjectId;
	title: string;
	disabled: boolean;
	discount: number;
	oneTimeUsage: boolean;
}
const promocodeSchema = new Schema<IPromocode>(
	{
		title: { type: String, unique: true, required: true },
		disabled: { type: Boolean, unique: false, required: true },
		discount: { type: Number, unique: false, required: true },
		oneTimeUsage: { type: Boolean, unique: false, required: true },
	},
	{
		timestamps: true,
	}
);

const PromocodeModel = model<IPromocode>("Promocode", promocodeSchema);
export default PromocodeModel;

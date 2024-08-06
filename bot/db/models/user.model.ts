/** @format */

import { Schema, model } from "mongoose";

export interface UserCategory {
	startDate: string;
	endDate: string;
	categoryType: 3 | 6 | 12;
}

export interface IUser {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	usedPromocode: string;
	category?: UserCategory;
}

const UserCategorySchema = new Schema<UserCategory>({
	startDate: { type: String, unique: false, required: true },
	endDate: { type: String, unique: false, required: true },
	categoryType: {
		type: Number,
		unique: false,
		required: true,
	},
});

const userSchema = new Schema<IUser>(
	{
		id: { type: Number, unique: true, required: true },
		first_name: { type: String, unique: false, required: true },
		last_name: { type: String, unique: false, required: false },
		username: { type: String, unique: false, required: true },
		usedPromocode: { type: String, unique: false, required: false },
		category: { type: UserCategorySchema, unique: false, required: false },
	},
	{
		timestamps: true,
	}
);

const UserModel = model<IUser>("User", userSchema);
export default UserModel;

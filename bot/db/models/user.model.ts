
import { Schema, SchemaType, model } from "mongoose";

export interface IUser {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	usedPromocode:string;
}
const userSchema = new Schema<IUser>(
	{
		id: { type: Number, unique: true, required: true },
		first_name: { type: String, unique: false, required: true },
		last_name: { type: String, unique: false, required: false},
		username: { type: String, unique: false, required: true },
		usedPromocode: { type: String, unique: false, required: false },
	},
	{
		timestamps: true,
	}
);

const UserModel = model<IUser>("User", userSchema);
export default UserModel;

/** @format */

import UserModel from "../models/user.model";

class UserService {
	async saveUser(
		id: number,
		first_name: string,
		last_name: string = "",
		username = "anonym"
	) {
		try {
			const candidate = await UserModel.findOne({ id });
			if (!candidate || candidate === null) {
				await UserModel.create({
					id,
					first_name,
					last_name,
					username,
					usedPromocode: "",
				});
				return;
			}

			await UserModel.updateOne(
				{ id },
				{
					first_name,
					last_name,
					username,
				}
			);
		} catch (e) {
			console.log(e);
		}
		return;
	}

	async getUserById(id: number) {
		try {
			const user = await UserModel.findOne({ id });
			if (!user) {
				return "Что-то пошло не так. Попробуйте еще раз.";
			}
			return user;
		} catch (e) {
			console.log(e);
		}
		return;
	}
}

export default new UserService();

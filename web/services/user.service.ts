/** @format */

import AdminModel from "../models/admin.model";
import bcrypt from "bcrypt";
import ApiError from "../exceptions/api.errors";
import AdminDto from "../dtos/admin.dto";
import TokenService from "./token.service";
import UserModel from "../../bot/db/models/user.model";
class UserService {
	//admin

	//hide
	// async registrationAdmin(login: string, password: string) {
	// 	const hashPassword = await bcrypt.hash(password, 3);
	// 	const admin = await AdminModel.create({
	// 		login,
	// 		password: hashPassword,
	// 	});
	// 	return "Admin has been created";
	// }

	async login(login: string, password: string) {
		const admin = await AdminModel.findOne({ login });

		if (!admin) {
			throw ApiError.BadRequest("Неправильный логин или пароль");
		}

		const isPassEquals = await bcrypt.compare(password, admin.password);
		if (!isPassEquals) {
			throw ApiError.BadRequest("Wrong login or password");
		}
		const adminData = new AdminDto(admin);
		const tokens = TokenService.generateTokens({ ...adminData });
		await TokenService.saveToken(admin.id, tokens.refreshToken);
		return {
			...tokens,
			admin: adminData,
		};
	}

	async logout(refreshToken: string) {
		const token = await TokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken: string) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}

		const userId = TokenService.validateRefreshToken(refreshToken);
		const tokenFromDB = await TokenService.findToken(refreshToken);

		if (!userId || !tokenFromDB) {
			throw ApiError.UnauthorizedError();
		}
		const admin = await AdminModel.findById(userId);
		if (!admin) {
			throw ApiError.BadRequest("Что-то пошло не так");
		}
		const adminDto = new AdminDto(admin);
		const tokens = TokenService.generateTokens({ ...adminDto });
		await TokenService.saveToken(adminDto.id, tokens.refreshToken);
		return { ...tokens, user: adminDto };
	}
	//users

	async getUsers(page = 1) {
		const PAGE_SIZE = 10;
		const skip = (page - 1) * PAGE_SIZE;
		const allUsers = await UserModel.find();
		const maxPage = Math.ceil(allUsers.length / 10);
		const users = await UserModel.find({}).skip(skip).limit(PAGE_SIZE);
		return { users: users, maxPage };
	}

	async searchUsers(query: string) {
		query = query.toLowerCase();
		const users = await UserModel.find();
		let foundUsers = [];
		if (query[0] === "@") {
			foundUsers = users.map(user => {
				let { username } = user;
				if (
					username.toLowerCase().includes(query.slice(1)) &&
					username !== "anon"
				) {
					return user;
				}
			});
		} else {
			foundUsers = users.map(user => {
				let { first_name, last_name } = user;
				if (
					first_name.toLowerCase().includes(query) ||
					last_name.toLowerCase().includes(query)
				) {
					return user;
				}
			});
		}
		foundUsers = foundUsers.filter(user => user !== null && user !== undefined);
		return foundUsers;
	}

	async getUserCategoryByUserId(id: number) {
		const user = await UserModel.findOne({ id });
		if (!user) {
			throw ApiError.BadRequest("Пользователь не найден");
		}
		if (!user.category) return null;
		else {
			return user.category;
		}
	}

	async updateUserCategory(
		userId: string,
		months: 0 | 3 | 6 | 12,
		startDate: string,
		endDate: string
	) {
		const user = await UserModel.findById(userId);
		if (!user) {
			throw ApiError.BadRequest("Пользователь не найден");
		}

		if (!months || !startDate || !endDate) {
			user.category = undefined;
			await user.save();
			return null;
		}
		user.category = {
			startDate,
			endDate,
			categoryType: months,
		};
		await user.save();
		return "Категория пользователя обновлена";
	}
}

export default new UserService();

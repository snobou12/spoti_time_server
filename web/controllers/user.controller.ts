/** @format */

import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import { ConfigService } from "../../config/config.service";
import BotService from "../../bot/db/services/bot.service";

const configService = new ConfigService();
class UserController {
	//admin

	//hide
	// async registrationAdmin(req: Request, res: Response, next: NextFunction) {
	// 	try {
	// 		const { login, password } = req.body;
	// 		const admin = await UserService.registrationAdmin(login, password);
	// 		return res.json("registration complete");
	// 	} catch (e) {
	// 		next(e);
	// 	}
	// }

	async login(req: Request<{}, {}>, res: Response, next: NextFunction) {
		try {
			const { login, password } = req.body;
			const userData = await UserService.login(login, password);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			const token = await UserService.logout(refreshToken);
			res.clearCookie("refreshToken");
			return res.json(token);
		} catch (e) {
			next(e);
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await UserService.refresh(refreshToken);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});

			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}
	//users
	//TODO: change req type
	async getUsers(req: any, res: Response, next: NextFunction) {
		try {
			const page = parseInt(req.query.page);
			const users = await UserService.getUsers(page);
			return res.json(users);
		} catch (e) {
			next(e);
		}
	}
	//TODO: change req type

	async searchUsers(req: any, res: Response, next: NextFunction) {
		try {
			const query = req.query.query;
			const users = await UserService.searchUsers(query);
			return res.json(users);
		} catch (e) {
			next(e);
		}
	}

	async sendMessageFromBot(
		req: Request<{}, {}>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id, message } = req.body;
			const response = await BotService.sendMessageFromBot(id, message);
			return res.json(response);
		} catch (e) {
			next(e);
		}
	}
	// TODO: нужно ли?
	async getUserCategoryByUserId(
		req: Request<{}, {}>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id } = req.body;
			const response = await UserService.getUserCategoryByUserId(id);
			return res.json(response);
		} catch (e) {
			next(e);
		}
	}

	async updateUserCategory(
		req: Request<{}, {}>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { userId, months, startDate, endDate } = req.body;
			const response = await UserService.updateUserCategory(
				userId,
				months,
				startDate,
				endDate
			);
			return res.json(response);
		} catch (e) {
			next(e);
		}
	}
}
export default new UserController();

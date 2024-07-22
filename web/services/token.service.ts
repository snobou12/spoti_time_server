/** @format */

import * as jwt from "jsonwebtoken";
import TokenModel from "../models/token.model";
import { ConfigService } from "../../config/config.service";
import { Types } from "mongoose";
import { IAdmin } from "../models/admin.model";
import AdminDto from "../dtos/admin.dto";

const configService = new ConfigService();

declare module "jsonwebtoken" {
	export interface UserIDJwtPayload extends IAdmin {}
}

class TokenService {
	generateTokens(userData: AdminDto) {
		const accessToken = jwt.sign(
			userData,
			configService.get("JWT_ACCESS_SECRET"),
			{
				expiresIn: "24h",
			}
		);
		const refreshToken = jwt.sign(
			userData,
			configService.get("JWT_REFRESH_SECRET"),
			{
				expiresIn: "30d",
			}
		);
		return {
			accessToken,
			refreshToken,
		};
	}

	validateAccessToken(token: string) {
		try {
			const userData = <jwt.UserIDJwtPayload>(
				jwt.verify(token, configService.get("JWT_ACCESS_SECRET"))
			);
			return userData;
		} catch (e) {
			return null;
		}
	}
	validateRefreshToken(token: string) {
		try {
			const userData = <jwt.UserIDJwtPayload>(
				jwt.verify(token, configService.get("JWT_REFRESH_SECRET"))
			);

			return userData.id;
		} catch (e) {
			return null;
		}
	}

	async saveToken(id: Types.ObjectId, refreshToken: string) {
		const tokenData = await TokenModel.findOne({ user: id });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}
		const token = await TokenModel.create({ user: id, refreshToken });
		return token;
	}

	async removeToken(refreshToken: string) {
		const tokenData = await TokenModel.deleteOne({ refreshToken });
		return tokenData;
	}

	async findToken(refreshToken: string) {
		const tokenData = await TokenModel.findOne({ refreshToken });

		return tokenData;
	}
}

export default new TokenService();

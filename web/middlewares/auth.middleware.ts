
import { NextFunction, Response, Request } from "express";
import ApiError from "../exceptions/api.errors";
import TokenService from "../services/token.service";

const authMiddleware = (req: Request, res: Response, next: NextFunction) =>{
	try {
		const authorizationHeader = req.headers.authorization;

		if (!authorizationHeader) {
			return next(ApiError.UnauthorizedError());
		}

		const accessToken = authorizationHeader.split(" ")[1];
		if (!accessToken) {
			return next(ApiError.UnauthorizedError());
		}

		const userData = TokenService.validateAccessToken(accessToken);
		if (!userData) {
			return next(ApiError.UnauthorizedError());
		}

		req.user = userData;
		next();
	} catch (e) {
		return next(ApiError.UnauthorizedError());
	}
};

export default authMiddleware
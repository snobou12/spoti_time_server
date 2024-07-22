/** @format */

import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import ApiError from "../exceptions/api.errors";

const errorMiddleware: ErrorRequestHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err);
	if (err instanceof ApiError) {
		return res
			.status(err.status)
			.json({ message: err.message, errors: err.errors });
	}
	return res.status(500).json({ message: "Непредвиденная ошибка" });
};
export default errorMiddleware;

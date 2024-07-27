/** @format */

import { Request, Response, NextFunction } from "express";
import FeaturesService from "../services/features.service";

class FeaturesController {
	async getPostImageSrc(req: Request, res: Response, next: NextFunction) {
		try {
			const src = await FeaturesService.getPostImageSrc();
			return res.json(src);
		} catch (e) {
			next(e);
		}
	}
}
export default new FeaturesController();

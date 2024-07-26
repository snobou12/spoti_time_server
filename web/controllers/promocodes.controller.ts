/** @format */

import { Request, Response, NextFunction } from "express";
import PromocodesService from "../services/promocodes.service";

class PromocodesController {
	async getPromocodes(req: Request<{}, {}>, res: Response, next: NextFunction) {
		try {
			const promos = await PromocodesService.getPromocodes();
			return res.json(promos);
		} catch (e) {
			next(e);
		}
	}

	async deletePromocode(
		req: Request<{}, {}>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { promocodeId } = req.body;
			const response = await PromocodesService.deletePromocode(promocodeId);
			return res.json(response);
		} catch (e) {
			next(e);
		}
	}

	async createPromocode(
		req: Request<{}, {}>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { title, disabled, discount, oneTimeUsage } = req.body;
			const newPromo = await PromocodesService.createPromocode(
				title,
				disabled,
				discount,
				oneTimeUsage
			);
			return res.json(newPromo);
		} catch (e) {
			next(e);
		}
	}

	async switchFeaturePromocode(
		req: Request<{}, {}>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { promocodeId, feature } = req.body;
			const response = await PromocodesService.switchFeaturePromocode(
				promocodeId,
				feature
			);
			return res.json(response);
		} catch (e) {
			next(e);
		}
	}
}

export default new PromocodesController();

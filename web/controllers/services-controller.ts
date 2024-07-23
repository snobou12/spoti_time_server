import { Request, Response,NextFunction } from "express";
import PriceService from "../services/services.service";

class ServicesController {
  
	async getServices(req: Request<{}, {}>, res: Response, next: NextFunction){
		try {
			const services = await PriceService.getPrices();
			return res.json(services);
		} catch (e) {
			next(e);
		}
	}

	async changeService(req: Request<{}, {}>, res: Response, next: NextFunction){
		const {newService}=req.body;
		const response = await PriceService.changeService(newService);
		return res.json(response);
	}
}

export default new ServicesController();


import { Request, Response,NextFunction } from "express";
import OtherService from "../services/other.service";

class OtherController {
    async getMainData(req: Request<{}, {}>, res: Response, next: NextFunction) {
		try {
            const data = await OtherService.getMainData();
            return res.json(data);
		} catch (e) {
			next(e);
		}
	}
}
export default new OtherController();

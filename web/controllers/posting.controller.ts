import { Request, Response,NextFunction } from "express";
import BotService from "../../bot/db/services/bot.service";

class PostingController {
    async sendTestPost(req: Request<{}, {}>, res: Response, next: NextFunction) {
		try {
			const { text } = req.body;
            
            const data = await BotService.sendTestPost(text);
            return res.json(data);
		} catch (e) {
			next(e);
		}
	}

	async sendPost(req: Request<{}, {}>, res: Response, next: NextFunction){
		try{
			const {text, isAllUsers} = req.body;
			const data = await BotService.sendPost(text,isAllUsers);
			console.log("Рассылка произведена");
			return res.json(data);

		}
		catch(e){
			next(e);
		}
	}
}
export default new PostingController();

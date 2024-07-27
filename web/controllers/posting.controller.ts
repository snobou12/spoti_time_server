import { Request, Response,NextFunction } from "express";
import BotService from "../../bot/db/services/bot.service";
import FeaturesService from "../services/features.service";
import { cleanUploads } from "../helps/clean-uploads/cleanUploads";

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

	async uploadPostImage(req: Request, res: Response, next: NextFunction){
		try{
			if(req.file?.path){
				const filePath = req.file.path;
				const filename= req.file.filename;
				
				const src= filePath.split("\\").slice(-1)[0];
				const fullSrc = `http://localhost:8080/uploads/${src}`
				await FeaturesService.uploadPostImage(fullSrc);
				cleanUploads(filename);
				return res.json(fullSrc);
			}
		}
		catch(e){
			next(e);
		}
	}
}
export default new PostingController();

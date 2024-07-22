import bot from "../../index";

class BotService {
    async sendMessageFromBot(id:number,message:string){
        await bot.bot.telegram.sendMessage(id,message);
        return "Сообщение отправлено"
    }    
}

export default new BotService();

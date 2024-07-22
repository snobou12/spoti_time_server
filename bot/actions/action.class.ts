import {Telegraf} from "telegraf";
import { IBotContext } from "../context/context.interface";
import { IConfigService } from "../../config/config.interface";

export abstract class Action{
    constructor(public bot:Telegraf<IBotContext>,public configService:IConfigService){

    }
    abstract handle():void;
}
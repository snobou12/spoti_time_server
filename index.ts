import express from "express";
import cors from "cors";
import cookeParser from "cookie-parser"
import router from "./web/router/index";
import errorMiddleware from "./web/middlewares/error.middleware";
import bot from "./bot";
import { IAdmin } from "./web/models/admin.model";


declare global {
	namespace Express {
		export interface Request {
			user?: IAdmin;
		}
	}
}



const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cookeParser());

app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}));

app.use("/api",router);

app.use(errorMiddleware);


const start = async()=>{
    try{
        app.listen(PORT,()=>{
            console.log(`The server is running on ${PORT} port`)
            bot.init();
        })
    }
    catch(e){
        console.log(e);
    }
}

start();




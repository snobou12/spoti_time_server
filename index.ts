import express from "express";
import bot from "./bot";
const app = express();
const PORT = process.env.PORT;


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

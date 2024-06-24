import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(()=> {
    console.log("Conectado a MongoDB!")
}).catch((err)=> {
    console.log(err)
})


const app = express();

app.listen(3000, ()=> {
    console.log('Servidor corriendo en el puerto 3000')
})
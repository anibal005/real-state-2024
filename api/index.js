import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routers/user.route.js"
import authRouter from "./routers/auth.route.js"
dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(()=> {
    console.log("Conectado a MongoDB!")
}).catch((err)=> {
    console.log(err)
})


const app = express();

app.use(express.json())

app.listen(3000, ()=> {
    console.log('Servidor corriendo en el puerto 3000')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";


const app =express()

const port = process.env.PORT || 5000
app.use(cors({
    origin:"https://mealmint-fooddelivery.onrender.com",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)


const startServer = async()=>{
     connectDb()

    app.listen(port ,()=>{
        console.log(`server started at ${port}`)
    })
}

startServer()

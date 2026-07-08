import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { placeOrder } from "../controllers/order.controllers.js"

const orderRouter = express.Router()

orderRouter.post("/place-order", isAuth, placeOrder)

export default orderRouter
import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getMyOrders, getOrderById, placeOrder, updateOrderStatus } from "../controllers/order.controllers.js"

const orderRouter = express.Router()

orderRouter.post("/place-order", isAuth, placeOrder)
orderRouter.get("/my-orders", isAuth, getMyOrders)
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById)
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus)

export default orderRouter

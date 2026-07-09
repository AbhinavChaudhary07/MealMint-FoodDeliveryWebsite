import Shop from "../models/shop.model.js"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import { sendDeliveryOptMail } from "../utils/mail.js"

export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }
        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res.status(400).json({ message: "Enter Delivery Address" })
        }

        const groupItemsByShop = {}

        cartItems.forEach(item => {
            const shopId = item.shop
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = []
            }
            groupItemsByShop[shopId].push(item)
        });

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate("owner")
            if (!shop) {
                throw new Error(`Shop not found: ${shopId}`)
            }
            const items = groupItemsByShop[shopId]
            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
            return {
                shop: shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id || i._id,
                    image: i.image,
                    price: i.price,
                    quantity: i.quantity,
                    name: i.name
                }))
            }
        }))

        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })

        return res.status(201).json(newOrder)

    } catch (error) {
        return res.status(500).json({ message: `place order error: ${error.message}` })
    }
}

const orderPopulate = [
    { path: "user", select: "fullName email mobile" },
    { path: "shopOrders.shop", select: "name" },
    { path: "shopOrders.shopOrderItems.item", select: "name image price" },
    { path: "shopOrders.assignedDeliveryBoy", select: "fullName mobile location" }
]

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("role")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const query = user.role === "owner"
            ? { "shopOrders.owner": req.userId }
            : user.role === "deliveryBoy"
                ? {
                    "shopOrders.status": "out of delivery",
                    $or: [
                        { "shopOrders.assignedDeliveryBoy": req.userId },
                        { "shopOrders.assignedDeliveryBoy": null }
                    ]
                }
                : { user: req.userId }
        const orders = await Order.find(query).sort({ createdAt: -1 }).populate(orderPopulate)

        if (user.role === "owner") {
            const ownerOrders = orders.map((order) => {
                const orderObject = order.toObject()
                orderObject.shopOrders = orderObject.shopOrders.filter((shopOrder) => {
                    const ownerId = shopOrder.owner?._id || shopOrder.owner
                    return ownerId?.toString() === req.userId
                })
                return orderObject
            })
            return res.status(200).json(ownerOrders)
        }

        if (user.role === "deliveryBoy") {
            const deliveryOrders = orders.map((order) => {
                const orderObject = order.toObject()
                orderObject.shopOrders = orderObject.shopOrders.filter((shopOrder) => {
                    const assignedDeliveryBoyId = shopOrder.assignedDeliveryBoy?._id || shopOrder.assignedDeliveryBoy
                    return shopOrder.status === "out of delivery" &&
                        (!assignedDeliveryBoyId || assignedDeliveryBoyId?.toString() === req.userId)
                })
                return orderObject
            }).filter((order) => order.shopOrders.length > 0)

            return res.status(200).json(deliveryOrders)
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ message: `get my orders error: ${error.message}` })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate(orderPopulate)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        const isCustomer = order.user?._id?.toString() === req.userId
        const isOwner = order.shopOrders.some((shopOrder) => {
            const ownerId = shopOrder.owner?._id || shopOrder.owner
            return ownerId?.toString() === req.userId
        })
        const isDeliveryBoy = order.shopOrders.some((shopOrder) => {
            const dbId = shopOrder.assignedDeliveryBoy?._id || shopOrder.assignedDeliveryBoy
            return dbId?.toString() === req.userId
        })

        if (!isCustomer && !isOwner && !isDeliveryBoy) {
            return res.status(403).json({ message: "Not allowed to view this order" })
        }

        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({ message: `get order error: ${error.message}` })
    }
}

export const acceptDelivery = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.params

        const order = await Order.findById(orderId)
        if (!order) return res.status(404).json({ message: "Order not found" })

        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!shopOrder) return res.status(404).json({ message: "Shop order not found" })

        if (shopOrder.status !== "out of delivery") {
            return res.status(400).json({ message: "Order is not available for delivery" })
        }
        if (shopOrder.assignedDeliveryBoy) {
            return res.status(400).json({ message: "Order already accepted by another delivery boy" })
        }

        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()

        const populated = await order.populate(orderPopulate)
        return res.status(200).json(populated)
    } catch (error) {
        return res.status(500).json({ message: `accept delivery error: ${error.message}` })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params
        const { status } = req.body
        const validStatuses = ["pending", "preparing", "out of delivery", "delivered"]

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        const shopOrder = order.shopOrders.find((orderItem) => {
            const orderShopId = orderItem.shop?._id || orderItem.shop
            return orderShopId?.toString() === shopId
        })

        if (!shopOrder) {
            return res.status(404).json({ message: "Shop order not found" })
        }

        if (shopOrder.owner?.toString() !== req.userId) {
            return res.status(403).json({ message: "Not allowed to update this order" }) 
        }

        shopOrder.status = status
        await order.save()

        const availableBoys = status === "out of delivery"
            ? await User.find({ role: "deliveryBoy", isOnline: true }).select("fullName mobile")
            : []

        return res.status(200).json({ order, availableBoys })
    } catch (error) {
        return res.status(500).json({ message: `update order status error: ${error.message}` })
    }
}


export const sendDeliveryOtp =async(req,res)=>{
try {
    const {orderId ,shopOrederId}=req.body
    const order = await Order.findById(orderId).populate("user")
    const shopOrder = order.shopOrders.id(shopOrderId)
    if(!order && !shopOrder){
        return res.status(400).json({message:"invalid order/shopOrderid"})
    }
    const opt =Math.floor(1000 + Math.random() * 9000).toString()
    shopOrder.deliveryOtp=opt
    shopOrder.otpExpires=Date.now() + 5*60*1000
    await ordrer.save()
    await sendDeliveryOptMail(order.user,otp)
    return res.status(200).json({message: `Otp Sent Successfuly to${order.user?.fullName}`})
} catch (error) {
    return res.status(500).json({ message: `Otp error: ${error.message}` })
}

}


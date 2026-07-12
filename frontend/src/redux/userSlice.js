import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    socket: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find((i) => i.id == cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id == id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeCartItems: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addMyOrder: (state, action) => {
      state.myOrders.unshift(action.payload);
      state.cartItems = [];
      state.totalAmount = 0;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((order) => order._id == orderId);

      if (!order) return;

      if (Array.isArray(order.shopOrders)) {
        const shopOrder = order.shopOrders.find((shopOrder) => {
          const id = shopOrder.shop?._id || shopOrder.shop;
          return id == shopId;
        });
        if (shopOrder) shopOrder.status = status;
        return;
      }

      const id = order.shopOrders?.shop?._id || order.shopOrders?.shop;
      if (id == shopId) order.shopOrders.status = status;
    },
    updateRealtimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((order) => order._id == orderId);

      if (!order || !Array.isArray(order.shopOrders)) return;

      const shopOrder = order.shopOrders.find((shopOrder) => {
        const id = shopOrder.shop?._id || shopOrder.shop;
        return id == shopId;
      });

      if (shopOrder) shopOrder.status = status;
    },
    acceptDeliveryOrder: (state, action) => {
      const { orderId, shopOrderId, userId } = action.payload;
      const order = state.myOrders.find((o) => o._id === orderId);
      if (!order) return;
      const shopOrder = order.shopOrders.find((s) => s._id === shopOrderId);
      if (shopOrder) shopOrder.assignedDeliveryBoy = { _id: userId };
    },
    markShopOrderDelivered: (state, action) => {
      const { orderId, shopOrderId } = action.payload;
      const order = state.myOrders.find((o) => o._id === orderId);
      if (!order) return;
      const shopOrder = order.shopOrders.find((s) => s._id === shopOrderId);
      if (shopOrder) shopOrder.status = "delivered";
    },
  },
});

export const {
  setUserData,
  setCity,
  setShopInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeCartItems,
  setTotalAmount,
  setMyOrders,
  addMyOrder,
  setSocket,
  updateOrderStatus,
  updateRealtimeOrderStatus,
  acceptDeliveryOrder,
  markShopOrderDelivered
} = userSlice.actions;
export default userSlice.reducer;

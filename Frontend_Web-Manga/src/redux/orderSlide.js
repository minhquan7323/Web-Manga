import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload
            const itemOrder = state.orderItems.find((item) => item.product === orderItem.product)
            if (itemOrder) {
                itemOrder.amount += orderItem.amount || 1
            } else {
                state.orderItems.push({ ...orderItem, amount: orderItem.amount || 1 })
            }
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state.orderItems.find((item) => item.product === idProduct)
            if (itemOrder) {
                itemOrder.amount += 1
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state.orderItems.find((item) => item.product === idProduct)
            if (itemOrder && itemOrder.amount > 1) {
                itemOrder.amount -= 1
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state.orderItems.filter((item) => item.product === idProduct)
            state.orderItems = itemOrder
        },
        removeALlOrderProduct: (state, action) => {
            const { listChecked } = action.payload
            const itemOrders = state.orderItems.filter((item) => !listChecked.includes(item.product))
            state.orderItems = itemOrders
        }
    }
})

export const { addOrderProduct, removeOrderProduct, removeALlOrderProduct, increaseAmount, decreaseAmount } = orderSlice.actions

export default orderSlice.reducer

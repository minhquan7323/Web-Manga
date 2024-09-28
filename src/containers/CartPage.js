import React, { useState } from 'react';

function CartPage() {
    // Giả sử đây là dữ liệu giỏ hàng mẫu, bạn sẽ thay thế nó bằng dữ liệu thực từ context hoặc redux
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Product 1", price: 100, quantity: 1 },
        { id: 2, name: "Product 2", price: 200, quantity: 2 },
    ]);

    // Hàm tính tổng giá trị của giỏ hàng
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Hàm tăng số lượng sản phẩm
    const increaseQuantity = (id) => {
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedItems);
    };

    // Hàm giảm số lượng sản phẩm
    const decreaseQuantity = (id) => {
        const updatedItems = cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCartItems(updatedItems);
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeItem = (id) => {
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
    };

    return (
        <div>
            <h1>Cart Page</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>${item.price}</td>
                                    <td>
                                        <button onClick={() => decreaseQuantity(item.id)}>-</button>
                                        {item.quantity}
                                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                                    </td>
                                    <td>${item.price * item.quantity}</td>
                                    <td>
                                        <button onClick={() => removeItem(item.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h2>Total: ${getTotalPrice()}</h2>
                    <button>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );
}

export default CartPage;

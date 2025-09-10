import React, { useEffect, useState } from "react";
import {
  getCart,
  incrementCart,
  decrementCart,
  removeFromCart,
  checkout,
} from "./api";
import "./app.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [status, setStatus] = useState("");

  const TAX_RATE = 0.1;
  const DELIVERY_CHARGE = 50;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data);
    } catch (e) {
      setStatus(e.message);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      fetchCart();
    } catch (e) {
      setStatus(e.message);
    }
  };

  const handleIncrement = async (id) => {
    try {
      await incrementCart(id);
      fetchCart();
    } catch (e) {
      setStatus(e.message);
    }
  };

  const handleDecrement = async (id) => {
    try {
      await decrementCart(id);
      fetchCart();
    } catch (e) {
      setStatus(e.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await checkout();
      setStatus(`✅ Order #${res.id} placed!`);
      setCartItems([]);
    } catch (e) {
      setStatus(e.message);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + (cartItems.length ? DELIVERY_CHARGE : 0);

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>
      {status && <p className="status-msg">{status}</p>}

      {cartItems.length === 0 ? (
        <p className="empty-cart">🛒 Your cart is empty</p>
      ) : (
        <div className="cart-layout">
          {/* Left side: Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.product.imageUrl || "/default.png"}
                  alt={item.product.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p className="price">₹{item.product.price}</p>

                  <div className="quantity-controls">
                    <button onClick={() => handleDecrement(item.id)}>-</button>
                    <input type="number" value={item.quantity} readOnly />
                    <button onClick={() => handleIncrement(item.id)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right side: Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>Subtotal: <b>₹{subtotal.toFixed(2)}</b></p>
            <p>Tax (10%): <b>₹{tax.toFixed(2)}</b></p>
            <p>Delivery: <b>₹{cartItems.length ? DELIVERY_CHARGE : 0}</b></p>
            <hr />
            <h3>Total: ₹{total.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

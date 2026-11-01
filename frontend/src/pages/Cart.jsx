import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  removeFromCart,
  updateQuantity,
  clearCart
} from '../redux/cartSlice';

import { formatPrice } from '../utils/api';

export default function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * (item.quantity || 1),
    0
  );

  if (cartItems.length === 0) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <div className="empty-state-icon">✦</div>
          <h2>Your cart is empty.</h2>
          <p>Discover something extraordinary and add it to your cart.</p>
          <Link to="/shop" className="primary-button">
            EXPLORE PRODUCTS
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1>Shopping Cart<span>.</span></h1>
        <p>Review your items before checkout.</p>
      </section>

      <section className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item._id}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{formatPrice(item.price)}</p>

                <div className="quantity-control">
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({
                        id: item._id,
                        quantity: (item.quantity || 1) - 1
                      }))
                    }
                    disabled={(item.quantity || 1) <= 1}
                  >
                    −
                  </button>

                  <span>{item.quantity || 1}</span>

                  <button
                    onClick={() =>
                      dispatch(updateQuantity({
                        id: item._id,
                        quantity: (item.quantity || 1) + 1
                      }))
                    }
                    disabled={
                      (item.quantity || 1) >= (item.stock || 99)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-actions">
                <strong>
                  {formatPrice(
                    item.price * (item.quantity || 1)
                  )}
                </strong>

                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeFromCart(item._id))}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}

          <button
            className="clear-cart-btn"
            onClick={() => dispatch(clearCart())}
          >
            CLEAR CART
          </button>
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <Link to="/checkout" className="primary-button checkout-btn">
            PROCEED TO CHECKOUT
          </Link>

          <Link to="/shop" className="back-link">
            Continue Shopping
          </Link>
        </aside>
      </section>
    </main>
  );
}
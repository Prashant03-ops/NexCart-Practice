import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { clearCart } from '../redux/cartSlice';
import { apiRequest, formatPrice } from '../utils/api';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');

      script.src = 'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error('Unable to load Razorpay checkout.');
      }

      const shippingAddress = [
        address.street,
        address.city,
        address.state,
        address.postalCode,
        `Phone: ${address.phone}`
      ].join(', ');

      const razorpayOrder = await apiRequest('/api/payment/order', {
        method: 'POST',
        body: JSON.stringify({ amount: total })
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'NexCart',
        description: 'Shopping payment',
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            await apiRequest('/api/payment/verify', {
              method: 'POST',
              body: JSON.stringify(response)
            });

            const orderData = await apiRequest('/api/orders', {
              method: 'POST',
              body: JSON.stringify({
                items: cartItems.map((item) => ({
                  product: item._id,
                  qty: item.quantity || 1
                })),
                totalAmount: total,
                address: shippingAddress,
                paymentId: response.razorpay_payment_id
              })
            });

            dispatch(clearCart());

            navigate('/profile', {
              state: {
                orderSuccess: true,
                orderId: orderData.order?._id
              }
            });
          } catch (err) {
            setError(
              err.message ||
              'Payment was received, but order creation failed. Contact support with your payment ID.'
            );
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          contact: address.phone
        },

        theme: {
          color: '#245BFF'
        },

        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      if (!options.key) {
        throw new Error('Razorpay public key is missing from frontend .env.');
      }

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        setError(
          response.error?.description || 'Payment failed.'
        );
        setLoading(false);
      });

      paymentObject.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <h2>Your cart is empty.</h2>
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
        <span className="eyebrow">ALMOST THERE</span>
        <h1>Checkout<span>.</span></h1>
        <p>Enter your delivery details to continue.</p>
      </section>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handlePayment}
        >
          <h2>Shipping Information</h2>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Street Address</label>
            <input
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="House number and street"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                name="postalCode"
                value={address.postalCode}
                onChange={handleChange}
                placeholder="PIN code"
                pattern="[0-9]{6}"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-button checkout-btn"
            disabled={loading}
          >
            {loading ? 'PROCESSING...' : 'PAY SECURELY'}
          </button>

          <p className="checkout-note">
            You will be redirected to Razorpay's secure payment window.
          </p>
        </form>

        <aside className="cart-summary">
          <h2>Your Order</h2>

          {cartItems.map((item) => (
            <div className="summary-row" key={item._id}>
              <span>
                {item.name} × {item.quantity || 1}
              </span>

              <span>
                {formatPrice(
                  item.price * (item.quantity || 1)
                )}
              </span>
            </div>
          ))}

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <Link to="/cart" className="back-link">
            ← Back to Cart
          </Link>
        </aside>
      </div>
    </main>
  );
}
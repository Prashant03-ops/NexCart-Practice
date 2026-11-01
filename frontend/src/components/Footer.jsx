import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/">
            <img
              src="/NexCart%20Neon%20Shopping%20Logo.png"
              alt="NexCart"
              className="footer-logo"
            />
          </Link>

          <p>
            Discover products that make everyday life extraordinary.
          </p>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/profile">My Profile</Link>
        </div>

        <div className="footer-links">
          <h4>Contact</h4>
          <a href="mailto:support@nexcart.com">
            support@nexcart.com
          </a>
          <span>Online shopping, made better.</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NexCart. All rights reserved.</p>
        <p>Shop smarter. Live better.</p>
      </div>
    </footer>
  );
}
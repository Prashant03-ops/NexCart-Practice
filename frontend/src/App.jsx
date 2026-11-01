
import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import { Provider } from 'react-redux';

import store from './redux/store';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';

function AppLayout() {
  return (
    <BrowserRouter>
      <div className="app-shell">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/shop" element={<Shop />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/login"
            element={<Auth mode="login" />}
          />

          <Route
            path="/register"
            element={<Auth mode="register" />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={<Admin />}
          />

          {/* Not Found */}
          <Route
            path="*"
            element={
              <main className="page-shell">
                <div className="product-message">
                  <h2>Page not found</h2>

                  <a className="primary-button" href="/">
                    GO HOME
                  </a>
                </div>
              </main>
            }
          />
        </Routes>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Provider>
  );
}

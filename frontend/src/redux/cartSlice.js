import { createSlice } from '@reduxjs/toolkit';

const readCart = () => {
  try {
    return JSON.parse(
      localStorage.getItem('cartItems') || '[]'
    );
  } catch {
    return [];
  }
};

const initialState = {
  cartItems: readCart()
};

const persist = (items) => {
  localStorage.setItem(
    'cartItems',
    JSON.stringify(items)
  );
};

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {

    addToCart: (state, action) => {

      const incoming = action.payload;

      const existing = state.cartItems.find(
        (item) => item._id === incoming._id
      );

      if (existing) {

        existing.quantity = Math.min(
          (existing.quantity || 1) + 1,
          incoming.stock || 99
        );

      } else {

        state.cartItems.push({
          ...incoming,
          quantity: 1
        });

      }

      persist(state.cartItems);
    },

    updateQuantity: (state, action) => {

      const { id, quantity } = action.payload;

      const item = state.cartItems.find(
        (product) => product._id === id
      );

      if (item) {

        item.quantity = Math.max(
          1,
          Math.min(
            Number(quantity) || 1,
            item.stock || 99
          )
        );

      }

      persist(state.cartItems);
    },

    removeFromCart: (state, action) => {

      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      persist(state.cartItems);
    },

    clearCart: (state) => {

      state.cartItems = [];

      localStorage.removeItem('cartItems');
    }

  }
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;

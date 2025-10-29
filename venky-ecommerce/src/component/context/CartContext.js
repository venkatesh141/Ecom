// Import React core features
import React, { createContext, useReducer, useContext, useEffect } from "react";

// 1️⃣ Create a context object for the cart
// This allows any component to access cart data without passing props manually
const CartContext = createContext();

// 2️⃣ Initial state for the cart
// If cart data exists in localStorage, use it. Otherwise start with empty array []
const initialState = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
}

// 3️⃣ Reducer function: controls how cart state changes based on different "actions"
const cartReducer = (state, action) => {
    switch (action.type) {

        // -------------------- ADD ITEM --------------------
        case 'ADD_ITEM': {
            // Check if the item already exists in the cart
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            let newCart;

            if (existingItem) {
                // If item exists, just increase its quantity
                newCart = state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // If item does not exist, add it to cart with quantity = 1
                newCart = [...state.cart, { ...action.payload, quantity: 1 }];
            }

            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(newCart));

            // Return the new state
            return { ...state, cart: newCart };
        }

        // -------------------- REMOVE ITEM --------------------
        case 'REMOVE_ITEM': {
            // Remove the item completely by filtering it out
            const newCart = state.cart.filter(item => item.id !== action.payload.id);

            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(newCart));

            return { ...state, cart: newCart };
        }

        // -------------------- INCREMENT ITEM --------------------
        case 'INCREMENT_ITEM': {
            // Increase quantity of the matching item
            const newCart = state.cart.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            localStorage.setItem('cart', JSON.stringify(newCart));

            return { ...state, cart: newCart };
        }

        // -------------------- DECREMENT ITEM --------------------
        case 'DECREMENT_ITEM': {
            // Decrease quantity but only if quantity > 1 (so it never goes below 1)
            const newCart = state.cart.map(item =>
                item.id === action.payload.id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );

            localStorage.setItem('cart', JSON.stringify(newCart));

            return { ...state, cart: newCart };
        }

        // -------------------- CLEAR CART --------------------
        case 'CLEAR_CART': {
            // Remove all items by clearing localStorage
            localStorage.removeItem('cart');

            // Return empty cart
            return { ...state, cart: [] };
        }

        // -------------------- DEFAULT --------------------
        default:
            // If action type is unknown, just return current state unchanged
            return state;
    }
};



// Export a React component named CartProvider so other files can import it
export const CartProvider = ({ children }) => {
    // `children` is a special prop that contains whatever JSX is placed
    // between <CartProvider> ... </CartProvider> when you use it.

    // useReducer sets up state management:
    // - `cartReducer` is the function that defines how state changes (you wrote it).
    // - `initialState` is the starting value for state (contains the cart array).
    // The call returns an array with two items:
    //   state  -> the current state (object with `cart`)
    //   dispatch -> a function you call to send actions (like {type: 'ADD_ITEM', payload: item})
    const [state, dispatch] = useReducer(cartReducer, initialState);


    // useEffect runs side-effects after React renders.
    // This effect will run every time `state.cart` changes (because it's in the dependency array).
    // Inside the effect we store the cart in localStorage so the cart persists across page reloads.
    useEffect(() => {
        // localStorage can only store strings, so we convert the cart array to JSON text.
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }, [state.cart]); // the effect depends on state.cart — run when cart changes

    // The component returns a provider that makes `cart` and `dispatch` available
    // to any child component that calls useContext(CartContext).
    return (
        // Provide an object value with the current cart and the dispatch function
        <CartContext.Provider value={{ cart: state.cart, dispatch }}>
            {children}   {/* Render whatever was passed as children (usually your app) */}
        </CartContext.Provider>
    )
}

// A small custom hook to make it easy to access the cart context.
// Instead of writing useContext(CartContext) every time, you call useCart().
export const useCart = () => useContext(CartContext);

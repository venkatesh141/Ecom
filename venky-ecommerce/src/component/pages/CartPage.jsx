import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

const CartPage = () => {
  const { cart, dispatch } = useCart();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const incrementItem = (product) => {
    dispatch({ type: "INCREMENT_ITEM", payload: product });
  };

  const decrementItem = (product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem && cartItem.quantity > 1) {
      dispatch({ type: "DECREMENT_ITEM", payload: product });
    } else {
      dispatch({ type: "REMOVE_ITEM", payload: product });
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!ApiService.isAuthenticated()) {
      setMessage("⚠️ You need to login first before placing an order.");
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 3000);
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderRequest = {
      totalPrice,
      items: orderItems,
    };

    try {
      const response = await ApiService.createOrder(orderRequest);
      setMessage(response.message);
      setTimeout(() => setMessage(""), 5000);
      if (response.status === 200) {
        dispatch({ type: "CLEAR_CART" });
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "❌ Failed to place order"
      );
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#e8f0ff", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-lg border-primary rounded-4">
            <div className="card-body">
              <h2 className="text-center text-primary fw-bold mb-4">🛒 My Cart</h2>

              {message && (
                <div className="alert alert-info text-center">{message}</div>
              )}

              {cart.length === 0 ? (
                <div className="text-center text-secondary fs-5">
                  Your cart is empty 😞
                </div>
              ) : (
                <>
                  <ul className="list-group mb-4">
                    {cart.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center p-3 mb-3 shadow-sm rounded-3 border-primary"
                        style={{ backgroundColor: "#f8fbff" }}
                      >
                        <div className="d-flex align-items-center mb-3 mb-md-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="rounded me-3"
                            style={{ width: "90px", height: "90px", objectFit: "cover" }}
                          />
                          <div>
                            <h5 className="text-primary fw-semibold mb-1">
                              {item.name}
                            </h5>
                            <p className="text-muted small mb-1">
                              {item.description}
                            </p>
                            <p className="text-secondary fw-bold mb-0">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-primary btn-sm rounded-circle"
                            onClick={() => decrementItem(item)}
                          >
                            −
                          </button>
                          <span className="mx-3 fw-bold fs-5">
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-outline-primary btn-sm rounded-circle"
                            onClick={() => incrementItem(item)}
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="text-primary fw-bold mb-0">
                      Total: ₹{totalPrice.toFixed(2)}
                    </h4>
                    <button
                      className="btn btn-primary btn-lg px-4 rounded-3"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

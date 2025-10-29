import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = ({ products }) => {
  const { cart, dispatch } = useCart();

  const addToCart = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

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

  return (
    <div className="container my-5">
      <div className="row g-4">
        {products.map((product, index) => {
          const cartItem = cart.find((item) => item.id === product.id);
          return (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
              <div
                className="card h-100 border-0 shadow-lg position-relative overflow-hidden"
                style={{
                  borderRadius: "15px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(0,0,0,0.1)";
                }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div
                    className="overflow-hidden"
                    style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title text-primary fw-bold mb-2 text-center">
                      {product.name}
                    </h5>
                    <p className="card-text small text-muted text-center">
                      {product.description.length > 60
                        ? product.description.slice(0, 60) + "..."
                        : product.description}
                    </p>
                    <h6 className="fw-bold text-success text-center mb-3">
                      ${product.price.toFixed(2)}
                    </h6>
                  </div>
                </Link>

                <div className="card-footer bg-white border-0 d-flex justify-content-center pb-4">
                  {cartItem ? (
                    <div
                      className="btn-group shadow-sm"
                      role="group"
                      style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                      <button
                        className="btn btn-outline-danger fw-bold"
                        onClick={() => decrementItem(product)}
                      >
                        −
                      </button>
                      <button className="btn btn-light fw-bold px-3" disabled>
                        {cartItem.quantity}
                      </button>
                      <button
                        className="btn btn-outline-success fw-bold"
                        onClick={() => incrementItem(product)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary w-75 fw-bold shadow-sm"
                      style={{
                        borderRadius: "10px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;

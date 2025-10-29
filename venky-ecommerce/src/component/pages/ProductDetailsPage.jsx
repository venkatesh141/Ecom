import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { cart, dispatch } = useCart();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await ApiService.getProductById(productId);
            setProduct(response.product);
        } catch (error) {
            console.log(error.message || error);
        }
    };

    const addToCart = () => {
        if (product) {
            dispatch({ type: "ADD_ITEM", payload: product });
        }
    };

    const incrementItem = () => {
        if (product) {
            dispatch({ type: "INCREMENT_ITEM", payload: product });
        }
    };

    const decrementItem = () => {
        if (product) {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && cartItem.quantity > 1) {
                dispatch({ type: "DECREMENT_ITEM", payload: product });
            } else {
                dispatch({ type: "REMOVE_ITEM", payload: product });
            }
        }
    };

    if (!product) {
        return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading product details...</p>;
    }

    const cartItem = cart.find(item => item.id === product.id);

    const containerStyle = {
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "white",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    };

    const imageStyle = {
        width: "100%",
        maxHeight: "400px",
        objectFit: "cover",
        borderRadius: "8px",
        marginBottom: "20px"
    };

    const buttonStyle = {
        backgroundColor: "#0056b3",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "4px",
        cursor: "pointer",
        margin: "5px"
    };

    const quantityStyle = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "15px"
    };

    return (
        <div style={containerStyle}>
            <img src={product?.imageUrl} alt={product?.name} style={imageStyle} />

            <h1>{product?.name}</h1>
            <p>{product?.description}</p>
            <h3>${product.price.toFixed(2)}</h3>

            {cartItem ? (
                <div style={quantityStyle}>
                    <button style={buttonStyle} onClick={decrementItem}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button style={buttonStyle} onClick={incrementItem}>+</button>
                </div>
            ) : (
                <button style={buttonStyle} onClick={addToCart}>Add To Cart</button>
            )}
        </div>
    );
};

export default ProductDetailsPage;

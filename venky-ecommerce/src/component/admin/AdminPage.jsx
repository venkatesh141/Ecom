// AdminPage.jsx
// This is the main admin dashboard page.
// It provides navigation buttons to manage categories, products, and orders.

import React from "react";
import { useNavigate } from "react-router-dom"; 
// Hook to navigate programmatically

const AdminPage = () => {
    const navigate = useNavigate();

    // ------- Styles for Admin Page -------
    const containerStyle = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffe5e5, #ff9999)",
        padding: "20px"
    };

    const titleStyle = {
        color: "#b30000",
        fontSize: "2.5rem",
        marginBottom: "30px"
    };

    const buttonStyle = {
        backgroundColor: "#ff4d4d",
        color: "#fff",
        border: "none",
        padding: "15px 25px",
        margin: "10px",
        fontSize: "1rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.3s ease"
    };

    const buttonHoverStyle = {
        backgroundColor: "#e60000"
    };

    return (
        <div style={containerStyle}>
            {/* Page title */}
            <h1 style={titleStyle}>Welcome Admin</h1>

            {/* Navigation buttons */}
            <button 
                style={buttonStyle} 
                onClick={() => navigate("/admin/categories")}
            >
                Manage Categories
            </button>

            <button 
                style={buttonStyle} 
                onClick={() => navigate("/admin/products")}
            >
                Manage Products
            </button>

            <button 
                style={buttonStyle} 
                onClick={() => navigate("/admin/orders")}
            >
                Manage Orders
            </button>
        </div>
    );
}

export default AdminPage;

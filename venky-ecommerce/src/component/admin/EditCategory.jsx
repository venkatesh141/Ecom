// EditCategory.jsx
// This page allows the admin to edit an existing category's name.

import React, { useState, useEffect } from "react"; // React + hooks
import ApiService from "../../service/ApiService"; // API helper functions
import { useNavigate, useParams } from "react-router-dom"; // Navigation and URL parameters

// Define component
const EditCategory = () => {
  const { categoryId } = useParams(); // Get categoryId from URL

  const [name, setName] = useState(""); // Store category name
  const [message, setMessage] = useState(""); // Store success/error messages

  const navigate = useNavigate(); // Navigation hook

  // Run when component loads or categoryId changes
  useEffect(() => {
    fetchCategory(categoryId);
  }, [categoryId]);

  // ------- Fetch category details -------
  const fetchCategory = async () => {
    try {
      const response = await ApiService.getCategoryById(categoryId);
      setName(response.category.name); // Prefill input
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to get a category by id"
      );
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  // ------- Handle form submit -------
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent refresh
    try {
      const response = await ApiService.updateCategory(categoryId, { name });

      if (response.status === 200) {
        setMessage(response.message);

        // Redirect after showing success message
        setTimeout(() => {
          setMessage("");
          navigate("/admin/categories");
        }, 3000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to save a category"
      );
    }
  };

  // ------- Inline styles for admin red theme -------
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffe5e5, #ff9999)",
    padding: "20px",
    color: "#b30000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  const formStyle = {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%"
  };

  const messageStyle = {
    color: "red",
    marginBottom: "15px",
    textAlign: "center"
  };

  // ------- JSX (UI) -------
  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Edit Category
        </h2>

        {/* Show error/success message */}
        {message && <p style={messageStyle}>{message}</p>}

        {/* Category name input */}
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        {/* Update button */}
        <button type="submit" style={buttonStyle}>
          Update
        </button>
      </form>
    </div>
  );
};

export default EditCategory;

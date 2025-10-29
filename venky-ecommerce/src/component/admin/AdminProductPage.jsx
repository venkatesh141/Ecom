// AdminProductPage.jsx
// This component shows a paginated list of products for admin management.
// Admins can add, edit, or delete products.

import React, { useState, useEffect } from "react"; // React + hooks
import { useNavigate } from "react-router-dom"; // For page navigation
import Pagination from "../common/Pagination"; // Pagination component
import ApiService from "../../service/ApiService"; // Backend API service

// Define component
const AdminProductPage = () => {
  const navigate = useNavigate(); // Navigation hook

  // State: store current products for display
  const [products, setProducts] = useState([]);

  // State: current pagination page
  const [currentPage, setCurrentPage] = useState(1);

  // State: total number of pages
  const [totalPages, setTotalPages] = useState(0);

  // State: error message
  const [error, setError] = useState(null);

  const itemsPerPage = 10; // Items shown per page

  // ------- Fetch products from backend -------
  const fetchProducts = async () => {
    try {
      const response = await ApiService.getAllProducts(); // API call
      const productList = response.productList || [];

      setTotalPages(Math.ceil(productList.length / itemsPerPage)); // Set total pages

      setProducts(
        productList.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      ); // Show only current page products
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Unable to fetch products"
      );
    }
  };

  // Run fetchProducts when component loads or page changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // ------- Navigate to edit product page -------
  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  // ------- Delete a product -------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      try {
        await ApiService.deleteProduct(id);
        fetchProducts(); // Refresh after deletion
      } catch (error) {
        setError(
          error.response?.data?.message || error.message || "Unable to delete product"
        );
      }
    }
  };

  // ------- Inline Styles for Admin Theme -------
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffe5e5, #ff9999)",
    padding: "20px",
    color: "#b30000"
  };

  const titleStyle = {
    fontSize: "2rem",
    marginBottom: "20px"
  };

  const buttonStyle = {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    margin: "5px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#cc0000"
  };

  // ------- JSX (UI) -------
  return (
    <div style={containerStyle}>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <h2 style={titleStyle}>Products</h2>

          {/* Add product button */}
          <button
            style={buttonStyle}
            onClick={() => navigate("/admin/add-product")}
          >
            Add Product
          </button>

          {/* Product list */}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {products.map((product) => (
              <li
                key={product.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  borderBottom: "1px solid #ddd"
                }}
              >
                <span>{product.name}</span>
                <div>
                  <button
                    style={buttonStyle}
                    onClick={() => handleEdit(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    style={deleteButtonStyle}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminProductPage;

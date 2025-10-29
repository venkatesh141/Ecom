// AdminCategoryPage.jsx
// This component lists all categories for admin and allows add, edit, delete operations

import React, { useState, useEffect } from "react"; 
// Import React and hooks: useState (state variables) and useEffect (side effects)

import ApiService from "../../service/ApiService"; 
// Service to call backend APIs

import { useNavigate } from "react-router-dom"; 
// Hook to navigate programmatically between routes


// Define the AdminCategoryPage component
const AdminCategoryPage = () => {

  // State: list of category objects from backend
  const [categories, setCategories] = useState([]);

  // Hook to navigate to other routes programmatically
  const navigate = useNavigate();

  // useEffect runs once after component mounts to fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // ------- Function: fetchCategories -------
  // Fetches categories from backend and updates state
  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAllCategory();
      setCategories(response.categoryList || []);
    } catch (error) {
      console.log("Error fetching category list", error);
    }
  };

  // ------- Function: handleEdit -------
  // Navigate to edit category page for given id
  const handleEdit = (id) => {
    navigate(`/admin/edit-category/${id}`);
  };

  // ------- Function: handleDelete -------
  // Deletes a category after user confirmation
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (confirmed) {
      try {
        await ApiService.deleteCategory(id);
        fetchCategories(); // Refresh list after deletion
      } catch (error) {
        console.log("Error deleting category by id", error);
      }
    }
  };

  // Styles for admin red theme
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "linear-gradient(135deg, #ffe5e5, #ff9999)", // red gradient background
    padding: "20px"
  };

  const cardStyle = {
    maxWidth: "600px",
    width: "100%",
    padding: "20px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
  };

  const buttonStyle = {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    margin: "5px"
  };

  const titleStyle = {
    color: "#b30000",
    textAlign: "center",
    marginBottom: "20px"
  };

  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ddd"
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "10px"
  };

  // ------- JSX (UI) -------
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        {/* Page title */}
        <h2 style={titleStyle}>Categories</h2>

        {/* Button to add new category */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <button style={buttonStyle} onClick={() => navigate('/admin/add-category')}>
            Add Category
          </button>
        </div>

        {/* List of categories */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {categories.map((category) => (
            <li key={category.id} style={listItemStyle}>

              {/* Category name */}
              <span>{category.name}</span>

              {/* Edit/Delete buttons */}
              <div style={buttonGroupStyle}>
                <button style={buttonStyle} onClick={() => handleEdit(category.id)}>Edit</button>
                <button style={buttonStyle} onClick={() => handleDelete(category.id)}>Delete</button>
              </div>

            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

// Export component
export default AdminCategoryPage;

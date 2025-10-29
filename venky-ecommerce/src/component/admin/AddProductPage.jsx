// AddProductPage.jsx
// This file contains the AddProductPage component with detailed comments explaining each part

import React, { useState, useEffect } from "react"; 
// Import React and hooks: useState (state variables) and useEffect (side effects)

import { useNavigate } from "react-router-dom"; 
// useNavigate hook to redirect user programmatically

import ApiService from "../../service/ApiService"; 
// Service to communicate with backend APIs

// Define the AddProductPage component
const AddProductPage = () => {

  // State to store selected image file
  const [image, setImage] = useState(null);

  // State to store list of categories fetched from backend
  const [categories, setCategories] = useState([]);

  // State to store selected category id
  const [categoryId, setCategoryId] = useState('');

  // State to store product name
  const [name, setName] = useState('');

  // State to store product description
  const [description, setDescription] = useState('');

  // State to store product price
  const [price, setPrice] = useState('');

  // State to store success/error message
  const [message, setMessage] = useState('');

  // Hook to programmatically navigate to another page
  const navigate = useNavigate();

  // useEffect runs once when page loads to fetch categories
  useEffect(() => {
    ApiService.getAllCategory()
      .then((res) => setCategories(res.categoryList))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ------- Function: handle image selection -------
  const handleImage = (e) => {
    // Store the first selected file
    setImage(e.target.files[0]);
  };

  // ------- Function: handle form submission -------
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing page

    try {
      // Create FormData to send file + text data
      const formData = new FormData();
      formData.append('image', image);
      formData.append('categoryId', categoryId);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);

      // Call API to add product
      const response = await ApiService.addProduct(formData);

      if (response.status === 200) {
        // Show success message
        setMessage(response.message);

        // After 1 second → clear message and navigate to products list
        setTimeout(() => {
          setMessage('');
          navigate('/admin/products');
        }, 1000);
      }

    } catch (error) {
      // Show error message if API fails
      setMessage(error.response?.data?.message || error.message || 'Unable to upload product');
    }
  };

  // Styles for admin red theme
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ffe5e5, #ff9999)", // red gradient background
    padding: "20px"
  };

  const formStyle = {
    maxWidth: "500px",
    width: "100%",
    padding: "30px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
  };

  const buttonStyle = {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "10px",
    width: "100%",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  const messageStyle = {
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    textAlign: "center",
    color: "#721c24",
    backgroundColor: "#f8d7da"
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        
        {/* Page Title */}
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#b30000" }}>Add Product</h2>

        {/* Show message if available */}
        {message && <div style={messageStyle}>{message}</div>}

        {/* Input: Select product image */}
        <input type="file" onChange={handleImage} style={{ marginBottom: "15px" }} />

        {/* Select category dropdown */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px" }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option value={cat.id} key={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Input: Product Name */}
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px" }}
        />

        {/* Textarea: Product Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px" }}
        />

        {/* Input: Product Price */}
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px" }}
        />

        {/* Submit button */}
        <button type="submit" style={buttonStyle}>Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;

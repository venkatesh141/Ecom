// EditProductPage.jsx
// Page for editing an existing product in the admin panel
// Includes comments explaining each part of the code

import React, { useState, useEffect } from "react"; // React + hooks
import { useNavigate, useParams } from "react-router-dom"; // Navigation + URL parameters

import ApiService from "../../service/ApiService"; // API helper functions

const EditProductPage = () => {
    const { productId } = useParams(); // Get productId from URL

    // State variables
    const [image, setImage] = useState(null); // For new image upload
    const [categories, setCategories] = useState([]); // List of categories
    const [categoryId, setCategoryId] = useState(''); // Selected category ID
    const [name, setName] = useState(''); // Product name
    const [description, setDescription] = useState(''); // Product description
    const [price, setPrice] = useState(''); // Product price
    const [imageUrl, setImageUrl] = useState(null); // Preview image URL
    const [message, setMessage] = useState(''); // Success/error message

    const navigate = useNavigate(); // Navigation hook

    // Fetch product and category data when page loads
    useEffect(() => {
        ApiService.getAllCategory().then((res) => setCategories(res.categoryList));

        if (productId) {
            ApiService.getProductById(productId).then((response) => {
                setName(response.product.name);
                setDescription(response.product.description);
                setPrice(response.product.price);
                setCategoryId(response.product.categoryId);
                setImageUrl(response.product.imageUrl); // Show existing image
            });
        }
    }, [productId]);

    // Handle image selection
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0])); // Preview new image
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            if (image) {
                formData.append('image', image);
            }

            formData.append('productId', productId);
            formData.append('categoryId', categoryId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);

            const response = await ApiService.updateProduct(formData);

            if (response.status === 200) {
                setMessage(response.message);

                setTimeout(() => {
                    setMessage('');
                    navigate('/admin/products'); // Go back to product list
                }, 1000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to update product');
        }
    };

    // -------- Red admin theme inline styles --------
    const containerStyle = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffe5e5, #ff9999)",
        padding: "20px",
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
        maxWidth: "500px"
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

    // -------- JSX (UI) --------
    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Product</h2>

                {/* Show success/error message */}
                {message && <div style={messageStyle}>{message}</div>}

                {/* File input for image */}
                <input type="file" onChange={handleImageChange} style={inputStyle} />

                {/* Image preview */}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={name}
                        style={{ width: "100%", marginBottom: "15px", borderRadius: "6px" }}
                    />
                )}

                {/* Category dropdown */}
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Product name */}
                <input
                    type="text"
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                />

                {/* Product description */}
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...inputStyle, height: "100px" }}
                />

                {/* Price */}
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={inputStyle}
                />

                {/* Submit button */}
                <button type="submit" style={buttonStyle}>
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;

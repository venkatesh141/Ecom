import React, { useEffect, useState } from "react";  
// Import React and its hooks: useState (for variables) and useEffect (for automatic function calls)

import { useLocation } from "react-router-dom";  
// useLocation helps us read the URL (example: ?search=phone)

import ProductList from "../common/ProductList";  
// Import the ProductList component to display all the products neatly

import Pagination from "../common/Pagination";  
// Import Pagination component to move between pages

import ApiService from "../../service/ApiService";  
// Import ApiService which connects to the backend API

// Import the CSS file for styling this Home page


// 🏠 Home Component — This is the main page of the application
const Home = () => {

    const location = useLocation();  
    // Get the current URL to access query parameters (like ?search=laptop)

    const [products, setProducts] = useState([]);  
    // To store the list of products to be shown on screen

    const [currentPage, setCurrentPage] = useState(1);  
    // To keep track of the current page number

    const [totalPages, setTotalPages] = useState(0);  
    // To store total pages (we’ll calculate it later)

    const [error, setError] = useState(null);  
    // To store any error message if API call fails

    const itemsPerPage = 10;  
    // Number of products shown on one page


    // 🎯 useEffect — Runs automatically when search query or current page changes
    useEffect(() => {

        const fetchProducts = async () => {
            try {
                let allProducts = [];  
                // Temporary array to hold all fetched products

                const queryParams = new URLSearchParams(location.search);  
                // Read the URL query parameters (like ?search=mobile)

                const searchItem = queryParams.get("search");  
                // Extract the value of 'search' if present

                if (searchItem) {
                    // 🔍 If there is a search term in URL, call API to search products
                    const response = await ApiService.searchProducts(searchItem);
                    allProducts = response.productList || [];
                } else {
                    // 🛍️ Otherwise, fetch all available products
                    const response = await ApiService.getAllProducts();
                    allProducts = response.productList || [];
                }

                // 🧮 Calculate total number of pages
                setTotalPages(Math.ceil(allProducts.length / itemsPerPage));

                // ✂️ Slice array to show products for the current page only
                setProducts(
                    allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                );

            } catch (error) {
                // ⚠️ If API fails, show proper error message
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to fetch products"
                );
            }
        };

        // 🚀 Call function to load products
        fetchProducts();

    }, [location.search, currentPage]);
    // Re-run useEffect when search text or current page changes


    // 🖼️ What user sees on screen
    return (
        <div className="home">

            {error ? (
                // ⚠️ If there’s an error, show message in red
                <p className="error-message">{error}</p>

            ) : (
                <div className="home-content">

                    {/* 🧾 Show all products */}
                    <ProductList products={products} />

                    {/* 🔢 Pagination bar */}
                    <div className="pagination-container">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;  
// Export this component so other parts of the app can use it

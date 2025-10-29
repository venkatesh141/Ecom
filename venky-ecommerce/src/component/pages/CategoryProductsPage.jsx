import React, { useState, useEffect } from "react";  
// Import React and its hooks: useState (for variables) and useEffect (for running code automatically)

import { useParams } from "react-router-dom";  
// useParams helps to get the value from the URL (example: /category/2 → categoryId = 2)

import ApiService from "../../service/ApiService";  
// Import ApiService file which handles API (backend) calls

import ProductList from "../common/ProductList";  
// Import the ProductList component to display all products

import Pagination from "../common/Pagination";  
// Import Pagination component for page navigation

// Import CSS for page styling


// Create a component named CategoryProductsPage
const CategoryProductsPage = () => {

    const { categoryId } = useParams();  
    // Get the categoryId from the URL (dynamic value)

    const [products, setProducts] = useState([]);  
    // To store all products in this category

    const [currentPage, setCurrentPage] = useState(1);  
    // To store which page user is currently on

    const [totalPages, setTotalPages] = useState(0);  
    // To store total number of pages (we calculate this later)

    const [error, setError] = useState(null);  
    // To store any error message (like failed API call)

    const itemsPerPage = 8;  
    // Number of products shown on each page


    // This runs whenever categoryId or currentPage changes
    useEffect(() => {
        fetchProducts();  
        // Call function to get products for this category
    }, [categoryId, currentPage]);


    // Function to fetch all products from backend
    const fetchProducts = async () => {
        try {
            const response = await ApiService.getAllProductsByCategoryId(categoryId);  
            // API call to get products by category ID

            const allProducts = response.productList || [];  
            // Get product list or use an empty array if not found

            setTotalPages(Math.ceil(allProducts.length / itemsPerPage));  
            // Calculate how many pages needed (example: 20 products → 3 pages if 8 per page)

            // Slice the list to show only products for current page
            setProducts(
                allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            );  
        } catch (error) {
            // If API call fails, store error message
            setError(error.response?.data?.message || error.message || 'Unable to fetch products by category id');  
        }
    }


    // UI part (what user sees)
    return(
        <div className="home">
            {error ? (
                // If error exists, show error message
                <p className="error-message">{error}</p> 
            ) : (
                <div>
                    {/* Show list of products */}
                    <ProductList products={products}/> 

                    {/* Show pagination below product list */}
                    <Pagination  
                        currentPage={currentPage}  
                        totalPages={totalPages}  
                        onPageChange={(page)=> setCurrentPage(page)}  
                        // When page changes, update currentPage
                    />
                </div>
            )}
        </div>
    )
}

export default CategoryProductsPage;  
// Export component so it can be used in other parts of the app

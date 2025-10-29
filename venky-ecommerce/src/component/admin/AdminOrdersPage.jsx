// AdminOrdersPage.jsx
// This component lists all orders for the admin panel,
// with filters for status, pagination, and order details navigation

import React, { useState, useEffect } from "react"; 
// Import React and hooks for state & side effects

import { useNavigate } from "react-router-dom"; 
// Hook to navigate programmatically

import Pagination from "../common/Pagination"; 
// Reusable pagination component

import ApiService from "../../service/ApiService"; 
// API helper for backend calls

// Possible order statuses
const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrdersPage = () => {

    // State: full order list
    const [orders, setOrders] = useState([]);

    // State: filtered orders for display
    const [filteredOrders, setFilteredOrders] = useState([]);

    // State: selected filter for status
    const [statusFilter, setStatusFilter] = useState('');

    // State: selected search status (API-based)
    const [searchStatus, setSearchStatus] = useState('');

    // State: pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // State: error message
    const [error, setError] = useState(null);

    const itemsPerPage = 10; // Show 10 orders per page

    const navigate = useNavigate();

    // Load orders whenever search status or page changes
    useEffect(() => {
        fetchOrders();
    }, [searchStatus, currentPage]);

    // ------- Function: fetchOrders -------
    // Fetch orders from backend (filtered by status if applicable)
    const fetchOrders = async () => {
        try {
            let response;
            if (searchStatus) {
                response = await ApiService.getAllOrderItemsByStatus(searchStatus);
            } else {
                response = await ApiService.getAllOrders();
            }

            const orderList = response.orderItemList || [];

            setTotalPages(Math.ceil(orderList.length / itemsPerPage));
            setOrders(orderList);
            setFilteredOrders(orderList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch orders');
            setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
        }
    };

    // ------- Function: handleFilterChange -------
    // Filter orders locally by selected status
    const handleFilterChange = (e) => {
        const filterValue = e.target.value;
        setStatusFilter(filterValue);
        setCurrentPage(1);

        if (filterValue) {
            const filtered = orders.filter(order => order.status === filterValue);
            setFilteredOrders(filtered.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        } else {
            setFilteredOrders(orders.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(orders.length / itemsPerPage));
        }
    };

    // ------- Function: handleSearchStatusChange -------
    // API-based search by status
    const handleSearchStatusChange = (e) => {
        setSearchStatus(e.target.value);
        setCurrentPage(1);
    };

    // ------- Function: handleOrderDetails -------
    // Navigate to order details page
    const handleOrderDetails = (id) => {
        navigate(`/admin/order-details/${id}`);
    };

    // ------- Styles for admin red theme -------
    const containerStyle = {
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(135deg, #ffe5e5, #ff9999)"
    };

    const titleStyle = {
        color: "#b30000",
        textAlign: "center",
        marginBottom: "20px"
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px"
    };

    const thStyle = {
        background: "#ff4d4d",
        color: "white",
        padding: "10px",
        textAlign: "left"
    };

    const tdStyle = {
        padding: "10px",
        borderBottom: "1px solid #ddd"
    };

    const buttonStyle = {
        backgroundColor: "#ff4d4d",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold"
    };

    const filterContainerStyle = {
        display: "flex",
        gap: "20px",
        alignItems: "center",
        marginBottom: "20px"
    };

    const errorStyle = {
        color: "red",
        textAlign: "center"
    };

    // ------- JSX -------
    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Orders</h2>

            {error && <p style={errorStyle}>{error}</p>}

            {/* Filters */}
            <div style={filterContainerStyle}>
                <div>
                    <label>Filter By Status: </label>
                    <select value={statusFilter} onChange={handleFilterChange}>
                        <option value="">All</option>
                        {OrderStatus.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Search By Status: </label>
                    <select value={searchStatus} onChange={handleSearchStatusChange}>
                        <option value="">All</option>
                        {OrderStatus.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Order ID</th>
                        <th style={thStyle}>Customer</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Date Ordered</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td style={tdStyle}>{order.id}</td>
                            <td style={tdStyle}>{order.user.name}</td>
                            <td style={tdStyle}>{order.status}</td>
                            <td style={tdStyle}>${order.price.toFixed(2)}</td>
                            <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td style={tdStyle}>
                                <button style={buttonStyle} onClick={() => handleOrderDetails(order.id)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default AdminOrdersPage;

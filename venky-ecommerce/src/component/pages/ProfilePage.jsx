import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            setUserInfo(response.user);
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Unable to fetch user info");
        }
    };

    if (!userInfo) {
        return <div style={{ textAlign: "center", marginTop: "20px", color: "#333" }}>Loading...</div>;
    }

    const handleAddressClick = () => {
        navigate(userInfo.address ? "/edit-address" : "/add-address");
    };

    const orderItemList = userInfo.orderItemList || [];
    const totalPages = Math.ceil(orderItemList.length / itemsPerPage);
    const paginatedOrders = orderItemList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const containerStyle = {
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #f0f8ff, #d6f0ff)", // very light blue gradient
        color: "#333",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
    };

    const sectionStyle = {
        marginBottom: "30px"
    };

    const buttonStyle = {
        backgroundColor: "#cce7ff",
        color: "#0056b3",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "10px"
    };

    const orderListStyle = {
        listStyle: "none",
        padding: 0
    };

    const orderItemStyle = {
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.6)",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "10px"
    };

    const orderImageStyle = {
        width: "80px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "6px",
        marginRight: "20px"
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome, {userInfo.name}</h2>

            {error && <p style={{ color: "#ff4d4d", textAlign: "center" }}>{error}</p>}

            <div style={sectionStyle}>
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Phone Number:</strong> {userInfo.phoneNumber}</p>
            </div>

            <div style={sectionStyle}>
                <h3>Address</h3>
                {userInfo.address ? (
                    <div>
                        <p><strong>Street:</strong> {userInfo.address.street}</p>
                        <p><strong>City:</strong> {userInfo.address.city}</p>
                        <p><strong>State:</strong> {userInfo.address.state}</p>
                        <p><strong>Zip Code:</strong> {userInfo.address.zipCode}</p>
                        <p><strong>Country:</strong> {userInfo.address.country}</p>
                    </div>
                ) : (
                    <p>No Address information available</p>
                )}
                <button style={buttonStyle} onClick={handleAddressClick}>
                    {userInfo.address ? "Edit Address" : "Add Address"}
                </button>
            </div>

            <div style={sectionStyle}>
                <h3>Order History</h3>
                <ul style={orderListStyle}>
                    {paginatedOrders.map(order => (
                        <li key={order.id} style={orderItemStyle}>
                            <img src={order.product?.imageUrl} alt={order.product.name} style={orderImageStyle} />
                            <div>
                                <p><strong>Name:</strong> {order.product.name}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Quantity:</strong> {order.quantity}</p>
                                <p><strong>Price:</strong> ${order.price.toFixed(2)}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default ProfilePage;

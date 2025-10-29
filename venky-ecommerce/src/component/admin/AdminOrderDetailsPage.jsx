import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Added Bootstrap

import ApiService from "../../service/ApiService";

const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderDetailsPage = () => {
    const { itemId } = useParams();
    const [orderItems, setOrderItems] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => {
        fetchOrderDetails(itemId);
    }, [itemId]);

    const fetchOrderDetails = async (itemId) => {
        try {
            const response = await ApiService.getOrderItemById(itemId);
            setOrderItems(response.orderItemList);
        } catch (error) {
            console.log(error.message || error);
        }
    }

    const handleStatusChange = (orderItemId, newStatus) => {
        setSelectedStatus({ ...selectedStatus, [orderItemId]: newStatus });
    }

    const handleSubmitStatusChange = async (orderItemId) => {
        try {
            await ApiService.updateOrderitemStatus(orderItemId, selectedStatus[orderItemId]);
            setMessage('Order item status was successfully updated');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to update order item status');
        }
    }

    return (
        <div className="container mt-4 order-details-page">
            {message && <div className="alert alert-danger">{message}</div>} {/* Red alert */}

            <h2 className="text-danger mb-4">Order Details</h2> {/* Red heading */}

            {orderItems.length ? (
                orderItems.map((orderItem) => (
                    <div key={orderItem.id} className="card mb-4 border-danger shadow-sm">
                        <div className="card-body">

                            {/* Order Information */}
                            <h4 className="text-danger">Order Information</h4>
                            <p><strong>Order Item ID:</strong> {orderItem.id}</p>
                            <p><strong>Quantity:</strong> {orderItem.quantity}</p>
                            <p><strong>Total Price:</strong> {orderItem.price}</p>
                            <p><strong>Status:</strong> <span className="badge bg-danger">{orderItem.status}</span></p>
                            <p><strong>Date Ordered:</strong> {new Date(orderItem.createdAt).toLocaleDateString()}</p>

                            <hr />

                            {/* User Information */}
                            <h4 className="text-danger">User Information</h4>
                            <p><strong>Name:</strong> {orderItem.user.name}</p>
                            <p><strong>Email:</strong> {orderItem.user.email}</p>
                            <p><strong>Phone:</strong> {orderItem.user.phoneNumber}</p>
                            <p><strong>Role:</strong> {orderItem.user.role}</p>

                            {/* Delivery Address */}
                            <h5 className="text-danger mt-3">Delivery Address</h5>
                            <p><strong>Country:</strong> {orderItem.user.address?.country}</p>
                            <p><strong>State:</strong> {orderItem.user.address?.state}</p>
                            <p><strong>City:</strong> {orderItem.user.address?.city}</p>
                            <p><strong>Street:</strong> {orderItem.user.address?.street}</p>
                            <p><strong>Zip Code:</strong> {orderItem.user.address?.zipcode}</p>

                            <hr />

                            {/* Product Information */}
                            <h4 className="text-danger">Product Information</h4>
                            <div className="row">
                                <div className="col-md-4">
                                    <img src={orderItem.product.imageUrl} alt={orderItem.product.name} className="img-fluid rounded border border-danger" />
                                </div>
                                <div className="col-md-8">
                                    <p><strong>Name:</strong> {orderItem.product.name}</p>
                                    <p><strong>Description:</strong> {orderItem.product.description}</p>
                                    <p><strong>Price:</strong> {orderItem.product.price}</p>
                                </div>
                            </div>

                            <hr />

                            {/* Status Change */}
                            <div className="d-flex flex-wrap align-items-center mt-3">
                                <select
                                    className="form-select me-2 mb-2"
                                    value={selectedStatus[orderItem.id] || orderItem.status}
                                    onChange={(e) => handleStatusChange(orderItem.id, e.target.value)}
                                >
                                    {OrderStatus.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <button className="btn btn-danger mb-2" onClick={() => handleSubmitStatusChange(orderItem.id)}>Update Status</button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center">
                    <p className="text-muted">Loading order details ....</p>
                </div>
            )}
        </div>
    );
}

export default AdminOrderDetailsPage;

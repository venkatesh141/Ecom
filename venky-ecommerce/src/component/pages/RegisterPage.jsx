import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phoneNumber: '',
        password: ''
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.registerUser(formData);

            if (response.status === 200) {
                setMessage("User Successfully Registered");
                setTimeout(() => {
                    navigate("/login");
                }, 4000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Unable to register a user");
        }
    }

    const containerStyle = {
        backgroundColor: "#007bff",
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "40px auto",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)"
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "4px",
        border: "1px solid #ccc"
    };

    const buttonStyle = {
        backgroundColor: "#0056b3",
        color: "white",
        padding: "10px",
        width: "100%",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    };

    const messageStyle = {
        backgroundColor: "#004085",
        padding: "10px",
        borderRadius: "4px",
        textAlign: "center",
        marginBottom: "10px"
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: "center" }}>Register</h2>

            {message && <p style={messageStyle}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <button type="submit" style={buttonStyle}>Register</button>

                <p style={{ textAlign: "center", marginTop: "10px" }}>
                    Already have an account? <a style={{ color: "#ffc107" }} href="/login">Login</a>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;

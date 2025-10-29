import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.createCategory({ name });
      if (response.status === 200) {
        setMessage(response.message);
        setIsError(false);
        setTimeout(() => {
          setMessage('');
          navigate("/admin/categories");
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to save a category");
      setIsError(true);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ffe5e5, #ff9999)", // red gradient
    padding: "20px"
  };

  const cardStyle = {
    maxWidth: "400px",
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

  const alertStyle = {
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    textAlign: "center"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#b30000" }}>Add Category</h2>

        {message && (
          <div
            style={{
              ...alertStyle,
              backgroundColor: isError ? "#f8d7da" : "#d4edda",
              color: isError ? "#721c24" : "#155724"
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
          </div>
          <button type="submit" style={buttonStyle}>
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;

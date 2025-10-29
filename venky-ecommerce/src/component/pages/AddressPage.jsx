import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "bootstrap/dist/css/bootstrap.min.css";

const AddressPage = () => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/edit-address") {
      fetchUserInfo();
    }
  }, [location.pathname]);

  const fetchUserInfo = async () => {
    try {
      const response = await ApiService.getLoggedInUserInfo();
      if (response.user.address) {
        setAddress(response.user.address);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to fetch user information"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.saveAddress(address);
      navigate("/profile");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save/update address"
      );
    }
  };

  // Example Pagination UI (horizontal and blue)
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link text-primary fw-bold"
                style={{ borderColor: "#0d6efd" }}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: "#e7f0ff", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow border-primary rounded-4">
            <div className="card-body p-4">
              <h3 className="text-center text-primary fw-bold mb-4">
                {location.pathname === "/edit-address"
                  ? "Edit Address"
                  : "Add Address"}
              </h3>

              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                {["street", "city", "state", "zipCode", "country"].map(
                  (field, index) => (
                    <div className="mb-3" key={index}>
                      <label className="form-label fw-semibold text-primary text-capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={address[field]}
                        onChange={handleChange}
                        className="form-control border-primary"
                        placeholder={`Enter ${field}`}
                        required
                      />
                    </div>
                  )
                )}

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg fw-semibold"
                  >
                    {location.pathname === "/edit-address"
                      ? "Update Address"
                      : "Save Address"}
                  </button>
                </div>
              </form>

              {/* Pagination Example */}
              <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={(page) => console.log("Go to page:", page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;

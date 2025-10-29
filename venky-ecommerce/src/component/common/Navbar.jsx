import React, { useState } from "react";
import myImage from "./vmart.png";
import { NavLink, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import ApiService from "../../service/ApiService";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const isAdmin = ApiService.isAdmin();
  const isAuthenticated = ApiService.isAuthenticated();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?search=${searchValue}`);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      ApiService.logout();
      setTimeout(() => navigate("/login"), 500);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-lg"
      style={{
        backdropFilter: "blur(8px)",
        background: "rgba(13, 110, 253, 0.95)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container-fluid px-4 py-2">
        {/* Logo / Brand */}
        <NavLink
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
          style={{ fontSize: "1.5rem", letterSpacing: "0.5px" }}
        >
          <img
            src={myImage}
            alt="V Mart Logo"
            width="40"
            height="40"
            className="rounded-circle shadow-sm"
          />
          <span className="fw-bold text-light">V Mart</span>
        </NavLink>

        {/* Toggle button for mobile view */}
        <button
          className="navbar-toggler border-0 shadow-sm"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links and search */}
        <div className="collapse navbar-collapse mt-2 mt-lg-0" id="navbarNav">
          {/* Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/categories">
                Categories
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/profile">
                  My Account
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
            {!isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/login">
                  Login
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  className="nav-link px-3"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/cart">
                Cart
              </NavLink>
            </li>
          </ul>

          {/* Search Bar */}
          <form
            className="d-flex align-items-center"
            onSubmit={handleSearchSubmit}
            style={{ gap: "0.5rem" }}
          >
            <input
              className="form-control border-0 shadow-sm rounded-pill px-3"
              type="search"
              placeholder="Search products..."
              value={searchValue}
              onChange={handleSearchChange}
              style={{
                minWidth: "200px",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 10px rgba(255,255,255,0.5)")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
            <button
              className="btn btn-light fw-bold text-primary rounded-pill px-4 shadow-sm"
              type="submit"
              style={{
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-primary text-white text-center text-lg-start mt-5">
      <div className="container p-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <ul className="nav justify-content-center mb-3">
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/">About Us</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/">Contact Us</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/">Terms & Conditions</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/">Privacy Policy</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/">FAQs</NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-0">&copy; 2025 <strong>V's Mart</strong>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

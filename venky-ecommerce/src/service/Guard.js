// Import React for creating components
import React from "react";

// Import Navigate (used for redirecting) and useLocation (used to know current page URL)
// from react-router-dom
import { Navigate, useLocation } from "react-router-dom";

// Import your ApiService class which contains isAuthenticated() and isAdmin() methods
import ApiService from "./ApiService";


// ---------------- ProtectedRoute ----------------
export const ProtectedRoute = ({ element: Component }) => {
    // Get the current location (page the user is trying to visit)
    const location = useLocation();

    // If user is authenticated, allow them to see the Component (protected page)
    // Otherwise, redirect them to /login page
    return ApiService.isAuthenticated() ? (
        Component
    ) : (
        // Redirect to login and remember the page they came from
        // (so after login they can be sent back to this page)
        <Navigate to="/login" replace state={{ from: location }} />
    );
};


// ---------------- AdminRoute ----------------
export const AdminRoute = ({ element: Component }) => {
    // Get the current location (page the user is trying to visit)
    const location = useLocation();

    // If user role is ADMIN, show the Component (admin-only page)
    // Otherwise, redirect to /login page
    return ApiService.isAdmin() ? (
        Component
    ) : (
        // Redirect to login and store the attempted page in state
        <Navigate to="/login" replace state={{ from: location }} />
    );
};

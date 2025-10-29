import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAllCategory();
      setCategories(response.categoryList || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch categories"
      );
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#e8f0ff", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-lg border-primary rounded-4">
            <div className="card-body text-center">
              <h2 className="text-primary fw-bold mb-4">
                🗂️ Browse Categories
              </h2>

              {error ? (
                <div className="alert alert-danger">{error}</div>
              ) : categories.length === 0 ? (
                <p className="text-secondary fs-5">No categories found 😞</p>
              ) : (
                <div className="row">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="col-12 col-sm-6 col-md-4 mb-4"
                    >
                      <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div
                          className="card-body d-flex flex-column justify-content-center align-items-center"
                          style={{
                            backgroundColor: "#f8fbff",
                            transition: "0.3s",
                          }}
                        >
                          <h5 className="text-primary fw-semibold mb-3">
                            {category.name}
                          </h5>
                          <button
                            className="btn btn-primary btn-sm rounded-3 px-3"
                            onClick={() => handleCategoryClick(category.id)}
                          >
                            View Products →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryListPage;

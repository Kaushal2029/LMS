import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddUserPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.number.trim()) {
      newErrors.number = "Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.number)) {
      newErrors.number = "Number should be 10 digits";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password should be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const token = localStorage.getItem("authToken"); // Get admin token from localStorage
        const response = await axios.post(
          "http://localhost:8000/api/admin/users",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("User registered successfully:", response.data);
        toast.success(response.data.message || "User created successfully");
        navigate("/users");
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while registering the user"
        );
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="cols-12 w-full">
          <div className="mb-5">
            <label htmlFor="nameInput">Name</label>
            <input
              type="text"
              id="nameInput"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control h-10 w-full ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-5">
            <label htmlFor="emailInput">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control h-10 w-full ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-5">
            <label htmlFor="mobileInput">Number</label>
            <input
              type="text"
              id="mobileInput"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className={`form-control h-10 w-full ${
                errors.number ? "border-red-500" : ""
              }`}
            />
            {errors.number && (
              <p className="text-red-500 text-sm mt-1">{errors.number}</p>
            )}
          </div>
          <div className="mb-5">
            <label htmlFor="passwordInput">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control h-10 w-full ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddUserPage;

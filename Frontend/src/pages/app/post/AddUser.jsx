import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../store/api/api";

function AddUserPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
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

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
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
        const response = await postData("register", formData);
        console.log("User registered successfully:", response);
        toast.success(response.message);
        navigate("/users");
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error(error.message || "An error occurred while registering the user");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="cols-12 w-full">
          <div className="mb-5">
            <label htmlFor="nameInput">Username</label>
            <input
              type="text"
              id="nameInput"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className={`form-control h-10 w-full ${
                errors.userName ? "border-red-500" : ""
              }`}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
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
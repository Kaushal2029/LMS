import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [id === "nameInput" ? "name" : id === "emailInput" ? "email" : "number"]:
        value,
    }));
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/users/${id}`
      );
      console.log("edit", response.data);

      setUserData(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
    };
    fetchData();
  }, [id]);

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!userData.name.trim()) newErrors.name = "Name is required";
  //   if (!userData.email.trim()) newErrors.email = "Email is required";
  //   else if (!/\S+@\S+\.\S+/.test(userData.email))
  //     newErrors.email = "Email is invalid";
  //   if (!userData.number.trim()) newErrors.number = "Mobile number is required";
  //   else if (!/^\d{10}$/.test(userData.number))
  //     newErrors.number = "Mobile number should be 10 digits";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/users/${id}`,
        {
          name: userData.name,
          number: userData.number,
        }
      );
      console.log("editttt", response);

      if (response.data) {
        toast.success("User updated successfully");
        navigate("/users");
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div>
      {userData && (
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <div className="mb-12 mt-10 w-1/4">
              <img
                className="w-full h-full object-contain"
                src={userData?.profileUrl}
                alt=""
              />
            </div>
            <div className="cols-12 ml-12 w-full">
              <div className="mb-5">
                <label htmlFor="nameInput">Name</label>
                <input
                  type="text"
                  id="nameInput"
                  className={`form-control h-10 w-full ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  value={userData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-5">
                <label htmlFor="mobileInput">Mobile</label>
                <input
                  type="text"
                  id="mobileInput"
                  className={`form-control h-10 w-full ${
                    errors.number ? "border-red-500" : ""
                  }`}
                  value={userData.number}
                  onChange={handleInputChange}
                />
                {errors.number && (
                  <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </form>
      )}
    </div>
  );
}

export default UserEditPage;

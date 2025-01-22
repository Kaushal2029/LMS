import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, updateData, deleteData } from "../../../store/api/api";

function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isActive, setIsActive] = useState(userData?.status);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [id === "nameInput"
        ? "userName"
        : id === "emailInput"
        ? "email"
        : "number"]: value,
    }));
  };

  const getUserById = (id) => getData(`users/${id}`);
  const getPostsByUser = (id) => getData(`posts-by-user/${id}`);
  const deletePost = (postId) => deleteData(`delete-post/${postId}`);
  const updateUser = (id, userData) => updateData(`user/${id}`, userData);
  const activateUser = (id) => updateData(`activate-user/${id}`);
  const deactivateUser = (id) => updateData(`deactivate-user/${id}`);

  const fetchUserData = async () => {
    try {
      const response = await getUserById(id);
      setUserData(response.user);
      setIsActive(response.user.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchPosts();
    };
    fetchData();
  }, [id]);

  const fetchPosts = async () => {
    try {
      const response = await getPostsByUser(id);
      setPosts(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.userName.trim()) newErrors.userName = "Name is required";
    if (!userData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userData.email))
      newErrors.email = "Email is invalid";
    if (!userData.number.trim()) newErrors.number = "Mobile number is required";
    else if (!/^\d{10}$/.test(userData.number))
      newErrors.number = "Mobile number should be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }
    try {
      const response = await updateUser(id, {
        userName: userData.userName,
        email: userData.email,
        number: userData.number,
      });
      if (response.success) {
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

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value === "Active";
    try {
      const response = newStatus
        ? await activateUser(id)
        : await deactivateUser(id);

      if (response.success) {
        setIsActive(newStatus);
        setUserData({ ...userData, status: newStatus });
        toast.success(
          `User ${newStatus ? "activated" : "deactivated"} successfully`
        );
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status");
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
                    errors.userName ? "border-red-500" : ""
                  }`}
                  value={userData.userName}
                  onChange={handleInputChange}
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                )}
              </div>
              <div className="mb-5">
                <label htmlFor="emailInput">Email</label>
                <input
                  type="text"
                  id="emailInput"
                  value={userData.email}
                  onChange={handleInputChange}
                  className={`form-control h-10 w-full ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
          <div className="mb-5">
            <label htmlFor="userStatus">User Status</label>
            <select
              id="userStatus"
              className="form-control h-10 w-full"
              style={{ color: "black" }}
              value={isActive ? "Active" : "Inactive"}
              onChange={handleStatusChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </form>
      )}
      <p className="text-2xl font-bold mt-10">User Posts</p>
      <div className="grid grid-cols-4 m-1 mt-10 border-2 border-gray-300 rounded-md p-5 w-full">
        {posts &&
          posts.map((post, index) => (
            <div
              key={index}
              className="relative group m-1 mt-10 border-2 border-gray-300 rounded-md p-3  aspect-[3/2]"
            >
              <img
                className="w-full h-full object-contain"
                src={post.imageUrl}
                alt=""
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deletePost(post._id)}
                title="Delete post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default UserEditPage;
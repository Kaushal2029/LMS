import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function UserViewPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserData(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/users/${id}/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Failed to fetch user posts");
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      {userData && (
        <form>
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
                  className="form-control h-10 w-full"
                  defaultValue={userData?.userName}
                  disabled
                />
              </div>
              <div className="mb-5">
                <label htmlFor="emailInput">Email</label>
                <input
                  type="text"
                  id="emailInput"
                  defaultValue={userData?.email}
                  className="form-control h-10 w-full"
                  disabled
                />
              </div>
              <div className="mb-5">
                <label htmlFor="mobileInput">Mobile</label>
                <input
                  type="text"
                  id="mobileInput"
                  className="form-control h-10 w-full"
                  defaultValue={userData?.number}
                  disabled
                />
              </div>
              <div className="mb-5">
                <label htmlFor="CityInput">City</label>
                <input
                  type="text"
                  id="mobileInput"
                  className="form-control h-10 w-full"
                  defaultValue="Ahmedabad"
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="userStatus">User Status</label>
            <select
              id="userStatus"
              className="form-control h-10 w-full "
              style={{ color: "black" }}
              disabled
              value={userData.status ? "Active" : "Inactive"}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserViewPage;

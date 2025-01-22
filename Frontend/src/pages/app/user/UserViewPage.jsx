import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getData } from "../../../store/api/api";
import { toast } from "react-toastify";

function UserViewPage() {
  const columns = useMemo(() => COLUMNS, []);
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await getData(`users/${id}`);
      setUserData(response.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await getData(`posts-by-user/${id}`);
      setPosts(response);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Failed to fetch user posts");
    }
  };
  const tableInstance = useTable(
    {
      columns,
      data: data || [],
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // {
        //   id: "selection",
        //   Header: ({ getToggleAllRowsSelectedProps }) => (
        //     <div>
        //       <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        //     </div>
        //   ),
        //   Cell: ({ row }) => (
        //     <div>
        //       <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        //     </div>
        //   ),
        // },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
      <p className="text-2xl font-bold mt-10">User Posts</p>
      <div className="grid grid-cols-4 m-1 mt-10 border-2 border-gray-300 rounded-md p-5 w-1/2">
        {posts &&
          posts.map((post, index) => (
            <div
              key={index}
              className="relative group m-1 mt-10 border-2 border-gray-300 rounded-md p-3  aspect-[3/2] "
            >
              <img
                className="w-full h-full object-contain"
                src={post.imageUrl}
                alt=""
              />
            </div>
          ))}
      </div>
      <p className="text-2xl font-bold mt-5">User Hisory</p>
    </div>
  );
}

export default UserViewPage;

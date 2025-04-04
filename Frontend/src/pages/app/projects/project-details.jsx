import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import GroupChart4 from "@/components/partials/widget/chart/group-chart-4";
import DonutChart from "@/components/partials/widget/chart/donut-chart";
import { meets, files } from "@/constant/data";
import SelectMonth from "@/components/partials/SelectMonth";
import TaskLists from "@/components/partials/widget/task-list";
import MessageList from "@/components/partials/widget/message-list";
import TrackingParcel from "@/components/partials/widget/activity";
import TeamTable from "@/components/partials/Table/team-table";
import CalendarView from "@/components/partials/widget/CalendarView";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import Tooltip from "@/components/ui/Tooltip";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to handle status update
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      console.log("Updating status:", { requestId, newStatus });

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:8000/api/admin/book-status",
        {
          requestId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Status update response:", response.data);

      if (response.data) {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId
              ? {
                  ...request,
                  status: newStatus,
                  ...(newStatus === "returned"
                    ? { actualReturnDate: new Date().toISOString() }
                    : {}),
                }
              : request
          )
        );
        toast.success(`Book ${newStatus} successfully`);
      }
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
      toast.error("Failed to update book status");
    }
  };

  // Function to delete a request
  const handleDeleteRequest = async (requestId) => {
    try {
      console.log("Deleting request:", requestId);

      const authToken = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:8000/api/admin/requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete response:", response.data);

      if (response.data) {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        toast.success("Request deleted successfully");
      }
    } catch (error) {
      console.error(
        "Error deleting request:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete request");
    }
  };

  // Function to rebook a rejected book
  const handleRebook = async (request) => {
    try {
      console.log("Rebooking book:", request);

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:8000/api/admin/requests",
        {
          bookId: request.bookId._id,
          userId: request.userId._id,
          returnDate: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(), // 14 days from now
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Rebook response:", response.data);

      if (response.data) {
        // Add the new request to the list
        setRequests((prevRequests) => [...prevRequests, response.data.request]);
        toast.success("Book rebooked successfully");
      }
    } catch (error) {
      console.error(
        "Error rebooking book:",
        error.response?.data || error.message
      );
      toast.error("Failed to rebook book");
    }
  };

  // Function to fetch requests
  const fetchRequests = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      console.log("Fetching requests with token:", authToken);

      // Use the correct endpoint for user book requests
      const response = await axios.get(
        "http://localhost:8000/api/admin/carry-books",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("=== User Book Requests API Response ===");
      console.log("Full Response:", response);
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data Type:", typeof response.data);
      console.log("Response Data:", response.data);

      // Extract the requests data
      let requestsData = [];

      if (response.data) {
        // Check if the response has a carries property
        if (response.data.carries && Array.isArray(response.data.carries)) {
          requestsData = response.data.carries;
          console.log("Using response.data.carries array");
        }
        // If the response is an array, use it directly
        else if (Array.isArray(response.data)) {
          requestsData = response.data;
          console.log("Using response.data as array");
        }
        // If it's an object with a data property that's an array
        else if (response.data.data && Array.isArray(response.data.data)) {
          requestsData = response.data.data;
          console.log("Using response.data.data array");
        }
        // If it's an object, try to convert it to an array
        else if (typeof response.data === "object") {
          // Try to find any array property
          const arrayProps = Object.entries(response.data)
            .filter(([key, value]) => Array.isArray(value))
            .map(([key, value]) => ({ key, value }));

          if (arrayProps.length > 0) {
            console.log(
              "Found array properties:",
              arrayProps.map((p) => p.key)
            );
            // Use the first array property found
            requestsData = arrayProps[0].value;
            console.log(`Using response.data.${arrayProps[0].key} array`);
          } else {
            // If no array property found, convert the object to an array
            requestsData = [response.data];
            console.log("Converting response.data object to array");
          }
        }
      }

      console.log("=== Processed Requests Data ===");
      console.log("Total Requests:", requestsData.length);
      console.log("Requests Data:", requestsData);

      // Log the first request to see its structure
      if (requestsData.length > 0) {
        console.log("=== First Request Structure ===");
        console.log("Request ID:", requestsData[0]._id);
        console.log("Book Details:", requestsData[0].bookId);
        console.log("User Details:", requestsData[0].userId);
        console.log("Status:", requestsData[0].status);
        console.log("Dates:", {
          createdAt: requestsData[0].createdAt,
          issueDate: requestsData[0].issueDate,
          returnDate: requestsData[0].returnDate,
        });
      } else {
        console.log("No requests found in the response");
      }

      setRequests(requestsData);
    } catch (error) {
      console.error("=== Error Fetching Requests ===");
      console.error("Error:", error);
      console.error("Error Response:", error.response);
      console.error("Error Message:", error.message);
      console.error("Error Data:", error.response?.data);
      setRequests([]);
      toast.error("Failed to fetch book requests");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");

        // Fetch books
        const booksResponse = await axios.get(
          "http://localhost:8000/api/admin/books",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Books response:", booksResponse.data);

        if (booksResponse.data && booksResponse.data.books) {
          setBooks(booksResponse.data.books);
        } else if (Array.isArray(booksResponse.data)) {
          setBooks(booksResponse.data);
        }

        // Fetch requests
        await fetchRequests();

        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a refresh function to manually refresh the data
  const refreshData = async () => {
    try {
      setLoading(true);
      await fetchRequests();
      setLoading(false);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      setLoading(false);
      toast.error("Failed to refresh data");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => {
          return <span>{row?.index + 1}</span>;
        },
      },
      {
        Header: "Book Name",
        accessor: "name",
      },
      {
        Header: "Author",
        accessor: "authorName",
      },
      {
        Header: "Genre",
        accessor: "genre",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Stock",
        accessor: "stock",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const handleView = () => {
            // Implement view functionality
            console.log("View book:", row.original);
          };

          const handleEdit = () => {
            // Implement edit functionality
            console.log("Edit book:", row.original);
          };

          const handleDelete = async () => {
            try {
              const authToken = localStorage.getItem("authToken");
              await axios.delete(
                `http://localhost:8000/api/admin/books/${row.original._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );
              setBooks((prevBooks) =>
                prevBooks.filter((book) => book._id !== row.original._id)
              );
            } catch (error) {
              console.error("Error deleting book:", error);
            }
          };

          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Tooltip
                content="View"
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={handleView}
                >
                  <Icon icon="heroicons:eye" />
                </button>
              </Tooltip>
              <Tooltip
                content="Edit"
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={handleEdit}
                >
                  <Icon icon="heroicons:pencil-square" />
                </button>
              </Tooltip>
              <Tooltip
                content="Delete"
                placement="top"
                arrow
                animation="shift-away"
                theme="danger"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={handleDelete}
                >
                  <Icon icon="heroicons:trash" />
                </button>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: books,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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

  const requestColumns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => {
          return <span>{row?.index + 1}</span>;
        },
      },
      {
        Header: "Request By",
        accessor: "userId.name",
        Cell: ({ value }) => {
          return <span className="font-mono text-xs">{value}</span>;
        },
      },
      {
        Header: "Book Name",
        accessor: "bookId.name",
      },
      {
        Header: "Request Date",
        accessor: "requestDate",
        Cell: ({ value }) => {
          return value ? new Date(value).toLocaleDateString() : "N/A";
        },
      },
      {
        Header: "Expected Return Date",
        accessor: "returnDate",
        Cell: ({ value }) => {
          return value ? new Date(value).toLocaleDateString() : "N/A";
        },
      },
      {
        Header: "Actual Return Date",
        accessor: "actualReturnDate",
        Cell: ({ row }) => {
          const request = row.original;
          if (request.status === "returned" && request.actualReturnDate) {
            return new Date(request.actualReturnDate).toLocaleDateString();
          } else if (request.status === "returned") {
            return new Date().toLocaleDateString(); // Current date if no actual return date
          }
          return "N/A";
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          const statusColors = {
            pending: "bg-warning-500",
            issued: "bg-success-500",
            returned: "bg-info-500",
            rejected: "bg-danger-500",
          };

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs text-white ${
                statusColors[value] || "bg-slate-500"
              }`}
            >
              {value}
            </span>
          );
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const request = row.original;
          const isPending = request.status === "pending";
          const isIssued = request.status === "issued";
          const isRejected = request.status === "rejected";

          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              {isPending && (
                <>
                  <Tooltip
                    content="Issue Book"
                    placement="top"
                    arrow
                    animation="shift-away"
                  >
                    <button
                      className="action-btn"
                      type="button"
                      onClick={() => {
                        console.log("Issuing book:", request._id);
                        handleStatusUpdate(request._id, "issued");
                      }}
                    >
                      <Icon icon="heroicons:check-circle" />
                    </button>
                  </Tooltip>
                  <Tooltip
                    content="Reject Request"
                    placement="top"
                    arrow
                    animation="shift-away"
                    theme="danger"
                  >
                    <button
                      className="action-btn"
                      type="button"
                      onClick={() => {
                        console.log("Rejecting request:", request._id);
                        handleStatusUpdate(request._id, "rejected");
                      }}
                    >
                      <Icon icon="heroicons:x-circle" />
                    </button>
                  </Tooltip>
                </>
              )}
              {isIssued && (
                <Tooltip
                  content="Mark as Returned"
                  placement="top"
                  arrow
                  animation="shift-away"
                >
                  <button
                    className="action-btn"
                    type="button"
                    onClick={() => {
                      console.log("Marking as returned:", request._id);
                      handleStatusUpdate(request._id, "returned");
                    }}
                  >
                    <Icon icon="heroicons:arrow-path" />
                  </button>
                </Tooltip>
              )}
              {isRejected && (
                <>
                  <Tooltip
                    content="Rebook"
                    placement="top"
                    arrow
                    animation="shift-away"
                  >
                    <button
                      className="action-btn"
                      type="button"
                      onClick={() => {
                        console.log("Rebooking:", request);
                        handleRebook(request);
                      }}
                    >
                      <Icon icon="heroicons:arrow-path-rounded-square" />
                    </button>
                  </Tooltip>
                  <Tooltip
                    content="Delete Request"
                    placement="top"
                    arrow
                    animation="shift-away"
                    theme="danger"
                  >
                    <button
                      className="action-btn"
                      type="button"
                      onClick={() => {
                        console.log("Deleting request:", request._id);
                        handleDeleteRequest(request._id);
                      }}
                    >
                      <Icon icon="heroicons:trash" />
                    </button>
                  </Tooltip>
                </>
              )}
              {!isPending && !isIssued && !isRejected && (
                <Tooltip
                  content="Delete Request"
                  placement="top"
                  arrow
                  animation="shift-away"
                  theme="danger"
                >
                  <button
                    className="action-btn"
                    type="button"
                    onClick={() => {
                      console.log("Deleting request:", request._id);
                      handleDeleteRequest(request._id);
                    }}
                  >
                    <Icon icon="heroicons:trash" />
                  </button>
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const requestTableInstance = useTable(
    {
      columns: requestColumns,
      data: requests,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps: getRequestTableProps,
    getTableBodyProps: getRequestTableBodyProps,
    headerGroups: requestHeaderGroups,
    page: requestPage,
    nextPage: nextRequestPage,
    previousPage: previousRequestPage,
    canNextPage: canNextRequestPage,
    canPreviousPage: canPreviousRequestPage,
    pageOptions: requestPageOptions,
    state: requestState,
    gotoPage: gotoRequestPage,
    pageCount: requestPageCount,
    setPageSize: setRequestPageSize,
    setGlobalFilter: setRequestGlobalFilter,
    prepareRow: prepareRequestRow,
  } = requestTableInstance;

  const {
    globalFilter: requestGlobalFilter,
    pageIndex: requestPageIndex,
    pageSize: requestPageSize,
  } = requestState;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ToastContainer />

      {/* Books Table */}
      <Card title="Books Management">
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">Books List</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps()}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="table-th"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps()}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Prev
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  className={`${
                    pageIdx === pageIndex
                      ? "bg-slate-900 dark:bg-slate-600 dark:text-slate-200 text-white font-medium"
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900 font-normal"
                  } text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      </Card>

      {/* Book Requests Table */}
      <Card title="Book Requests Management">
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">Book Requests List</h4>
          <div className="flex items-center space-x-3">
            <button
              className="btn btn-sm btn-primary"
              onClick={refreshData}
              disabled={loading}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4 mr-1" />
              Refresh
            </button>
            <GlobalFilter
              filter={requestGlobalFilter}
              setFilter={setRequestGlobalFilter}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getRequestTableProps()}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {requestHeaderGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="table-th"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getRequestTableBodyProps()}
                >
                  {requestPage.map((row) => {
                    prepareRequestRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={requestPageSize}
              onChange={(e) => setRequestPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {requestPageIndex + 1} of {requestPageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousRequestPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => gotoRequestPage(0)}
                disabled={!canPreviousRequestPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousRequestPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousRequestPage()}
                disabled={!canPreviousRequestPage}
              >
                Prev
              </button>
            </li>
            {requestPageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  className={`${
                    pageIdx === requestPageIndex
                      ? "bg-slate-900 dark:bg-slate-600 dark:text-slate-200 text-white font-medium"
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900 font-normal"
                  } text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoRequestPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canNextRequestPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextRequestPage()}
                disabled={!canNextRequestPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoRequestPage(requestPageCount - 1)}
                disabled={!canNextRequestPage}
                className={`${
                  !canNextRequestPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetailsPage;

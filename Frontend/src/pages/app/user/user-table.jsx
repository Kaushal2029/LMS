import React, { useState, useMemo, useEffect } from "react";
import { advancedTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const COLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: ({ row }) => {
      return <span>{row?.index + 1}</span>;
    },
  },
  {
    Header: "Name",
    accessor: "userName",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  //   {
  {
    Header: "Mobile",
    accessor: "number",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Email",
    accessor: "email",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Active",
    accessor: "isActive",
    Cell: ({ row }) => {
      const [isActive, setIsActive] = useState(row.original.isActive);

      const handleStatusChange = async (newStatus) => {
        try {
          const url = `https://instagram-backend-at4p.onrender.com/admin/api/${
            newStatus ? "activate" : "deactivate"
          }-user/${row.original._id}`;

          const response = await axios.put(
            url,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            setIsActive(newStatus);
            toast.success("User status updated successfully");
          } else {
            toast.error("Failed to update user status");
          }
        } catch (error) {
          toast.error("Failed to update user status");
        }
      };

      return (
        <select
          value={isActive ? "active" : "inactive"}
          onChange={(e) => handleStatusChange(e.target.value === "active")}
          className="form-select text-sm"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      );
    },
  },

  {
    Header: "Profile",
    accessor: "profileUrl",
    Cell: ({ row }) => {
      const profileData = row.original.profileUrl || {};
      const name = profileData.name || "N/A";

      return (
        <div>
          <span className="inline-flex items-center">
            <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
              {profileData ? (
                <img
                  src={profileData}
                  alt={name}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-white text-xs">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </span>
          </span>
        </div>
      );
    },
  },
  //   {
  //     Header: "date",
  //     accessor: "date",
  //     Cell: (row) => {
  //       return <span>{row?.cell?.value}</span>;
  //     },
  //   },
  //   {
  //     Header: "quantity",
  //     accessor: "quantity",
  //     Cell: (row) => {
  //       return <span>{row?.cell?.value}</span>;
  //     },
  //   },
  //   {
  //     Header: "amount",
  //     accessor: "amount",
  //     Cell: (row) => {
  //       return <span>{row?.cell?.value}</span>;
  //     },
  //   },
  //   {
  //     Header: "status",
  //     accessor: "status",
  //     Cell: (row) => {
  //       return (
  //         <span className="block w-full">
  //           <span
  //             className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
  //               row?.cell?.value === "paid"
  //                 ? "text-success-500 bg-success-500"
  //                 : ""
  //             }
  //             ${
  //               row?.cell?.value === "due"
  //                 ? "text-warning-500 bg-warning-500"
  //                 : ""
  //             }
  //             ${
  //               row?.cell?.value === "cancled"
  //                 ? "text-danger-500 bg-danger-500"
  //                 : ""
  //             }

  //              `}
  //           >
  //             {row?.cell?.value}
  //           </span>
  //         </span>
  //       );
  //     },
  //   },

  {
    Header: "action",
    accessor: "action",
    Cell: ({ row }) => {
      const navigate = useNavigate();
      const handleView = (userid) => {
        navigate(`/user/view/${userid}`);
      };
      const handleEdit = (userid) => {
        navigate(`/user/edit/${userid}`);
      };
      const handleDelete = async (userid) => {
        try {
          await axios.delete(
            `https://instagram-backend-at4p.onrender.com/admin/api/user/${userid}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          // Remove the deleted user from the local state
          setData((prevData) => prevData.filter((user) => user._id !== userid));
          toast.success("User deleted successfully");
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete user");
        }
      };
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="View" placement="top" arrow animation="shift-away">
            <button
              className="action-btn"
              type="button"
              onClick={() => {
                handleView(row.original._id);
              }}
            >
              <Icon icon="heroicons:eye" />
            </button>
          </Tooltip>
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button
              className="action-btn"
              type="button"
              onClick={() => {
                handleEdit(row.original._id);
              }}
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
              onClick={() => {
                handleDelete(row.original._id);
              }}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

const UserTable = ({ title = "Users" }) => {
  const columns = useMemo(() => COLUMNS, []);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://instagram-backend-at4p.onrender.com/admin/api/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(Array.isArray(response.data.users) ? response.data.users : []);

        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
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
                          className=" table-th "
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
                  {...getTableBodyProps}
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
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
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
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
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
                className={` ${
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
                  href="#"
                  aria-current="page"
                  className={` ${
                    pageIdx === pageIndex
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
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
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
        {/*end*/}
      </Card>
    </>
  );
};

export default UserTable;

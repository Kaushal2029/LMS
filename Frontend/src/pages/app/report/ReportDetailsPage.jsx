// import React, { useState, useMemo, useEffect } from "react";
// import { advancedTable } from "../../../constant/table-data";
// import Card from "@/components/ui/Card";
// import Icon from "@/components/ui/Icon";

// import Tooltip from "@/components/ui/Tooltip";
// import {
//   useTable,
//   useRowSelect,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
// import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getData, updateData, deleteData } from "../../../store/api/api";

// const IndeterminateCheckbox = React.forwardRef(
//   ({ indeterminate, ...rest }, ref) => {
//     const defaultRef = React.useRef();
//     const resolvedRef = ref || defaultRef;

//     React.useEffect(() => {
//       resolvedRef.current.indeterminate = indeterminate;
//     }, [resolvedRef, indeterminate]);

//     return (
//       <>
//         <input
//           type="checkbox"
//           ref={resolvedRef}
//           {...rest}
//           className="table-checkbox"
//         />
//       </>
//     );
//   }
// );

// const ReportDetailsPage = ({ title = "Report Details" }) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchReports = () => getData("reports");
//   const activateUser = (userId) => updateData(`activate-user/${userId}`);
//   const deactivateUser = (userId) => updateData(`deactivate-user/${userId}`);
//   const deleteReport = (reportId) => deleteData(`report/${reportId}`);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetchReports();
//         setData(Array.isArray(response.reports) ? response.reports : []);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError(
//           "An error occurred while fetching data. Please try again later."
//         );
//         setData([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const COLUMNS = [
//     {
//       Header: "Id",
//       accessor: "id",
//       Cell: ({ row }) => {
//         return <span>{row?.index + 1}</span>;
//       },
//     },
//     {
//       Header: "Reported By",
//       accessor: "ReportBy",
//       Cell: ({ value }) => {
//         return (
//           <div className="flex flex-col">
//             <span className="font-medium">{value?.userName}</span>
//             <span className="text-sm text-gray-500">{value?.email}</span>
//           </div>
//         );
//       },
//     },
//     {
//       Header: "Reported To",
//       accessor: "ReportTo",
//       Cell: ({ value }) => {
//         return (
//           <div className="flex flex-col">
//             <span className="font-medium">{value?.userName}</span>
//             <span className="text-sm text-gray-500">{value?.email}</span>
//           </div>
//         );
//       },
//     },
//     {
//       Header: "Status",
//       accessor: "isActive",
//       Cell: ({ row }) => {
//         const [isActive, setIsActive] = useState(row.original.isActive);
//         const reportedToUsername = row.original.ReportTo?.userName;

//         const handleStatusChange = async (newStatus) => {
//           try {
//             const response = newStatus
//               ? await activateUser(row.original.ReportTo._id)
//               : await deactivateUser(row.original.ReportTo._id);

//             if (response.success) {
//               setIsActive(newStatus);
//               toast.success("User status updated successfully");
//             } else {
//               toast.error("Failed to update user status");
//             }
//           } catch (error) {
//             toast.error("Failed to update user status");
//           }
//         };

//         return (
//           <div className="flex items-center">
//             <span className="mr-2">{reportedToUsername}:</span>
//             <select
//               value={isActive ? "active" : "inactive"}
//               onChange={(e) => handleStatusChange(e.target.value === "active")}
//               className="form-select text-sm"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         );
//       },
//     },

//     {
//       Header: "Post",
//       accessor: "postId.imageUrl",
//       Cell: ({ row, rows }) => {
//         const imageUrl = row.original.postId?.imageUrl;
//         const isFirstRow = row.index === 0;
//         const isLastRow = row.index === rows.length - 1;

//         return (
//           <div className="relative group">
//             <span className="inline-block w-12 h-12 rounded-full bg-slate-600 overflow-hidden">
//               {imageUrl ? (
//                 <img
//                   src={imageUrl}
//                   alt="Post"
//                   className="object-cover w-full h-full"
//                 />
//               ) : (
//                 <span className="w-full h-full flex items-center justify-center text-white text-xs">
//                   N/A
//                 </span>
//               )}
//             </span>
//             {imageUrl && (
//               <div
//                 className={`absolute z-50 left-1/2 transform -translate-x-1/2 ${
//                   isFirstRow
//                     ? "top-full mt-2"
//                     : isLastRow
//                     ? "bottom-full mb-2"
//                     : "-translate-y-1/2 top-1/2"
//                 } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
//               >
//                 <img
//                   src={imageUrl}
//                   alt="Full Post"
//                   className="max-w-none w-64 h-64 object-cover rounded-lg shadow-lg"
//                 />
//               </div>
//             )}
//           </div>
//         );
//       },
//     },
//     {
//       Header: "action",
//       accessor: "action",
//       Cell: ({ row }) => {
//         const navigate = useNavigate();
//         const handleDelete = async (reportId) => {
//           try {
//             const response = await deleteReport(reportId);
//             if (response.success) {
//               setData((prevData) =>
//                 prevData.filter((report) => report._id !== reportId)
//               );
//               toast.success("Report deleted successfully");
//             } else {
//               toast.error("Failed to delete report");
//             }
//           } catch (error) {
//             console.error("Delete error:", error);
//             toast.error(`Failed to delete report: ${error.message}`);
//           }
//         };
//         return (
//           <div className="flex space-x-3 rtl:space-x-reverse">
//             <Tooltip
//               content="Delete"
//               placement="top"
//               arrow
//               animation="shift-away"
//               theme="danger"
//             >
//               <button
//                 className="action-btn"
//                 type="button"
//                 onClick={() => {
//                   handleDelete(row.original._id);
//                 }}
//               >
//                 <Icon icon="heroicons:trash" />
//               </button>
//             </Tooltip>
//           </div>
//         );
//       },
//     },
//   ];
//   const columns = useMemo(() => COLUMNS, []);

//   const tableInstance = useTable(
//     {
//       columns,
//       data: data || [],
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination,
//     useRowSelect,
//     (hooks) => {
//       hooks.visibleColumns.push((columns) => [...columns]);
//     }
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     footerGroups,
//     page,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     state,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     setGlobalFilter,
//     prepareRow,
//   } = tableInstance;

//   const { globalFilter, pageIndex, pageSize } = state;

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <>
//       <Card>
//         <div className="md:flex justify-between items-center mb-6">
//           <h4 className="card-title">{title}</h4>
//           <div>
//             <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
//           </div>
//         </div>
//         <div className="overflow-x-auto -mx-6">
//           <div className="inline-block min-w-full align-middle">
//             <div className="overflow-hidden ">
//               <table
//                 className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
//                 {...getTableProps}
//               >
//                 <thead className="bg-slate-200 dark:bg-slate-700">
//                   {headerGroups.map((headerGroup) => (
//                     <tr {...headerGroup.getHeaderGroupProps()}>
//                       {headerGroup.headers.map((column) => (
//                         <th
//                           {...column.getHeaderProps(
//                             column.getSortByToggleProps()
//                           )}
//                           scope="col"
//                           className=" table-th "
//                         >
//                           {column.render("Header")}
//                           <span>
//                             {column.isSorted
//                               ? column.isSortedDesc
//                                 ? " 🔽"
//                                 : " 🔼"
//                               : ""}
//                           </span>
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//                 <tbody
//                   className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
//                   {...getTableBodyProps}
//                 >
//                   {page.map((row) => {
//                     prepareRow(row);
//                     return (
//                       <tr {...row.getRowProps()}>
//                         {row.cells.map((cell) => {
//                           return (
//                             <td {...cell.getCellProps()} className="table-td">
//                               {cell.render("Cell")}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
//           <div className=" flex items-center space-x-3 rtl:space-x-reverse">
//             <select
//               className="form-control py-2 w-max"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 25, 50].map((pageSize) => (
//                 <option key={pageSize} value={pageSize}>
//                   Show {pageSize}
//                 </option>
//               ))}
//             </select>
//             <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
//               Page{" "}
//               <span>
//                 {pageIndex + 1} of {pageOptions.length}
//               </span>
//             </span>
//           </div>
//           <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
//             <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${
//                   !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 <Icon icon="heroicons:chevron-double-left-solid" />
//               </button>
//             </li>
//             <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${
//                   !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 Prev
//               </button>
//             </li>
//             {pageOptions.map((page, pageIdx) => (
//               <li key={pageIdx}>
//                 <button
//                   href="#"
//                   aria-current="page"
//                   className={` ${
//                     pageIdx === pageIndex
//                       ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
//                       : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
//                   }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
//                   onClick={() => gotoPage(pageIdx)}
//                 >
//                   {page + 1}
//                 </button>
//               </li>
//             ))}
//             <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${
//                   !canNextPage ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 Next
//               </button>
//             </li>
//             <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//                 className={` ${
//                   !canNextPage ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 <Icon icon="heroicons:chevron-double-right-solid" />
//               </button>
//             </li>
//           </ul>
//         </div>
//         {/*end*/}
//       </Card>
//     </>
//   );
// };

// export default ReportDetailsPage;

import React, { useState, useMemo } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import { toast } from "react-toastify";

const DUMMY_DATA = [
  {
    _id: "1",
    userName: "John Doe",
    number: "1234567890",
    email: "john@example.com",
    isActive: true,
    profileUrl: "https://via.placeholder.com/40",
  },
  {
    _id: "2",
    userName: "Jane Smith",
    number: "0987654321",
    email: "jane@example.com",
    isActive: false,
    profileUrl: "",
  },
];

const COLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    Header: "Name",
    accessor: "userName",
  },
  {
    Header: "Mobile",
    accessor: "number",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Active",
    accessor: "isActive",
    Cell: ({ row }) => {
      const [isActive, setIsActive] = useState(row.original.isActive);

      const handleStatusChange = (newStatus) => {
        setIsActive(newStatus);
        toast.success("User status updated successfully");
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
      const profileUrl = row.original.profileUrl;
      return (
        <div className="inline-flex items-center">
          <span className="w-7 h-7 rounded-full flex-none bg-slate-600">
            {profileUrl ? (
              <img
                src={profileUrl}
                alt="Profile"
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-white text-xs">
                {row.original.userName.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
        </div>
      );
    },
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: ({ row }) => {
      const handleDelete = (userId) => {
        toast.success(`User with ID ${userId} deleted successfully`);
      };

      return (
        <div className="flex space-x-3">
          <Tooltip content="View">
            <button className="action-btn">
              <Icon icon="heroicons:eye" />
            </button>
          </Tooltip>
          <Tooltip content="Edit">
            <button className="action-btn">
              <Icon icon="heroicons:pencil-square" />
            </button>
          </Tooltip>
          <Tooltip content="Delete" theme="danger">
            <button
              className="action-btn"
              onClick={() => handleDelete(row.original._id)}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

const UserTable = ({ title = "Users" }) => {
  const columns = useMemo(() => COLUMNS, []);
  const [data, setData] = useState(DUMMY_DATA);

  const tableInstance = useTable(
    { columns, data },
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

  return (
    <Card>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">{title}</h4>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      </div>
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100" {...getTableProps()}>
              <thead className="bg-slate-200">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-th">
                        {column.render("Header")}
                        <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-slate-100" {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="table-td">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="md:flex justify-between mt-6 items-center">
        <div className="flex items-center space-x-3">
          <select
            className="form-control py-2 w-max"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <span>
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
        </div>
        <ul className="flex items-center space-x-3">
          <li>
            <button disabled={!canPreviousPage} onClick={() => gotoPage(0)}>
              ⏮
            </button>
          </li>
          <li>
            <button disabled={!canPreviousPage} onClick={() => previousPage()}>
              Prev
            </button>
          </li>
          {pageOptions.map((_, idx) => (
            <li key={idx}>
              <button
                className={pageIndex === idx ? "bg-blue-500 text-white" : ""}
                onClick={() => gotoPage(idx)}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li>
            <button disabled={!canNextPage} onClick={() => nextPage()}>
              Next
            </button>
          </li>
          <li>
            <button disabled={!canNextPage} onClick={() => gotoPage(pageCount - 1)}>
              ⏭
            </button>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default UserTable;
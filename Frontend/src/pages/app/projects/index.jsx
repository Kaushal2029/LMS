import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import ProjectGrid from "./ProjectGrid";
import ProjectList from "./ProjectList";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import { toggleAddModal } from "./store";
import AddProject from "./AddProject";
import { ToastContainer } from "react-toastify";
import EditProject from "./EditProject";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import axios from "axios";

const ProjectPostPage = () => {
  const [filler, setfiller] = useState("grid");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { projects } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoaded(true);
    setTimeout(() => {
      setIsLoaded(false);
    }, 1500);
  }, [filler]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8000/api/admin/books",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.books) {
          setBooks(response.data.books);
        } else if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          console.error("Unexpected response structure:", response.data);
          setBooks([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Books
        </h4>
        <div
          className={`${
            width < breakpoints.md ? "space-x-rb" : ""
          } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
        >
          {/* <Button
            icon="heroicons:list-bullet"
            text="List view"
            disabled={isLoaded}
            className={`${
              filler === "list"
                ? "bg-slate-900 dark:bg-slate-700  text-white"
                : " bg-white dark:bg-slate-800 dark:text-slate-300"
            }   h-min text-sm font-normal`}
            iconClass=" text-lg"
            onClick={() => setfiller("list")}
          />
          <Button
            icon="heroicons-outline:view-grid"
            text="Grid view"
            disabled={isLoaded}
            className={`${
              filler === "grid"
                ? "bg-slate-900 dark:bg-slate-700 text-white"
                : " bg-white dark:bg-slate-800 dark:text-slate-300"
            }   h-min text-sm font-normal`}
            iconClass=" text-lg"
            onClick={() => setfiller("grid")}
          /> */}
          {/* <Button
            icon="heroicons-outline:filter"
            text="On going"
            className="bg-white dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-900 hover:text-white btn-md  h-min text-sm font-normal"
            iconClass=" text-lg"
          /> */}
          <Button
            icon="heroicons-outline:plus"
            text="Add Book"
            className="btn-dark dark:bg-slate-800  h-min text-sm font-normal"
            iconClass=" text-lg"
            onClick={() => dispatch(toggleAddModal(true))}
          />
        </div>
      </div>
      {isLoaded && filler === "grid" && (
        <GridLoading count={projects?.length} />
      )}
      {isLoaded && filler === "list" && (
        <TableLoading count={projects?.length} />
      )}

      {filler === "grid" && !isLoaded && (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : books.length > 0 ? (
            books.map((book) => <ProjectGrid key={book.id} book={book} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <h3 className="text-xl font-medium text-slate-900 dark:text-slate-300">
                No books found
              </h3>
            </div>
          )}
        </div>
      )}
      {filler === "list" && !isLoaded && (
        <div>
          <ProjectList projects={projects} />
        </div>
      )}
      <AddProject />
      <EditProject />
    </div>
  );
};

export default ProjectPostPage;

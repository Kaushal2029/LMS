import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8000/api/admin/books",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {books.map((book) => (
          <Card
            key={book.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-medium text-slate-900 dark:text-slate-300">
                  {book.name}
                </h2>
                <span className="text-sm font-medium text-primary-500">
                  ${book.price}
                </span>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-slate-500 dark:text-slate-400">By</span>
                <span className="text-slate-900 dark:text-slate-300 font-medium">
                  {book.authorName}
                </span>
              </div>

              <div className="text-slate-600 dark:text-slate-400 line-clamp-3">
                {book.description}
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 text-xs">
                  {book.genre}
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 text-xs">
                  {book.publishedYear}
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 text-xs">
                  Stock: {book.stock}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon
                    icon="heroicons-outline:book-open"
                    className="text-slate-500"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    View Details
                  </span>
                </div>
                <button className="text-sm font-medium text-primary-500 hover:text-primary-600">
                  Add to Cart
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BooksPage;

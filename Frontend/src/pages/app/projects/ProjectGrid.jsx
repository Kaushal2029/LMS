import React from "react";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectGrid = ({ book = {} }) => {
  // Provide default values for all properties
  const {
    name = "Untitled Book",
    authorName = "Unknown Author",
    description = "No description available",
    publishedYear = "N/A",
    genre = "Uncategorized",
    price = 0,
    stock = 0,
  } = book;

  const navigate = useNavigate();

  // handleClick to view book details
  const handleClick = (book) => {
    if (book && book.id) {
      navigate(`/projects/${book.id}`);
    }
  };

  return (
    <Card>
      {/* header */}
      <header className="flex justify-between items-end">
        <div className="flex space-x-4 items-center rtl:space-x-reverse">
          <div className="flex-none">
            <div className="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
              {name.charAt(0) + name.charAt(1)}
            </div>
          </div>
          <div className="font-medium text-base leading-6">
            <div className="dark:text-slate-200 text-slate-900 max-w-[160px] truncate">
              {name}
            </div>
          </div>
        </div>
        <div>
          <Dropdown
            classMenuItems=" w-[130px]"
            label={
              <span className="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400">
                <Icon icon="heroicons-outline:dots-vertical" />
              </span>
            }
          >
            <div>
              <Menu.Item onClick={() => handleClick(book)}>
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                >
                  <span className="text-base">
                    <Icon icon="heroicons:eye" />
                  </span>
                  <span>View</span>
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                >
                  <span className="text-base">
                    <Icon icon="heroicons-outline:shopping-cart" />
                  </span>
                  <span>Add to Cart</span>
                </div>
              </Menu.Item>
            </div>
          </Dropdown>
        </div>
      </header>

      {/* book details */}
      <div className="space-y-4 mt-4">
        {/* author */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-slate-500 dark:text-slate-400">By</span>
          <span className="text-slate-900 dark:text-slate-300 font-medium">
            {authorName}
          </span>
        </div>

        {/* description */}
        <div className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
          {description}
        </div>

        {/* price and stock */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-primary-500">${price}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Stock: {stock}
          </span>
        </div>

        {/* genre and year */}
        <div className="flex flex-wrap gap-2">
          <div className="bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 text-xs">
            {genre}
          </div>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 text-xs">
            {publishedYear}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectGrid;

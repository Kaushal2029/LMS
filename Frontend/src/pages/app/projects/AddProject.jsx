import React, { useState } from "react";
import Select, { components } from "react-select";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { toggleAddModal, pushProject } from "./store";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";

import avatar1 from "@/assets/images/avatar/av-1.svg";
import avatar2 from "@/assets/images/avatar/av-2.svg";
import avatar3 from "@/assets/images/avatar/av-3.svg";
import avatar4 from "@/assets/images/avatar/av-4.svg";
import FormGroup from "@/components/ui/FormGroup";

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const assigneeOptions = [
  { value: "mahedi", label: "Mahedi Amin", image: avatar1 },
  { value: "sovo", label: "Sovo Haldar", image: avatar2 },
  { value: "rakibul", label: "Rakibul Islam", image: avatar3 },
  { value: "pritom", label: "Pritom Miha", image: avatar4 },
];
const options = [
  {
    value: "team",
    label: "team",
  },
  {
    value: "low",
    label: "low",
  },
  {
    value: "medium",
    label: "medium",
  },
  {
    value: "high",
    label: "high",
  },
  {
    value: "update",
    label: "update",
  },
];

const OptionComponent = ({ data, ...props }) => {
  //const Icon = data.icon;

  return (
    <components.Option {...props}>
      <span className="flex items-center space-x-4">
        <div className="flex-none">
          <div className="h-7 w-7 rounded-full">
            <img
              src={data.image}
              alt=""
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
        <span className="flex-1">{data.label}</span>
      </span>
    </components.Option>
  );
};

const AddProject = () => {
  const { openProjectModal } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const FormValidationSchema = yup
    .object({
      name: yup.string().required("Book name is required"),
      authorName: yup.string().required("Author name is required"),
      description: yup.string().required("Description is required"),
      publishedYear: yup.number().required("Published year is required"),
      genre: yup.string().required("Genre is required"),
      price: yup.number().required("Price is required"),
      stock: yup.number().required("Stock is required"),
    })
    .required();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    try {
      const authToken = localStorage.getItem("authToken"); // Get token from localStorage
      const response = await axios.post(
        "http://localhost:8000/api/admin/books",
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        dispatch(pushProject(response.data));
        dispatch(toggleAddModal(false));
        reset();
        toast.success("Book added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add book. Please try again.");
      console.error("Error adding book:", error);
    }
  };

  return (
    <div>
      <Modal
        title="Add New Book"
        labelclassName="btn-outline-dark"
        activeModal={openProjectModal}
        onClose={() => dispatch(toggleAddModal(false))}
        // className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <div className="relative bg-white w-full max-w-[950px] p-6 rounded-2xl shadow-2xl transform transition-all scale-100">
          {/* <button
            onClick={() => dispatch(toggleAddModal(false))}
            className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 shadow-md transition-all"
          >
            ✖
          </button> */}

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            📚 Add New Book
          </h2>

          {/* Form Layout - Two Columns */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-10"
          >
            {/* Left Side */}
            <div className="space-y-5">
              <Textinput
                name="name"
                label="📖 Book Name"
                placeholder="Enter book name"
                register={register}
                error={errors.name}
              />
              <Textinput
                name="authorName"
                label="✍️ Author Name"
                placeholder="Enter author name"
                register={register}
                error={errors.authorName}
              />
              <Textinput
                name="publishedYear"
                label="📅 Published Year"
                placeholder="Enter year"
                type="number"
                register={register}
                error={errors.publishedYear}
              />
              <Textinput
                name="price"
                label="💰 Price"
                placeholder="Enter price"
                type="number"
                register={register}
                error={errors.price}
              />
            </div>

            {/* Right Side */}
            <div className="space-y-5">
              <Textarea
                name="description"
                label="📝 Description"
                placeholder="Enter book description"
                register={register}
                error={errors.description}
              />
              <Textinput
                name="genre"
                label="🎭 Genre"
                placeholder="Enter genre"
                register={register}
                error={errors.genre}
              />
              <Textinput
                name="stock"
                label="📦 Stock"
                placeholder="Enter stock quantity"
                type="number"
                register={register}
                error={errors.stock}
              />
            </div>

            {/* Submit Button - Full Width */}
            <div className="col-span-2 text-center">
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
                🚀 Add Book
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddProject;

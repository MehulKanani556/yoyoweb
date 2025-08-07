import { Box, Modal, Pagination, useMediaQuery } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { Link } from "react-router-dom";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../Redux/Slice/category.slice";

export default function Category() {
  const [categoryData, setCategoryData] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [delAllOpen, setDelAllOpen] = useState(false);
  const dispatch = useDispatch();
  const [createopen, setCreateopen] = useState(false);
  const category = useSelector(state => state.category.categories);
  const loading = useSelector(state => state.category.loading);
  const isSmallScreen = useMediaQuery("(max-width:425px)");

  const [error, setError] = useState("");
  const [isImageChanged, setIsImageChanged] = useState(false);
  const fileInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    category_description: Yup.string().required("Category description is required"),
    category_image: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, must be 2MB or less",
        function (value) {
          if (!value) return true;
          if (typeof value === "string") return true; // Skip for existing image URLs
          return value.size <= 2 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", function (value) {
        if (!value) return true;
        if (typeof value === "string") return true; // Skip for existing image URLs
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      category_description: "",
      category_image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("categoryName", values.categoryName);
      formData.append("category_description", values.category_description);

      if (values.category_image && typeof values.category_image !== "string") {
        formData.append("category_image", values.category_image);
      }

      if (categoryData) {
        // Update category
        dispatch(updateCategory({ _id: categoryData._id, formData }));
      } else {
        // Create category
        dispatch(createCategory(formData));
      }
      handleCreateClose();
    },
  });

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Search functionality
  const filteredData = Array.isArray(category)
    ? category.filter(data =>
      data?.categoryName?.toLowerCase().includes(searchValue.toLowerCase())
    )
    : [];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpen = (data) => {
    setCreateopen(true);
    setCategoryData(data);
    if (data) {
      formik.setValues({
        categoryName: data.categoryName,
        category_description: data.category_description,
        category_image: data.category_image?.url || null,
      });
    }
  };

  const handleDeleteOpen = (data) => {
    setDelOpen(true);
    setCategoryData(data);
  };

  const handleDeleteClose = () => {
    setDelOpen(false);
  };

  const handleDeleteCategory = () => {
    dispatch(deleteCategory({ _id: categoryData._id }));
    setDelOpen(false);
  };

  const handleDeleteAll = () => {
    // Implement delete all functionality if needed
    console.log("Delete All Categories");
  };

  const handleCreateClose = () => {
    setCreateopen(false);
    setCategoryData("");
    formik.resetForm();
    setIsImageChanged(false);
  };

  return (
    <div className="container p-5 md:p-10 bg-[#141414]">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-brown mb-2">Category</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 w-full flex justify-content-between ">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="rounded w-full md:w-64 p-2 bg-white/10"
          />
        </div>

        <div className="flex gap-4 ">
          {/* <button
              className="bg-primary-light/15 w-32  px-4 py-2 rounded flex justify-center items-center gap-2"
              onClick={() => setDelAllOpen(true)}
            >
              <span>
                <RiDeleteBin6Fill />
              </span>
              <span>Delete All</span>
            </button> */}
          <button
            className="bg-primary-light/15 w-20 sm:w-20 md600:w-32 text-white px-4 py-2 rounded "
            onClick={() => setCreateopen(true)}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="overflow-auto shadow mt-5 rounded">
        <table className="w-full bg-white/5 min-w-[700px]">
          <thead>
            <tr className="text-brown font-bold">
              {/* <td className="py-2 px-5 w-1/6">ID</td> */}
              <td className="py-2 px-5 w-1/6">Name</td>
              <td className="py-2 px-5 w-1/3">Description</td>
              <td className="py-2 px-5 w-1/6 text-center">Created At</td>
              <td className="py-2 px-5 w-1/6 text-end">Action</td>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((category, index) => (
              <tr
                key={category._id}
                className="border-t border-gray-950"
              >
                {/* <td className="py-2 px-5">{category._id}</td> */}
                <td className="py-2 px-5 flex items-center">
                  <img
                    src={category.category_image?.url}
                    alt={category.categoryName}
                    className="w-10 h-10 rounded-full mr-2 object-cover"
                  />
                  {category.categoryName}
                </td>
                <td className="py-2 px-5">
                  <span className="truncate block max-w-xs">
                    {category.category_description}
                  </span>
                </td>
                <td className="py-2 px-5 text-center">
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-5 flex justify-end gap-2">
                  <div>
                    <button
                      className="text-green-700 text-xl p-1 border border-brown-50 transition-colors rounded hover:text-green-800"
                      onClick={() => handleOpen(category)}
                    >
                      <RiEdit2Fill />
                    </button>
                  </div>
                  <div>
                    <button
                      className="text-red-500 text-xl p-1 border border-brown-50  transition-colors rounded hover:text-red-600"
                      onClick={() => handleDeleteOpen(category)}
                    >
                      <RiDeleteBin6Fill />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => handlePageChange(page)}
          variant="outlined"
          shape="rounded"
          className="flex justify-end mt-4"
          siblingCount={0}
          boundaryCount={isSmallScreen ? 0 : 1}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "white",
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.06)",
            },
          }}
        />
      )}

      {/* Create & Update Category Modal */}
      <Modal
        open={createopen}
        className="bg-white/10 backdrop:blur-sm"
        onClose={handleCreateClose}
      >
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%] max-h-[90vh] overflow-y-auto">
          <form onSubmit={formik.handleSubmit} className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">
                {categoryData ? "Edit" : "Add"} Category
              </p>
            </div>

            <div className="mt-6">
              <label className=" font-bold">Category Name</label>
              <input
                type="text"
                name="categoryName"
                placeholder="Enter Category Name"
                value={formik.values.categoryName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="rounded w-full p-2 mt-1 bg-white/5"
              />
              {formik.touched.categoryName && formik.errors.categoryName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.categoryName}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className=" font-bold">Category Description</label>
              <textarea
                name="category_description"
                placeholder="Enter Category Description"
                value={formik.values.category_description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="3"
                className="bg-white/5 rounded w-full p-2 mt-1 resize-none"
              />
              {formik.touched.category_description &&
                formik.errors.category_description && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.category_description}
                  </p>
                )}
            </div>

            <div className="mt-4">
              <label className="text-brown font-bold">Category Image</label>
              <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                {formik.values.category_image ? (
                  <>
                    <div className="flex max-w-[75%] items-center bg-[#72727226] px-2">
                      <img
                        src={
                          typeof formik.values.category_image === "string"
                            ? formik.values.category_image
                            : URL.createObjectURL(formik.values.category_image)
                        }
                        alt="Preview"
                        className="w-7 h-7 rounded-full mr-2 object-cover"
                      />
                      <span className="w-full truncate">
                        {typeof formik.values.category_image === "string"
                          ? formik.values.category_image.split("/").pop()
                          : formik.values.category_image.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("category_image", null);
                          setIsImageChanged(false);
                        }}
                        className="text-red-500 ml-1 text-[12px]"
                      >
                        X
                      </button>
                    </div>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                    >
                      Change
                    </label>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-[16px] text-[#727272]">
                      Choose Image
                    </p>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                    >
                      Browse
                    </label>
                  </>
                )}
                <input
                  id="file-upload"
                  name="category_image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("category_image", file);
                    setIsImageChanged(!!file);
                  }}
                  className="hidden"
                />
              </div>
              {formik.touched.category_image &&
                formik.errors.category_image && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.category_image}
                  </p>
                )}
            </div>

            <div className="flex justify-center gap-8 mt-8">
              <button
                type="button"
                onClick={handleCreateClose}
                className="text-brown w-36 border-brown border px-5 py-2 rounded hover:bg-brown-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
              >
                {loading ? "Processing..." : categoryData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Delete Category Modal */}
      <Modal open={delOpen} onClose={handleDeleteClose}>
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">Delete Category</p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete "{categoryData?.categoryName}"?
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <button
                onClick={handleDeleteClose}
                className="text-brown w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={loading}
                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Delete All Categories Modal */}
      <Modal open={delAllOpen} onClose={() => setDelAllOpen(false)}>
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">
                Delete All Categories
              </p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete all categories? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <button
                onClick={() => setDelAllOpen(false)}
                className="text-brown w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50"
              >
                Delete All
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
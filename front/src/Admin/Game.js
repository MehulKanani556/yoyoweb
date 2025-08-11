import {
  Box,
  Modal,
  Pagination,
  useMediaQuery,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { RiDeleteBin6Fill, RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllGames,
  createGame,
  updateGame,
  deleteGame,
} from "../Redux/Slice/game.slice";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getAllCategories } from "../Redux/Slice/category.slice";

export default function Game() {
  const dispatch = useDispatch();
  //   const games = useSelector(state => state.game.games);
  // const loading = useSelector(state => state.game.loading);

  const [gameData, setGameData] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isImageChanged, setIsImageChanged] = useState(false);
  const fileInputRef = useRef(null);
  const isSmallScreen = useMediaQuery("(max-width:425px)");
  const categories = useSelector((state) => state.category.categories);
  const games = useSelector((state) => state.game.games);
  const loading = useSelector((state) => state.game.loading);

  useEffect(() => {
    dispatch(getAllGames());
    dispatch(getAllCategories())
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Game title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    cover_image: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, must be 2MB or less",
        (value) => {
          if (!value) return true;
          if (typeof value === "string") return true;
          return value.size <= 2 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", (value) => {
        if (!value) return true;
        if (typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
    video: Yup.mixed()
      .notRequired()
      .test(
        "fileSize",
        "File size is too large, must be 20MB or less",
        (value) => {
          if (!value) return true;
          if (typeof value === "string") return true;
          return value.size <= 20 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", (value) => {
        if (!value) return true;
        if (typeof value === "string") return true;
        return ["video/mp4", "video/webm", "video/ogg"].includes(value.type);
      }),
    instructions: Yup.string(),
    isActive: Yup.boolean(),
    tags: Yup.array().of(Yup.string()),
    platforms: Yup.object().shape({
      windows: Yup.object().shape({
        available: Yup.boolean(),
        price: Yup.string(),
        size: Yup.string(),
        system_requirements: Yup.object().shape({
          os: Yup.string(),
          processor: Yup.string(),
          memory: Yup.string(),
          graphics: Yup.string(),
          storage: Yup.string(),
        }),
      }),
      ios: Yup.object().shape({
        available: Yup.boolean(),
        price: Yup.string(),
        size: Yup.string(),
        system_requirements: Yup.object().shape({
          ios_version: Yup.string(),
          device_compatibility: Yup.string(),
        }),
      }),
      android: Yup.object().shape({
        available: Yup.boolean(),
        price: Yup.string(),
        size: Yup.string(),
        system_requirements: Yup.object().shape({
          android_version: Yup.string(),
          device_compatibility: Yup.string(),
        }),
      }),
    }),
    // Add more validations as needed
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      cover_image: null,
      video: null,
      instructions: "",
      isActive: true,
      tags: [],
      images: [],
      platforms: {
        windows: {
          available: false,
          price: "",
          size: "",
          system_requirements: {
            os: "",
            processor: "",
            memory: "",
            graphics: "",
            storage: "",
          },
        },
        ios: {
          available: false,
          price: "",
          size: "",
          system_requirements: {
            ios_version: "",
            // device_compatibility: "",
          },
        },
        android: {
          available: false,
          price: "",
          size: "",
          system_requirements: {
            android_version: "",
            // device_compatibility: "",
          },
        },
      },
      windows_file: null,
      ios_file: null,
      android_file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("instructions", values.instructions || "");
      formData.append("isActive", values.isActive ? "true" : "false");
      formData.append("tags", JSON.stringify(values.tags));
      if (values.cover_image && typeof values.cover_image !== "string") {
        formData.append("cover_image", values.cover_image);
      }
      if (values.video && typeof values.video !== "string") {
        formData.append("video", values.video);
      }
      if (values.windows_file) {
        formData.append("windows_file", values.windows_file);
      }
      if (values.ios_file) {
        formData.append("ios_file", values.ios_file);
      }
      if (values.android_file) {
        formData.append("android_file", values.android_file);
      }
      if (values.images && Array.isArray(values.images)) {
        values.images.forEach((img) => {
          if (img && typeof img !== "string") {
            formData.append("images", img);
          }
        });
      }
      formData.append("platforms", JSON.stringify(values.platforms));

      if (gameData) {
        await dispatch(updateGame({ _id: gameData._id, formData }));
      } else {
        await dispatch(createGame(formData));
      }

      handleCreateClose();
      formik.resetForm();
      setIsImageChanged(false);
    },
  });

  // Search and pagination
  const filteredData = Array.isArray(games)
  ? games.filter((data) => {
      const search = searchValue.toLowerCase();
      // Title match
      const titleMatch = data?.title?.toLowerCase().includes(search);
      // Category match (if category is an object with categoryName)
      const categoryMatch =
        typeof data?.category === "object"
          ? data?.category?.categoryName?.toLowerCase().includes(search)
          : false;
      // Tags match (if tags is an array)
      const tagsMatch = Array.isArray(data?.tags)
        ? data.tags.some((tag) => tag?.toLowerCase().includes(search))
        : false;
      return titleMatch || categoryMatch || tagsMatch;
    })
  : [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleOpen = (data) => {
    setCreateOpen(true);
    setGameData(data);
    if (data) {
      formik.setValues({
        title: data.title,
        description: data.description,
        category: data.category?._id || "",
        cover_image: data.cover_image?.url || null,
        video: data.video?.url || null,
        instructions: data.instructions || "",
        isActive: data.isActive || true,
        tags: data.tags || [],
        images: Array.isArray(data.images)
          ? data.images.map((img) => (typeof img === "string" ? img : img.url))
          : [],
        platforms: {
          windows: {
            available: data.platforms?.windows?.available || false,
            price: data.platforms?.windows?.price || "",
            size: data.platforms?.windows?.size || "",
            system_requirements: {
              os: data.platforms?.windows?.system_requirements?.os || "",
              processor:
                data.platforms?.windows?.system_requirements?.processor || "",
              memory:
                data.platforms?.windows?.system_requirements?.memory || "",
              graphics:
                data.platforms?.windows?.system_requirements?.graphics || "",
              storage:
                data.platforms?.windows?.system_requirements?.storage || "",
            },
          },
          ios: {
            available: data.platforms?.ios?.available || false,
            price: data.platforms?.ios?.price || "",
            size: data.platforms?.ios?.size || "",
            system_requirements: {
              ios_version:
                data.platforms?.ios?.system_requirements?.ios_version || "",
              // device_compatibility:
              //   data.platforms?.ios?.system_requirements
              //     ?.device_compatibility || "",
            },
          },
          android: {
            available: data.platforms?.android?.available || false,
            price: data.platforms?.android?.price || "",
            size: data.platforms?.android?.size || "",
            system_requirements: {
              android_version:
                data.platforms?.android?.system_requirements?.android_version ||
                "",
              // device_compatibility:
              //   data.platforms?.android?.system_requirements
              //     ?.device_compatibility || "",
            },
          },
        },
        windows_file: data.platforms?.windows?.file || null,
        ios_file: data.platforms?.ios?.file || null,
        android_file: data.platforms?.android?.file || null,
      });
    }
  };
  const handleCreateClose = () => {
    setCreateOpen(false);
    setGameData("");
    formik.resetForm();
    setIsImageChanged(false);
  };
  const handleDeleteOpen = (data) => {
    setDelOpen(true);
    setGameData(data);
  };
  const handleDeleteClose = () => setDelOpen(false);
  const handleDeleteGame = () => {
    dispatch(deleteGame({ _id: gameData._id }));
    setDelOpen(false);
  };

  return (
    <div className="container p-5 md:p-10 bg-[#141414]">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-brown mb-2">Games</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 w-full flex justify-content-between ">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search games..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="rounded w-full md:w-64 p-2 bg-white/10"
          />
        </div>
        <div className="flex gap-4 ">
          <button
            className="bg-primary-light/15 w-20 sm:w-20 md600:w-32 text-white px-4 py-2 rounded "
            onClick={() => setCreateOpen(true)}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="overflow-auto shadow mt-5 rounded">
        <table className="w-full bg-white/5 min-w-[900px]">
          <thead>
            <tr className="text-brown font-bold">
              <td className="py-2 px-5 w-1/12">Cover</td>
              <td className="py-2 px-5 w-1/6">Title</td>
              <td className="py-2 px-5 w-1/6">Category</td>
              <td className="py-2 px-5 w-1/6">Tags</td>
              <td className="py-2 px-5 w-1/6">Platforms</td>
              <td className="py-2 px-5 w-1/12 text-center">Active</td>
              <td className="py-2 px-5 w-1/6 text-center">Created At</td>
              <td className="py-2 px-5 w-1/6 text-end">Action</td>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((game) => (
              <tr key={game._id} className="border-t border-gray-950">
                <td className="py-2 px-5">
                  <img
                    src={game.cover_image?.url}
                    alt={game.title}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-2 px-5">{game.title}</td>
                <td className="py-2 px-5">{game.category?.categoryName}</td>
                <td className="py-2 px-5">
                  {Array.isArray(game.tags) && game.tags.length > 0
                    ? game.tags.join(", ")
                    : "-"}
                </td>
                <td className="py-2 px-5">
                  {["windows", "ios", "android"]
                    .filter((p) => game.platforms?.[p]?.available)
                    .map((p) => (
                      <span
                        key={p}
                        className="inline-block bg-brown text-white rounded px-2 py-1 text-xs mr-1"
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </span>
                    ))}
                </td>
                <td className="py-2 px-5 text-center">
                  <span
                    className={
                      game.isActive
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {game.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-2 px-5 text-center">
                  {new Date(game.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-5 flex justify-end gap-2">
                  <button
                    className="text-green-700 text-xl p-1 border border-brown-50 transition-colors rounded hover:text-green-800"
                    onClick={() => handleOpen(game)}
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="text-red-500 text-xl p-1 border border-brown-50  transition-colors rounded hover:text-red-600"
                    onClick={() => handleDeleteOpen(game)}
                  >
                    <RiDeleteBin6Fill />
                  </button>
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
            "& .MuiPaginationItem-root": { color: "white" },
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

      {/* Create & Update Game Modal */}
      <Modal
        open={createOpen}
        className="bg-white/10 backdrop:blur-sm"
        onClose={handleCreateClose}
      >
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[700px] w-[100%] max-h-[90vh] overflow-y-auto scrollbar-hide">
          <form onSubmit={formik.handleSubmit} className="p-5 space-y-6">
            <div className="text-center mb-4">
              <p className="text-brown font-bold text-2xl">
                {gameData ? "Edit" : "Add"} Game
              </p>
            </div>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="font-bold">Game Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Game Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded w-full p-2 mt-1 bg-white/5"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-sm">{formik.errors.title}</p>
                )}
              </div>
              <div>
                <label className="font-bold" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white/5 rounded w-full p-2 mt-1"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.category}
                  </p>
                )}
              </div>
              <div>
                <label className="font-bold">Tags</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="Comma separated tags"
                  value={formik.values.tags.join(",")}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "tags",
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  }
                  className="rounded w-full p-2 mt-1 bg-white/5"
                />
              </div>
            </div>
            {/* Description & Instructions */}
            <div>
              <label className="font-bold">Description</label>
              <textarea
                name="description"
                placeholder="Enter Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="2"
                className="bg-white/5 rounded w-full p-2 mt-1 resize-none"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">
                  {formik.errors.description}
                </p>
              )}
            </div>
            <div>
              <label className="font-bold">Instructions</label>
              <textarea
                name="instructions"
                placeholder="Game instructions"
                value={formik.values.instructions}
                onChange={formik.handleChange}
                className="bg-white/5 rounded w-full p-2 mt-1 resize-none"
              />
            </div>
            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-brown font-bold">Cover Image</label>
                <div className="flex items-center border border-brown rounded w-full p-2 mt-1">
                  {formik.values.cover_image ? (
                    <>
                      <img
                        src={
                          typeof formik.values.cover_image === "string"
                            ? formik.values.cover_image
                            : URL.createObjectURL(formik.values.cover_image)
                        }
                        alt="Preview"
                        className="w-10 h-10 rounded-full mr-2 object-cover"
                      />
                      <span className="w-full truncate">
                        {typeof formik.values.cover_image === "string"
                          ? formik.values.cover_image.split("/").pop()
                          : formik.values.cover_image.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("cover_image", null);
                          setIsImageChanged(false);
                        }}
                        className="text-red-500 ml-1 text-[12px]"
                      >
                        X
                      </button>
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px] ml-2"
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
                    name="cover_image"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("cover_image", file);
                      setIsImageChanged(!!file);
                    }}
                    className="hidden"
                  />
                </div>
                {formik.touched.cover_image && formik.errors.cover_image && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.cover_image}
                  </p>
                )}
              </div>
              {/* <div>
                <label className="font-bold">Video</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("video", file);
                  }}
                  className="block w-full mt-1"
                />
                {formik.touched.video && formik.errors.video && (
                  <p className="text-red-500 text-sm">{formik.errors.video}</p>
                )}
              </div> */}

              {/* Video */}
              <div>
                <label className="font-bold">Video</label>
                <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                  {formik.values.video ? (
                    <>
                      <div className="flex items-center bg-[#72727226] px-2 py-1">
                        <span className="flex-1 max-w-8 md:max-w-48 truncate">
                          {typeof formik.values.video === "string"
                            ? formik.values.video.split("/").pop()
                            : formik.values.video.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("video", null);
                          }}
                          className="text-red-500 ml-1 text-[12px]"
                        >
                          X
                        </button>
                      </div>
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                      >
                        Change
                      </label>
                    </>
                  ) : (
                    <>
                      <p className="flex-1 text-[16px] text-[#727272]">
                        Choose Video
                      </p>
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                      >
                        Browse
                      </label>
                    </>
                  )}
                  <input
                    id="video-upload"
                    name="video"
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("video", file);
                    }}
                    className="hidden"
                  />
                </div>
                {formik.touched.video && formik.errors.video && (
                  <p className="text-red-500 text-sm">{formik.errors.video}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-brown font-bold">Gallery Images</label>
              <div className="flex items-center border border-brown rounded w-full p-2 mt-1">
                {formik.values.images &&
                Array.isArray(formik.values.images) &&
                formik.values.images.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {formik.values.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={
                              typeof img === "string"
                                ? img
                                : URL.createObjectURL(img)
                            }
                            alt={`img-${idx}`}
                            className="w-7 h-7 object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute -top-0 -right-0 bg-transparent text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                            onClick={() => {
                              const newImages = [...formik.values.images];
                              newImages.splice(idx, 1);
                              formik.setFieldValue("images", newImages);
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                    <label
                      htmlFor="gallery-upload"
                      className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px] ml-2"
                    >
                      Add More
                    </label>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-[16px] text-[#727272]">
                      Choose Images
                    </p>
                    <label
                      htmlFor="gallery-upload"
                      className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                    >
                      Browse
                    </label>
                  </>
                )}
                <input
                  id="gallery-upload"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.currentTarget.files);
                    // If already have images, append new ones
                    if (
                      formik.values.images &&
                      Array.isArray(formik.values.images)
                    ) {
                      formik.setFieldValue("images", [
                        ...formik.values.images,
                        ...files,
                      ]);
                    } else {
                      formik.setFieldValue("images", files);
                    }
                  }}
                  className="hidden"
                />
              </div>
              {formik.touched.images && formik.errors.images && (
                <p className="text-red-500 text-sm">{formik.errors.images}</p>
              )}
            </div>
            {/* Active Toggle */}
            <div>
              <label className="font-bold">Active</label>
              <input
                type="checkbox"
                name="isActive"
                checked={formik.values.isActive}
                onChange={(e) =>
                  formik.setFieldValue("isActive", e.target.checked)
                }
                className="ml-2"
              />
            </div>
            {/* Platforms Section */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2 text-brown">Platforms</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {/* Windows */}
                <div className="border border-brown rounded p-3">
                  <label className="font-bold">
                    <input
                      type="checkbox"
                      checked={formik.values.platforms.windows.available}
                      onChange={(e) =>
                        formik.setFieldValue("platforms", {
                          ...formik.values.platforms,
                          windows: {
                            ...formik.values.platforms.windows,
                            available: e.target.checked,
                          },
                        })
                      }
                      className="m-2 "
                    />
                    Windows
                  </label>
                  <div>
                    {formik.values.platforms.windows.available && (
                      <div className="space-y-2 mt-2">
                        <input
                          type="number"
                          placeholder="Price"
                          value={formik.values.platforms.windows.price}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                price: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="Size"
                          value={formik.values.platforms.windows.size}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                size: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="OS Version"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .os
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  os: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="Processor"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .processor
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  processor: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="Memory"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .memory
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  memory: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="Graphics"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .graphics
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  graphics: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="Storage"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .storage
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  storage: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="file"
                          accept=".exe,.zip,.rar"
                          onChange={(e) =>
                            formik.setFieldValue(
                              "windows_file",
                              e.currentTarget.files[0]
                            )
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* iOS */}
                <div className="border border-brown rounded p-3 ">
                  <label className="font-bold">
                    <input
                      type="checkbox"
                      checked={formik.values.platforms.ios.available}
                      onChange={(e) =>
                        formik.setFieldValue("platforms", {
                          ...formik.values.platforms,
                          ios: {
                            ...formik.values.platforms.ios,
                            available: e.target.checked,
                          },
                        })
                      }
                      className="m-2"
                    />
                    iOS
                  </label>
                  <div>
                    {formik.values.platforms.ios.available && (
                      <div className="space-y-2 mt-2">
                        <input
                          type="number"
                          placeholder="Price"
                          value={formik.values.platforms.ios.price}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              ios: {
                                ...formik.values.platforms.ios,
                                price: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="Size"
                          value={formik.values.platforms.ios.size}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              ios: {
                                ...formik.values.platforms.ios,
                                size: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="iOS Version"
                          value={
                            formik.values.platforms.ios.system_requirements
                              .ios_version
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              ios: {
                                ...formik.values.platforms.ios,
                                system_requirements: {
                                  ...formik.values.platforms.ios
                                    .system_requirements,
                                  ios_version: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {/* <input
                          type="text"
                          placeholder="Device Compatibility"
                          value={
                            formik.values.platforms.ios.system_requirements
                              .device_compatibility
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              ios: {
                                ...formik.values.platforms.ios,
                                system_requirements: {
                                  ...formik.values.platforms.ios
                                    .system_requirements,
                                  device_compatibility: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        /> */}
                        <input
                          type="file"
                          accept=".ipa"
                          onChange={(e) =>
                            formik.setFieldValue(
                              "ios_file",
                              e.currentTarget.files[0]
                            )
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* Android */}
                <div className="border border-brown rounded p-3">
                  <label className="font-bold">
                    <input
                      type="checkbox"
                      checked={formik.values.platforms.android.available}
                      onChange={(e) =>
                        formik.setFieldValue("platforms", {
                          ...formik.values.platforms,
                          android: {
                            ...formik.values.platforms.android,
                            available: e.target.checked,
                          },
                        })
                      }
                      className="m-2"
                    />
                    Android
                  </label>
                  <div>
                    {formik.values.platforms.android.available && (
                      <div className="space-y-2 mt-2">
                        <input
                          type="number"
                          placeholder="Price"
                          value={formik.values.platforms.android.price}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              android: {
                                ...formik.values.platforms.android,
                                price: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="Size"
                          value={formik.values.platforms.android.size}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              android: {
                                ...formik.values.platforms.android,
                                size: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        <input
                          type="text"
                          placeholder="Android Version"
                          value={
                            formik.values.platforms.android.system_requirements
                              .android_version
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              android: {
                                ...formik.values.platforms.android,
                                system_requirements: {
                                  ...formik.values.platforms.android
                                    .system_requirements,
                                  android_version: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {/* <input
                          type="text"
                          placeholder="Device Compatibility"
                          value={
                            formik.values.platforms.android.system_requirements
                              .device_compatibility
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              android: {
                                ...formik.values.platforms.android,
                                system_requirements: {
                                  ...formik.values.platforms.android
                                    .system_requirements,
                                  device_compatibility: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        /> */}
                        <input
                          type="file"
                          accept=".apk"
                          onChange={(e) =>
                            formik.setFieldValue(
                              "android_file",
                              e.currentTarget.files[0]
                            )
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Submit/Cancel */}
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
                {loading ? "Processing..." : gameData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Delete Game Modal */}
      <Modal open={delOpen} onClose={handleDeleteClose}>
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">Delete Game</p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete "{gameData?.title}"?
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
                onClick={handleDeleteGame}
                disabled={loading}
                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

import { Box, Modal, Pagination, useMediaQuery } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState, useRef } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  uploadVideo,
} from "../Redux/Slice/movies.slice";
import { getAllCategories } from "../Redux/Slice/category.slice";
import { getAllstarring } from "../Redux/Slice/actor.slice";
import { FaEye } from "react-icons/fa";

export default function Movies() {
  const [movieData, setMovieData] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [delAllOpen, setDelAllOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const [createopen, setCreateopen] = useState(false);
  const movies = useSelector((state) => state.movie.allMovies);
  const categories = useSelector((state) => state.category.categories);
  const actors = useSelector((state) => state.actor.starring);
  const loading = useSelector((state) => state.movie.loading);
  const isSmallScreen = useMediaQuery("(max-width:425px)");

  const [error, setError] = useState("");
  const [isImageChanged, setIsImageChanged] = useState(false);
  const thumbnailInputRef = useRef(null);
  const posterInputRef = useRef(null);
  const nameImageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  const validationSchema = Yup.object({
    title: Yup.string().required("Movie title is required"),
    description: Yup.string().required("Movie description is required"),
    category: Yup.string().required("Category is required"),
    type: Yup.string().required("Type is required"),
    languages: Yup.string().required("At least one language is required"),
    genre: Yup.string().required("Genre is required"),
    director: Yup.string().required("Director is required"),
    releaseYear: Yup.number()
      .min(1900, "Release year must be after 1900")
      .max(
        new Date().getFullYear() + 1,
        "Release year cannot be in the future"
      ),
    thumbnail: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, must be 5MB or less",
        function (value) {
          if (!value) return true;
          if (typeof value === "string") return true;
          return value.size <= 5 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", function (value) {
        if (!value) return true;
        if (typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          value.type
        );
      }),
    poster: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, must be 5MB or less",
        function (value) {
          if (!value) return true;
          if (typeof value === "string") return true;
          return value.size <= 5 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", function (value) {
        if (!value) return true;
        if (typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          value.type
        );
      }),
    nameImage: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, must be 5MB or less",
        function (value) {
          if (!value) return true;
          if (typeof value === "string") return true;
          return value.size <= 5 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", function (value) {
        if (!value) return true;
        if (typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          value.type
        );
      }),
    video: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, must be 500MB or less",
        function (value) {
          if (!value) return true;
          if (typeof value === "string") return true;
          return value.size <= 500 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", function (value) {
        if (!value) return true;
        if (typeof value === "string") return true;
        return ["video/mp4", "video/avi", "video/mov", "video/wmv", "video/mkv", "video/x-matroska"].includes(
          value.type
        );
      }),
    isPremium: Yup.boolean()
      .required("Premium status is required"),
    contentRating: Yup.string().required("Content Rating is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      type: "",
      languages: "",
      genre: "",
      director: "",
      releaseYear: "",
      contentDescriptor: "",
      long_description: "",
      thumbnail: null,
      poster: null,
      nameImage: null,
      video: null,
      starring: [],
      isPremium: true,
      contentRating: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("type", values.type);
      formData.append("languages", values.languages);
      formData.append("genre", values.genre);
      formData.append("director", values.director);
      formData.append("releaseYear", values.releaseYear);
      formData.append("contentDescriptor", values.contentDescriptor);
      formData.append("long_description", values.long_description);
      formData.append("contentRating", values.contentRating);

      if (values.thumbnail && typeof values.thumbnail !== "string") {
        formData.append("thumbnail", values.thumbnail);
      }
      if (values.poster && typeof values.poster !== "string") {
        formData.append("poster", values.poster);
      }
      if (values.nameImage && typeof values.nameImage !== "string") {
        formData.append("nameImage", values.nameImage);
      }

      const starringData = [];
      selectedStarrings.forEach((star) => {
        if (star.isNew && star.image) {
          formData.append("starring_image", star.image);
          starringData.push({
            ...star,
          });
        } else {
          starringData.push(star);
        }
      });
      formData.append("starring", JSON.stringify(starringData));
      formData.append("isPremium", values.isPremium ? "true" : "false");

      if (movieData) {

        const updateResult = await dispatch(updateMovie({ id: movieData._id, formData }));

        // If video is selected, upload it separately
        if (values.video && typeof values.video !== "string") {
          const formData = new FormData();
          formData.append("video", values.video);
          formData.append("uploadType", "video");
          handleCreateClose();
          await dispatch(uploadVideo({
            movieId: movieData._id,
            formData,
            // onProgress: (progress) => {
            //   dispatch(setUploadProgress(progress));
            // }
          }));
        }
      } else {
        // Create movie without video first
        const createResult = await dispatch(createMovie(formData));



        // If video is selected and movie was created successfully, upload video
        if (values.video && typeof values.video !== "string" && createResult.payload?.data?.movie?._id) {
          const videoFormData = new FormData();
          videoFormData.append("video", values.video);
          videoFormData.append("uploadType", "video");
          handleCreateClose();
          await dispatch(uploadVideo({
            movieId: createResult.payload.data.movie._id,
            formData: videoFormData,
            // onProgress: (progress) => {
            //   dispatch(setUploadProgress(progress));
            // }
          }));
        }
      }
      handleCreateClose();
      // Reset upload state
      // dispatch(resetUploadState());

    },
  });

  useEffect(() => {
    dispatch(getAllMovies());
    dispatch(getAllCategories());
    dispatch(getAllstarring());
  }, [dispatch]);

  // Search functionality
  const filteredData = movies.filter(
    (data) =>
      data?.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      data?.genre?.toLowerCase().includes(searchValue.toLowerCase()) ||
      data?.director?.toLowerCase().includes(searchValue.toLowerCase())
  );

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

  const getActorsForMovie = (movieId) => {
    return actors.filter(
      (actor) =>
        Array.isArray(actor.moviesId) &&
        actor.moviesId.some((id) => id === movieId || id?._id === movieId)
    );
  };

  const handleOpen = (data) => {
    setCreateopen(true);
    setMovieData(data);
    if (data) {
      const starringActors = getActorsForMovie(data._id);
      formik.setValues({
        title: data.title,
        description: data.description,
        category: data.category?._id || data.category,
        type: data.type,
        languages: Array.isArray(data.languages)
          ? data.languages.join(",")
          : [],
        genre: data.genre,
        director: data.director,
        releaseYear: data.releaseYear,
        contentDescriptor: data.contentDescriptor,
        long_description: data.long_description,
        thumbnail: data.thumbnail?.url || null,
        poster: data.poster?.url || null,
        nameImage: data.nameImage?.url || null,
        video: data.video?.url || null,
        isPremium: data?.isPremium,
        contentRating: data?.contentRating,
        // starring: data.starring || []
      });
      setSelectedStarrings(starringActors || []);
    }
  };

  const handleDeleteOpen = (data) => {
    setDelOpen(true);
    setMovieData(data);
  };

  const handleDeleteClose = () => {
    setDelOpen(false);
  };

  const handleDeleteMovie = () => {
    dispatch(deleteMovie(movieData._id));
    setDelOpen(false);
  };

  const handleDeleteAll = () => {
    // Implement delete all functionality if needed
    console.log("Delete All Movies");
  };

  const handleCreateClose = () => {
    setCreateopen(false);
    setMovieData("");
    formik.resetForm();
    setIsImageChanged(false);
    setSelectedStarrings([]);
  };

  const [starringSearch, setStarringSearch] = useState("");
  const [starringOptions, setStarringOptions] = useState([]);
  const [selectedStarrings, setSelectedStarrings] = useState([]);
  const [newStarring, setNewStarring] = useState({ name: "", image: null });
  const [showAddNewStarring, setShowAddNewStarring] = useState(false);

  useEffect(() => {
    if (starringSearch.trim() === "") {
      setStarringOptions([]);
      return;
    }

    const filteredActors = actors.filter((actor) =>
      actor.name.toLowerCase().includes(starringSearch.toLowerCase())
    );
    setStarringOptions(filteredActors);
  }, [starringSearch]);

  // Add starring to selected
  const handleAddStarring = (star) => {
    if (!selectedStarrings.some((s) => s._id === star._id)) {
      setSelectedStarrings([...selectedStarrings, star]);
    }
    setStarringSearch("");
    setStarringOptions([]);
  };

  // Remove starring
  const handleRemoveStarring = (id, name) => {
    // console.log(selectedStarrings, id, name);
    setSelectedStarrings(
      selectedStarrings.filter((s) => (id ? s._id !== id : s.name !== name))
    );
  };

  // Add new starring
  const handleAddNewStarring = () => {
    if (newStarring.name && newStarring.image) {
      setSelectedStarrings([
        ...selectedStarrings,
        { ...newStarring, isNew: true },
      ]);
      setNewStarring({ name: "", image: null });
      setStarringSearch("");
    }
  };

  const handleView = (details) => {
    setMovieData(details);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMovieData(null);
  };

  return (
    <div className="container p-5 md:p-10 bg-[#141414]">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-brown mb-2">Movies</h1>
        </div>
        <div></div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 w-full flex justify-content-between ">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search Movies... "
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="rounded w-full md:w-64 p-2 bg-white/10"
          />
        </div>

        <div className="flex gap-4">
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
            className="bg-primary-light/15 w-20 sm:w-20 md600:w-32 text-white px-4 py-2 rounded"
            onClick={() => setCreateopen(true)}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="overflow-auto shadow mt-5 rounded scrollbar-hide">
        <table className="w-full bg-white/5">
          <thead>
            <tr className="text-brown font-bold">
              <td className="py-2 px-5 w-1/8">Thumbnail</td>
              <td className="py-2 px-5 w-1/3">Title</td>
              <td className="py-2 px-5 w-1/6">Category</td>
              <td className="py-2 px-5 w-1/6">Type</td>
              <td className="py-2 px-5 w-1/6">Duration</td>
              <td className="py-2 px-5 w-1/6 text-center">Release Year</td>
              <td className="py-2 px-5 w-1/6 text-end">Action</td>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((movie) => (
              <tr
                key={movie._id}
                className="border-t border-gray-950"
              >
                <td className="py-2 px-5">
                  <img
                    src={movie.thumbnail?.url}
                    alt={movie.title}
                    className="w-16 h-12 rounded object-cover"
                  // onError={(e) => {
                  //   e.target.src =
                  //     "https://via.placeholder.com/64x48?text=No+Image";
                  // }}
                  />
                </td>
                <td className="py-2 px-5">
                  <div>
                    <div className="font-semibold">{movie.title}</div>
                    <div className="text-sm text-gray-400 line-clamp-1">{movie.genre}</div>
                  </div>
                </td>
                <td className="py-2 px-5">
                  {movie.category?.categoryName || "N/A"}
                </td>
                <td className="py-2 px-5 ">
                  <span
                    className={`px-2 py-1 text-center block w-20 rounded text-xs ${movie.type === "movie" ? "bg-blue-500" : "bg-green-500"
                      }`}
                  >
                    {movie.type.charAt(0).toUpperCase() + movie.type.slice(1)}
                  </span>
                </td>
                <td className="py-2 px-5">
                  {(() => {
                    const totalSeconds = Number(movie.duration) || 0;
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    let result = "";
                    if (hours > 0) result += `${hours}h `;
                    if (minutes > 0 || hours > 0) result += `${minutes} m`;
                    return result.trim();
                  })()}
                </td>
                <td className="py-2 px-5 text-center">
                  {movie.releaseYear || "N/A"}
                </td>
                <td className="py-2 px-5 flex justify-end gap-2">
                  <div>
                    <button
                      className="text-white/50 text-xl p-1 border border-brown-50  transition-colors rounded hover:text-white"
                      onClick={() => handleView(movie)}
                    >
                      <FaEye />
                    </button>
                  </div>
                  <div>
                    <button
                      className="text-green-700 text-xl p-1 border border-brown-50  transition-colors rounded hover:text-green-800"
                      onClick={() => handleOpen(movie)}
                    >
                      <RiEdit2Fill />
                    </button>
                  </div>
                  <div>
                    <button
                      className="text-red-500 text-xl p-1 border border-brown-50  transition-colors rounded hover:text-red-600"
                      onClick={() => handleDeleteOpen(movie)}
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

      {/* Create & Update Movie Modal */}
      <Modal open={createopen} onClose={handleCreateClose}>
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[800px] w-[100%] max-h-[90vh] overflow-y-auto scrollbar-hide">
          <form onSubmit={formik.handleSubmit} className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">
                {movieData ? "Edit" : "Add"} Movie
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="font-bold">Movie Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Movie Title"
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
                <label className="font-bold">Category</label>
                <select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded w-full p-2 mt-1 bg-white/5"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
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
                <label className="font-bold">Type</label>
                <select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded w-full p-2 mt-1 bg-white/5"
                >
                  <option value="">Select Type</option>
                  <option value="movie">Movie</option>
                  <option value="webseries">Web Series</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <p className="text-red-500 text-sm">{formik.errors.type}</p>
                )}
              </div>

              <div>
                <label className="font-bold">Genre</label>
                <input
                  type="text"
                  name="genre"
                  placeholder="Enter Genre"
                  value={formik.values.genre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded w-full p-2 mt-1 bg-white/5"
                />
                {formik.touched.genre && formik.errors.genre && (
                  <p className="text-red-500 text-sm">{formik.errors.genre}</p>
                )}
              </div>

              <div>
                <label className="font-bold">Director</label>
                <input
                  type="text"
                  name="director"
                  placeholder="Enter Director"
                  value={formik.values.director}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded w-full p-2 mt-1 bg-white/5"
                />
                {formik.touched.director && formik.errors.director && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.director}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold">Release Year</label>
                <input
                  type="number"
                  name="releaseYear"
                  placeholder="Enter Release Year"
                  value={formik.values.releaseYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="j_clock_icon rounded w-full p-2 mt-1 bg-white/5"
                />
                {formik.touched.releaseYear && formik.errors.releaseYear && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.releaseYear}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold">Languages</label>
                <input
                  type="text"
                  name="languages"
                  placeholder="Enter languages (comma separated)"
                  value={formik.values.languages}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // onChange={(e) => {
                  //   const languages = e.target.value
                  //     .split(",")
                  //     .map((lang) => lang.trim())
                  //     .filter((lang) => lang);
                  //   formik.setFieldValue("languages", languages);
                  // }}
                  // onBlur={formik.handleBlur}
                  className="rounded w-full p-2 mt-1 bg-white/5"
                />
                {formik.touched.languages && formik.errors.languages && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.languages}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold">Content Descriptor</label>
                <input
                  type="text"
                  name="contentDescriptor"
                  placeholder="Enter Content Descriptor"
                  value={formik.values.contentDescriptor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded w-full p-2 mt-1 bg-white/5"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="font-bold">Description</label>
              <textarea
                name="description"
                placeholder="Enter Movie Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="3"
                className="bg-white/5 rounded w-full p-2 mt-1 resize-none"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="font-bold">Long Description</label>
              <textarea
                name="long_description"
                placeholder="Enter Long Description"
                value={formik.values.long_description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="3"
                className="bg-white/5 rounded w-full p-2 mt-1 resize-none"
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Thumbnail */}
              <div>
                <label className="font-bold">Thumbnail</label>
                <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                  {formik.values.thumbnail ? (
                    <>
                      <div className="flex items-center bg-[#72727226] px-2 py-1">
                        <img
                          src={
                            typeof formik.values.thumbnail === "string"
                              ? formik.values.thumbnail
                              : URL.createObjectURL(formik.values.thumbnail)
                          }
                          alt="Preview"
                          className="w-8 h-8 rounded mr-2 object-cover"
                        />
                        <span className="flex-1 max-w-8 md:max-w-48 truncate">
                          {typeof formik.values.thumbnail === "string"
                            ? formik.values.thumbnail.split("/").pop()
                            : formik.values.thumbnail.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("thumbnail", null);
                          }}
                          className="text-red-500 ml-1 text-[12px]"
                        >
                          X
                        </button>
                      </div>
                      <label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                      >
                        Change
                      </label>
                    </>
                  ) : (
                    <>
                      <p className="flex-1 text-[16px] text-[#727272]">
                        Choose Thumbnail
                      </p>
                      <label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                      >
                        Browse
                      </label>
                    </>
                  )}
                  <input
                    id="thumbnail-upload"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    ref={thumbnailInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("thumbnail", file);
                    }}
                    className="hidden"
                  />
                </div>
                {formik.touched.thumbnail && formik.errors.thumbnail && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.thumbnail}
                  </p>
                )}
              </div>

              {/* Poster */}
              <div>
                <label className="font-bold">Poster</label>
                <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                  {formik.values.poster ? (
                    <>
                      <div className="flex items-center bg-[#72727226] px-2 py-1">
                        <img
                          src={
                            typeof formik.values.poster === "string"
                              ? formik.values.poster
                              : URL.createObjectURL(formik.values.poster)
                          }
                          alt="Preview"
                          className="w-8 h-8 rounded mr-2 object-cover"
                        />
                        <span className="flex-1 max-w-8 md:max-w-48 truncate">
                          {typeof formik.values.poster === "string"
                            ? formik.values.poster.split("/").pop()
                            : formik.values.poster.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("poster", null);
                          }}
                          className="text-red-500 ml-1 text-[12px]"
                        >
                          X
                        </button>
                      </div>
                      <label
                        htmlFor="poster-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                      >
                        Change
                      </label>
                    </>
                  ) : (
                    <>
                      <p className="flex-1 text-[16px] text-[#727272]">
                        Choose Poster
                      </p>
                      <label
                        htmlFor="poster-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                      >
                        Browse
                      </label>
                    </>
                  )}
                  <input
                    id="poster-upload"
                    name="poster"
                    type="file"
                    accept="image/*"
                    ref={posterInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("poster", file);
                    }}
                    className="hidden"
                  />
                </div>
                {formik.touched.poster && formik.errors.poster && (
                  <p className="text-red-500 text-sm">{formik.errors.poster}</p>
                )}
              </div>

              {/* Name Image */}
              <div>
                <label className="font-bold">Name Image</label>
                <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                  {formik.values.nameImage ? (
                    <>
                      <div className="flex items-center bg-[#72727226] px-2 py-1">
                        <img
                          src={
                            typeof formik.values.nameImage === "string"
                              ? formik.values.nameImage
                              : URL.createObjectURL(formik.values.nameImage)
                          }
                          alt="Preview"
                          className="w-8 h-8 rounded mr-2 object-cover"
                        />
                        <span className="flex-1 max-w-8 md:max-w-48 truncate">
                          {typeof formik.values.nameImage === "string"
                            ? formik.values.nameImage.split("/").pop()
                            : formik.values.nameImage.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("nameImage", null);
                          }}
                          className="text-red-500 ml-1 text-[12px]"
                        >
                          X
                        </button>
                      </div>
                      <label
                        htmlFor="nameImage-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                      >
                        Change
                      </label>
                    </>
                  ) : (
                    <>
                      <p className="flex-1 text-[16px] text-[#727272]">
                        Choose Name Image
                      </p>
                      <label
                        htmlFor="nameImage-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                      >
                        Browse
                      </label>
                    </>
                  )}
                  <input
                    id="nameImage-upload"
                    name="nameImage"
                    type="file"
                    accept="image/*"
                    ref={nameImageInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("nameImage", file);
                    }}
                    className="hidden"
                  />
                </div>
                {formik.touched.nameImage && formik.errors.nameImage && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.nameImage}
                  </p>
                )}
              </div>

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
                    ref={videoInputRef}
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

            <div className="mt-4">
              <label className="font-bold">Starring</label>
              <div className="flex flex-wrap gap-4 mt-1">
                <input
                  type="text"
                  placeholder="Search or add starring..."
                  value={starringSearch}
                  onChange={(e) => setStarringSearch(e.target.value)}
                  className="rounded grow p-2 bg-white/5"
                />
                <button
                  type="button"
                  onClick={() => setShowAddNewStarring((prev) => !prev)}
                  className="bg-brown text-white border-brown border px-2 py-1 rounded hover:bg-brown-50 disabled:opacity-50"
                >
                  {showAddNewStarring ? "Cancel" : "Add New Starring"}
                </button>
              </div>
              {/* Show dropdown */}
              {starringOptions.length > 0 && (
                <div className="bg-black text-white rounded shadow mt-1 max-h-40 overflow-auto">
                  {starringOptions.map((star) => (
                    <div
                      key={star._id}
                      className="flex items-center p-2 cursor-pointer hover:bg-white/10"
                      onClick={() => handleAddStarring(star)}
                    >
                      <img
                        src={star.starring_image?.url}
                        alt=""
                        className="w-6 h-6 rounded mr-2"
                      />
                      <span>{star.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* If not found, allow new */}
              {showAddNewStarring && (
                <div className="mt-2 w-full flex gap-4 justify-between flex-wrap ">
                  <input
                    type="text"
                    value={newStarring.name}
                    onChange={(e) =>
                      setNewStarring({ ...newStarring, name: e.target.value })
                    }
                    placeholder="New starring name"
                    className="rounded  w-1/3 p-2 bg-white/5"
                  />
                  <div className="grow">
                    <div className="flex grow justify-between items-center border border-brown rounded w-full p-2">
                      {newStarring.image ? (
                        <>
                          <div className="flex w-40 items-center bg-[#72727226] px-2 py-1">
                            <img
                              src={URL.createObjectURL(newStarring.image)}
                              alt="Preview"
                              className="w-8 h-8 rounded mr-2 object-cover"
                            />
                            <span className="flex-1 w-8  md:w-auto truncate">
                              {newStarring.image.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewStarring({ ...newStarring, image: null });
                              }}
                              className="text-red-500 ml-1 text-[12px]"
                            >
                              X
                            </button>
                          </div>
                          <label
                            htmlFor="starring-image-upload"
                            className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                          >
                            Change
                          </label>
                        </>
                      ) : (
                        <>
                          <p className="flex-1 text-[16px] text-[#727272]">
                            Choose image
                          </p>
                          <label
                            htmlFor="starring-image-upload"
                            className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                          >
                            Browse
                          </label>
                        </>
                      )}
                      <input
                        id="starring-image-upload"
                        name="starringImage"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setNewStarring({ ...newStarring, image: file });
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewStarring}
                    className="bg-brown text-white text-4xl border-brown border px-3 py-1 rounded hover:bg-brown-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              )}
              {/* Show selected starrings */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedStarrings.map((star) => (
                  <div
                    key={star._id || star.name}
                    className="flex items-center bg-gray-700 rounded px-2 py-1"
                  >
                    {star.starring_image?.url && (
                      <img
                        src={star.starring_image.url}
                        alt=""
                        className="w-6 h-6 rounded mr-1"
                      />
                    )}
                    <span>{star.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStarring(star._id, star.name)}
                      className="ml-2 text-red-400"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="font-bold mb-2">Premium</label>
              <div className="flex items-center gap-6">
                {[true, false].map((option) => (
                  <label
                    key={option.toString()}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="isPremium"
                      value={option}
                      checked={formik.values.isPremium === option}
                      onChange={() => {
                        formik.setFieldValue("isPremium", option);
                      }}
                      className="hidden"
                    />
                    <div className="relative w-5 h-5">
                      {/* Gradient border container */}
                      <div
                        className={`absolute inset-0 rounded-full p-0.5 transition-all duration-200 ${formik.values.isPremium === option
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                          : "bg-gray-400"
                          }`}
                      >
                        {/* Inner black circle */}
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                          {/* Center gradient dot - shows when checked */}
                          {formik.values.isPremium === option && (
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 capitalize">
                      {option.toString()}
                    </span>
                  </label>
                ))}
              </div>
              {formik.errors.isPremium && formik.touched.isPremium && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.isPremium}
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="font-bold">Content Rating (U/A)</label>
              <select
                name="contentRating"
                value={formik.values.contentRating}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="rounded w-full p-2 mt-1 bg-white/5"
              >
                <option value="">Select Content Rating (U/A)</option>
                <option value="U">U – Universal (All Ages)</option>
                <option value="U/A 7+">U/A 7+ – Suitable for 7 years and above</option>
                <option value="U/A 13+">U/A 13+ – Suitable for 13 years and above</option>
                <option value="U/A 16+">U/A 16+ – Suitable for 16 years and above</option>
                <option value="A">A – Adults Only (18+)</option>
              </select>
              {formik.touched.contentRating && formik.errors.contentRating && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.contentRating}
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
                {loading ? <CircularProgress color="inherit" size="20px" /> : movieData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Delete Movie Modal */}
      <Modal open={delOpen} onClose={handleDeleteClose}>
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">Delete Movie</p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete "{movieData?.title}"?
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
                onClick={handleDeleteMovie}
                disabled={loading}
                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Delete All Movies Modal */}
      <Modal open={delAllOpen} onClose={() => setDelAllOpen(false)}>
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">Delete All Movies</p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete all movies? This action cannot
                be undone.
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

      {/* view Movie Modal */}
      <Modal open={openDialog} onClose={handleCloseDialog}>
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[800px] w-[95%] max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="p-5">
            <div className="text-center mb-6">
              <p className="text-brown font-bold text-xl">{movieData?.title} Movie Details</p>
            </div>

            {/* Movie Images Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="font-bold mb-2">Thumbnail</p>
                <img
                  src={movieData?.thumbnail?.url}
                  alt="Thumbnail"
                  className="w-full h-32 object-contain rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200x128?text=No+Image";
                  }}
                />
              </div>
              <div className="text-center">
                <p className="font-bold mb-2">Poster</p>
                <img
                  src={movieData?.poster?.url}
                  alt="Poster"
                  className="w-full h-32 object-contain rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200x128?text=No+Image";
                  }}
                />
              </div>
              <div className="text-center">
                <p className="font-bold mb-2">Name Image</p>
                <img
                  src={movieData?.nameImage?.url}
                  alt="Name Image"
                  className="w-full h-32 object-contain rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200x128?text=No+Image";
                  }}
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-bold text-brown">Title</p>
                <p className="text-gray-300">{movieData?.title || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-brown">Category</p>
                <p className="text-gray-300">{movieData?.category?.categoryName || movieData?.category || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-brown">Type</p>
                <p className="text-gray-300 capitalize">{movieData?.type || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-brown">Genre</p>
                <p className="text-gray-300">{movieData?.genre || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-brown">Director</p>
                <p className="text-gray-300">{movieData?.director || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-brown">Release Year</p>
                <p className="text-gray-300">{movieData?.releaseYear || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-brown">Languages</p>
                <p className="text-gray-300">
                  {Array.isArray(movieData?.languages)
                    ? movieData.languages.join(", ")
                    : movieData?.languages || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-bold text-brown">Content Descriptor</p>
                <p className="text-gray-300">{movieData?.contentDescriptor || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-brown">Duration</p>
                <p className="text-gray-300">
                  {(() => {
                    const totalSeconds = Number(movieData?.duration) || 0;
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    let result = "";
                    if (hours > 0) result += `${hours}h `;
                    if (minutes > 0 || hours > 0) result += `${minutes}m`;
                    return result.trim() || "N/A";
                  })()}
                </p>
              </div>
              <div>
                <p className="font-bold text-brown">Premium</p>
                <p className="text-white">
                  <span className={`px-2 py-1 rounded text-xs ${movieData?.isPremium ? "bg-green-500" : "bg-gray-500"}`}>
                    {movieData?.isPremium ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>

            {/* Descriptions */}
            <div className="mb-6">
              <div className="mb-4">
                <p className="font-bold text-brown mb-2">Description</p>
                <p className="text-gray-300">
                  {movieData?.description || "No description available"}
                </p>
              </div>
              {movieData?.long_description && (
                <div>
                  <p className="font-bold text-brown mb-2">Long Description</p>
                  <p className="text-gray-300">
                    {movieData.long_description}
                  </p>
                </div>
              )}
            </div>

            {/* Starring/Cast */}
            {movieData && (
              <div className="mb-6">
                <p className="font-bold text-brown mb-3">Cast & Crew</p>
                <div className="flex flex-wrap gap-2">
                  {getActorsForMovie(movieData._id).map((actor) => (
                    <div key={actor._id} className="flex items-center">
                      {actor.starring_image?.url && (
                        <img
                          src={actor.starring_image.url}
                          alt={actor.name}
                          className="w-8 h-8 rounded mr-2 object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/32x32?text=No+Image";
                          }}
                        />
                      )}
                      <span className="text-sm">{actor.name}</span>
                    </div>
                  ))}
                  {getActorsForMovie(movieData._id)?.length === 0 && (
                    <p className="text-gray-400 text-sm">No cast information available</p>
                  )}
                </div>
              </div>
            )}

            {/* Video Information */}
            <div className="mb-6">
              <p className="font-bold text-brown mb-2">Video</p>
              <p className="text-gray-300 text-sm break-all">
                {movieData?.video?.url}
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseDialog}
                className="text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div >
  );
}

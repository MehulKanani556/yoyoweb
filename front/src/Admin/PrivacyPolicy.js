import { Box, Modal, Pagination, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Fill, RiEdit2Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createPrivacy, deletePrivacy, getAllPrivacy, updatePrivacy } from '../Redux/Slice/PrivacyPolicy.slice';

export default function PrivacyPolicy() {
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const TermCondition = useSelector(state => state.policy.Privacy);
    const loading = useSelector(state => state.category.loading);
    const isSmallScreen = useMediaQuery("(max-width:425px)");
    const [createopen, setCreateopen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [delAllOpen, setDelAllOpen] = useState(false);
    const [privacyData, setprivacyData] = useState("");

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (privacyData) {
                // Update privacy
                dispatch(updatePrivacy({ _id: privacyData._id, values }));
            } else {
                // Create privacy
                dispatch(createPrivacy(values));
            }
            handleCreateClose();
        },
    });

    // React Quill configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'blockquote', 'code-block'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'color', 'background',
        'align', 'script', 'code-block'
    ];

    useEffect(() => {
        dispatch(getAllPrivacy())
    }, [dispatch])

    // Search functionality - updated to handle HTML content
    const filteredData = TermCondition.filter(data => {
        const titleMatch = data?.title?.toLowerCase().includes(searchValue.toLowerCase());
        // Strip HTML tags for search
        const descriptionText = data?.description?.replace(/<[^>]*>/g, '')?.toLowerCase();
        const descriptionMatch = descriptionText?.includes(searchValue?.toLowerCase());
        return titleMatch || descriptionMatch;
    });

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
        setprivacyData(data);
        if (data) {
            formik.setValues({
                title: data.title,
                description: data.description
            });
        }
    };

    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setprivacyData(data);
    };

    const handleDeleteClose = () => {
        setDelOpen(false);
    };

    const handleDeleteCategory = () => {
        dispatch(deletePrivacy({ _id: privacyData._id }));
        setDelOpen(false);
    };

    const handleDeleteAll = () => {
        console.log("Delete All Categories");
    };

    const handleCreateClose = () => {
        setCreateopen(false);
        setprivacyData("");
        formik.resetForm();
    };

    return (
        <div className="container p-5 md:p-10 bg-[#141414]">
            <div className="flex flex-col md600:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown">Privacy Policy</h1>
                    {/* <p className="text-brown-50">
                        <Link to="/dashboard">Dashboard</Link> / <span className="text-brown font-medium">Category</span>
                    </p> */}
                </div>
                <div>
                    <div className="flex gap-4 mb-4">
                        {/* <button
                            className="bg-primary-light/15 px-4 py-2 rounded flex justify-center items-center gap-2"
                            onClick={() => setDelAllOpen(true)}
                        >
                            <span>
                                <RiDeleteBin6Fill />
                            </span>
                            <span>Delete All</span>
                        </button> */}
                        <button
                            className="bg-primary-light/15 text-white px-4 py-2 rounded "
                            onClick={() => setCreateopen(true)}
                        >
                            + Add Privacy
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Privacy ..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="rounded w-full md:w-64 p-2 bg-white/10"
                />
            </div>

            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white/5">
                    <thead>
                        <tr className="text-brown font-bold">
                            {/* <td className="py-2 px-5 w-1/6">ID</td> */}
                            <td className="py-2 px-5 w-1/6">Title</td>
                            <td className="py-2 px-5 w-1/2">Description</td>
                            <td className="py-2 px-5 w-1/6">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((term, index) => (
                            <tr key={term._id} className="border-t border-gray-950">
                                <td className="py-2 px-5 w-1/6">
                                    <span className="truncate block max-w-xs">
                                        {term.title}
                                    </span>
                                </td>
                                <td className="py-2 px-5 w-1/2">
                                    {/* <span className="block">
                                        {truncateHTML(term.description)}
                                    </span> */}
                                    <div dangerouslySetInnerHTML={{ __html: term.description }} className='w-[700px]' />
                                </td>
                                <td className="w-1/1 flex justify-start items-center gap-2 mt-2">
                                    <div>
                                        <button
                                            className="text-green-700 text-xl p-1 border border-brown-50 rounded"
                                            onClick={() => handleOpen(term)}
                                        >
                                            <RiEdit2Fill />
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="text-red-500 text-xl p-1 border border-brown-50 rounded"
                                            onClick={() => handleDeleteOpen(term)}
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
            <Modal open={createopen} onClose={handleCreateClose}>
                <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[800px] w-[100%] max-h-[90vh] overflow-y-auto">
                    <form onSubmit={formik.handleSubmit} className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">
                                {privacyData ? "Edit" : "Add"} Privacy Policy
                            </p>
                        </div>

                        <div className="mt-6">
                            <label className="font-bold">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter Title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="rounded w-full p-2 mt-1 bg-white/5 j_input_field"
                            />
                            {formik.touched.title && formik.errors.title && (
                                <p className="text-red-500 text-sm">{formik.errors.title}</p>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="font-bold">Description</label>
                            <div className="mt-1">
                                <ReactQuill
                                    theme="snow"
                                    value={formik.values.description}
                                    onChange={(value) => formik.setFieldValue('description', value)}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Enter description..."
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        borderRadius: '6px',
                                        minHeight: '200px'
                                    }}
                                />
                            </div>
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-red-500 text-sm mt-2">{formik.errors.description}</p>
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
                                {loading ? "Processing..." : (privacyData ? "Update" : "Add")}
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Delete Category Modal */}
            <Modal open={delOpen} onClose={handleDeleteClose}>
                <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%] max-h-[90vh] overflow-y-auto">
                    <div className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">Delete Category</p>
                            <p className="text-brown-50 mt-2">
                                Are you sure you want to delete "{privacyData?.title}"?
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
                <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <div className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">
                                Delete All Categories
                            </p>
                            <p className="text-brown-50 mt-2">
                                Are you sure you want to delete all categories? This action cannot be undone.
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

            {/* Custom styles for React Quill */}
            <style jsx global>{`
                .ql-editor {
                    color: white !important;
                    background-color: rgba(255, 255, 255, 0.05) !important;
                }
                .ql-toolbar {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    border-color: rgba(255, 255, 255, 0.2) !important;
                }
                .ql-toolbar .ql-stroke {
                    stroke: white !important;
                }
                .ql-toolbar .ql-fill {
                    fill: white !important;
                }
                .ql-toolbar .ql-picker-label {
                    color: white !important;
                }
                .ql-toolbar .ql-picker-options {
                    background-color: rgba(0, 0, 0, 0.8) !important;
                }
                .ql-toolbar .ql-picker-item {
                    color: white !important;
                }
                .ql-container {
                    border-color: rgba(255, 255, 255, 0.2) !important;
                }
                .ql-editor::before {
                    color: rgba(255, 255, 255, 0.6) !important;
                }
            `}</style>
        </div>
    )
}

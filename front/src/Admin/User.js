import { Pagination, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Redux/Slice/user.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import { decryptData } from "../Utils/encryption";
export default function User() {
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.allusers);
    const isSmallScreen = useMediaQuery("(max-width:425px)");

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch])

    // Search functionality
    const filteredData = users.filter(data =>
        data?.firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.phoneNo?.toLowerCase().includes(searchValue.toLowerCase())
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

    return (
        <div className="container p-5 md:p-10 bg-[#141414]">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown">User</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search users ..."
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
                            <td className="py-2 px-5">First Name</td>
                            <td className="py-2 px-5">Last Name</td>
                            <td className="py-2 px-5">Email</td>
                            <td className="py-2 px-5">phoneNo</td>
                            <td className="py-2 px-5">Created At</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user, index) => (
                            <tr key={user._id} className="border-t border-gray-950">
                                {/* <td className="py-2 px-5">{user._id}</td> */}
                                <td className="py-2 px-5 flex items-center">
                                    <img
                                        src={user.photo}
                                        alt={decryptData(user.firstName)}
                                        className="w-10 h-10 rounded-full mr-2 object-cover"
                                    // onError={(e) => {
                                    //     e.target.src = "https://via.placeholder.com/40x40?text=No+Image";
                                    // }}
                                    />

                                    {decryptData(user.firstName)}
                                </td>
                                {/* <td className="py-2 px-5">
                                    <span className="truncate block max-w-xs">
                                        {user.firstName}
                                    </span>
                                </td> */}
                                <td className="py-2 px-5">
                                    <span className="truncate block max-w-xs">
                                        {decryptData(user.lastName)}
                                    </span>
                                </td>
                                <td className="py-2 px-5">
                                    <span className="truncate block max-w-xs">
                                        {decryptData(user.email)}
                                    </span>
                                </td>
                                <td className="py-2 px-5">
                                    <span className="truncate block max-w-xs">
                                        {decryptData(user.phoneNo) || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-2 px-5">
                                    {new Date(user.createdAt).toLocaleDateString()}
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
                    className="flex justify-end m-4"
                    siblingCount={0}
                    boundaryCount={isSmallScreen ? 0 : 1}
                    sx={{
                        "& .MuiPaginationItem-root": {
                            color: "white",
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                            backgroundColor: "#0f0f0f",
                            color: "white",
                        },
                        "& .MuiPaginationItem-root:hover": {
                            backgroundColor: "lightgray",
                        },
                    }}
                />
            )}
        </div>
    )
}

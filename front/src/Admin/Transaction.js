import { Pagination, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllpayment } from '../Redux/Slice/Payment.slice';

export default function Transaction() {
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const isSmallScreen = useMediaQuery("(max-width:425px)");
    const transactions = useSelector((state) => state.payment.payment);

    useEffect(() => {
        dispatch(getAllpayment())
    }, [dispatch])

    function formatDuration(days) {
        if (days % 365 === 0) {
            return `${days / 365} year${days / 365 > 1 ? 's' : ''}`;
        } else if (days % 31 === 0) {
            return `${days / 31} month${days / 31 > 1 ? 's' : ''}`;
        } else if (days % 30 === 0) {
            return `${days / 30} month${days / 30 > 1 ? 's' : ''}`;
        } else if (days % 7 === 0) {
            return `${days / 7} week${days / 7 > 1 ? 's' : ''}`;
        } else {
            return `${days} day${days > 1 ? 's' : ''}`;
        }
    };

    // Search functionality
    const filteredData = transactions.filter(data => {
        const duration =
            data.startDate && data.endDate
                ? formatDuration(
                    Math.ceil(
                        (new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24)
                    )
                )
                : "";

        return (
            data?.userData?.[0]?.firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
            data?.userData?.[0]?.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
            data?.userData?.[0]?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
            data?.PlanName?.toLowerCase().includes(searchValue.toLowerCase()) ||
            data?.amount.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
            duration.toLowerCase().includes(searchValue.toLowerCase())
        );
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

    return (
        <div className="container p-5 md:p-10 bg-[#141414]">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown">Transactions</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 mt-2">
                <input
                    type="text"
                    placeholder="Search ..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="rounded w-full md:w-64 p-2 bg-white/10"
                />
            </div>

            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white/5">
                    <thead>
                        <tr className="text-brown font-bold">
                            <td className="py-2 px-5">Name</td>
                            <td className="py-2 px-5">Date</td>
                            <td className="py-2 px-5">Plan</td>
                            <td className="py-2 px-5">Amount</td>
                            <td className="py-2 px-5">Duration</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((transaction, index) => (
                            <tr key={transaction._id} className="border-t border-gray-950">
                                <td className="py-4 px-4">
                                    <div className="flex items-center space-x-3">
                                        {transaction?.userData?.[0]?.photo ? (
                                            <img
                                                src={transaction?.userData?.[0]?.photo}
                                                alt={transaction?.userData?.[0]?.firstName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className='w-8 h-8 rounded-full bg-white/10 uppercase text-xs flex items-center justify-center'>
                                                {`${transaction?.userData?.[0]?.firstName?.[0]}${transaction?.userData?.[0]?.lastName?.[0]}`}
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-white font-medium text-sm">{`${transaction?.userData?.[0]?.firstName} ${transaction?.userData?.[0]?.lastName}`}</div>
                                            <div className="text-gray-400 text-xs">{transaction?.userData?.[0]?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 px-5">
                                    {transaction.createdAt
                                        ? new Date(transaction.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })
                                        : transaction.createdAt}
                                </td>
                                <td className="py-2 px-5">
                                    {transaction.PlanName}
                                </td>
                                <td className="py-2 px-5">
                                    {transaction.amount}
                                </td>
                                <td className="py-2 px-5">
                                    {transaction.startDate && transaction.endDate
                                        ? formatDuration(
                                            Math.ceil(
                                                (new Date(transaction.endDate) - new Date(transaction.startDate)) / (1000 * 60 * 60 * 24)
                                            )
                                        )
                                        : "-"}
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
        </div>
    )
}
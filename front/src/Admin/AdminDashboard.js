import React, { useEffect, useState } from 'react'
import { PiUser, PiUsersThree, PiHourglass, PiMoneyLight } from "react-icons/pi";
import { FaFilm, FaSkullCrossbones, FaChild, FaFaceLaugh, FaFaceGrinBeamSweat } from "react-icons/fa6";
import { GiKitchenKnives, GiPistolGun, GiSparkles, GiTheater } from "react-icons/gi";
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { getBasicCounts, getmostWatched, getnewSubscribersByPlan, getTopCategory, getTotalRevenue } from '../Redux/Slice/dashboard.slice';
import { useNavigate } from 'react-router-dom';
import { getAllpayment } from '../Redux/Slice/Payment.slice';
import { MdFavorite } from 'react-icons/md';
import { HiOutlineDocumentText } from 'react-icons/hi2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const colorPalette = [
  '#e50914', // red
  '#adafb8', // gray
  '#08B1BA', // teal
  '#f16a1b', // orange
  '#3B82F6', // blue
  '#1aa053', // green
  '#9747FF', // purple
  '#FCA997', // peach
  '#B91293', // magenta
  '#C3E1FF', // light blue
  '#FB4E22', // orange-red
  '#F3A8E2', // pink
  // ...add more colors if needed
];

function getCategoryColor(index) {
  return colorPalette[index % colorPalette.length];
}

const CategoryItem = ({ icon: Icon, name, percentage, color, style }) => (
  <div className="flex items-center space-x-3 mb-4">
    <Icon className="w-5 h-5" style={style} />
    <div className="flex-1">
      <div className="text-white text-sm font-medium">{name}</div>
      <div className="text-sm" style={style}>{percentage}</div>
    </div>
  </div>
);

export default function AdminDashboard() {

  const [filter, setFilter] = useState('all');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { BasicCounts, topCategory, totalRevenue, newPlan, mostWatched } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getBasicCounts(filter));
    dispatch(getTopCategory(filter));
    dispatch(getTotalRevenue(filter));
    dispatch(getnewSubscribersByPlan(filter));
    dispatch(getmostWatched(filter));
  }, [filter, dispatch])

  useEffect(() => {
    dispatch(getAllpayment())
  }, [dispatch])

  const transactions = useSelector((state) => state.payment.payment);

  const categoryColorMap = {
    Action: '#e50914',
    Comedy: '#adafb8',
    Horror: '#08B1BA',
    Drama: '#f16a1b',
    Thriller: '#3B82F6',
    Historical: '#1aa053',
    // Add more as needed
  };

  const piechartData = {
    // labels: ['Actions', 'Comedy', 'Horror', 'Drama', 'Kids', 'Thriller'],
    labels: topCategory?.map(cat => cat.category.categoryName) || [],
    datasets: [
      {
        // data: [34, 44, 56, 65, 74, 40],
        data: topCategory?.map(cat => cat.percentage) || [],
        // backgroundColor: [
        //   // '#9747FF', // Actions
        //   // '#FCA997', // Comedy
        //   // '#B91293', // Horror
        //   // '#C3E1FF', // Drama
        //   // '#FB4E22', // Kids
        //   // '#F3A8E2',  // Thriller
        //   '#e50914', // Actions
        //   '#adafb8', // Comedy
        //   '#08B1BA', // Horror
        //   '#f16a1b', // Drama
        //   '#1aa053', // Kids
        //   '#3B82F6'  // Thriller
        // ],
        backgroundColor: topCategory?.map((cat, idx) => getCategoryColor(idx)) || [],
        borderWidth: 0,
        cutout: '70%'
      }
    ]
  };

  const piechartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        // backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        // borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        }
      }
    }
  };

  const Linechartdata = {
    // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: totalRevenue.map((revenue) => revenue.label),
    datasets: [
      {
        label: 'Total Revenue',
        // data: [0, 0, 0, 0, 0, 0, 350, 0, 0, 0, 0, 0],
        data: totalRevenue.map((revenue) => revenue.revenue),
        borderColor: '#00C6FF',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const Linechartoptions = {
    responsive: true,
    showline: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          color: '#9ca3af',
          usePointStyle: true,
          pointStyle: 'line',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        // borderColor: '#374151',
        // borderWidth: 1,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        min: 0,
        // max: 400,
        ticks: {
          stepSize: 100,
          color: '#9ca3af',
          font: {
            size: 12,
          },
          callback: function (value) {
            return value + '.00';
          },
        },
        grid: {
          display: true,
          color: 'rgba(75, 85, 99, 0.3)',
        },
        border: {
          display: false,
        },
      },
    },
  };

  const barchartdata = {
    labels: newPlan.map((revenue) => revenue.label),
    datasets: [
      {
        label: 'Free',
        data: newPlan.map((revenue) => revenue.Free),
        backgroundColor: '#00C6FF',
        borderColor: '#00C6FF',
        borderWidth: 0,
      },
      {
        label: 'Basic',
        data: newPlan.map((revenue) => revenue.Basic),
        backgroundColor: '#0072FF',
        borderColor: '#0072FF',
        borderWidth: 0,
      },
      {
        label: 'Standard',
        data: newPlan.map((revenue) => revenue.Standard),
        backgroundColor: '#0097ff',
        borderColor: '#0097ff',
        borderWidth: 0,
      },
      {
        label: 'Premium',
        data: newPlan.map((revenue) => revenue.Premium),
        backgroundColor: '#1368a1',
        borderColor: '#1368a1',
        borderWidth: 0,
      },
    ],
  };

  const barchartoptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          color: '#9ca3af',
          usePointStyle: true,
          pointStyle: 'rect',
          font: {
            size: 12,
          }
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        stacked: true,
        grid: {
          display: true,
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        stacked: true,
        min: 0,
        // max: 5,
        ticks: {
          stepSize: 1,
          color: '#9ca3af',
          font: {
            size: 12,
          },
          callback: function (value) {
            return value;
          },
        },
        grid: {
          display: true,
          color: 'rgba(75, 85, 99, 0.3)',
        },
        border: {
          display: false,
        },
      },
    },
  };

  const barchart2data = {
    // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: mostWatched.map((revenue) => revenue.label),
    datasets: [
      {
        label: 'Movie',
        // data: [4, 1, 1, 7, 2, 3, 11, 0, 2, 1, 1, 0],
        data: mostWatched.map((revenue) => revenue.Movie),
        backgroundColor: '#00C6FF',
        borderColor: '#00C6FF',
        borderWidth: 0,
      },
      {
        label: 'Series',
        // data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
        data: mostWatched.map((revenue) => revenue.Series),
        backgroundColor: '#0072FF',
        borderColor: '#0072FF',
        borderWidth: 0,
      },
    ],
  };

  const barchart2options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          color: '#9ca3af',
          usePointStyle: true,
          pointStyle: 'rect',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        stacked: true,
        grid: {
          display: true,
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        stacked: true,
        min: 0,
        // max: 12,
        ticks: {
          stepSize: 2,
          color: '#9ca3af',
          font: {
            size: 12,
          },
          callback: function (value) {
            return value;
          },
        },
        grid: {
          display: true,
          color: 'rgba(75, 85, 99, 0.3)',
        },
        border: {
          display: false,
        },
      },
    },
  };

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

  return (
    <div className="container p-5 md:p-10 bg-[#0f0f0f]">
      <div className="text-end mb-5">
        <div
          className="inline-block rounded p-[1px]"
          style={{
            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)'
          }}
        >
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="rounded text-sm p-1 sm:p-2 bg-[#141414] text-white focus:outline-none w-full"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <div onClick={() => { navigate('/admin/user') }} className="p-[2px] rounded-lg" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className={`bg-[#141414] flex justify-between items-center p-3 md600:p-6 rounded-lg cursor-pointer`}>
            <div className="flex items-center justify-between md600:mb-4">
              <PiUser className="w-6 h-6 text-white" />
            </div>
            <div className="text-end">
              <div className="text-xl md:text-3xl font-bold text-white mb-2">{BasicCounts?.totalUsers}</div>
              <div className="text-white text-sm">Total Users</div>
            </div>
          </div>
        </div>
        <div className="p-[2px] rounded-lg" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className={`bg-[#141414] flex justify-between items-center p-3 md600:p-6 rounded-lg cursor-pointer`}>
            <div className="flex items-center justify-between md600:mb-4">
              <PiUsersThree className="w-6 h-6 text-white" />
            </div>
            <div className="text-end">
              <div className="text-xl md:text-3xl font-bold text-white mb-2">{BasicCounts?.totalSubscribers}</div>
              <div className="text-white text-sm">Total Subscribers</div>
            </div>
          </div>
        </div>
        <div className="p-[2px] rounded-lg" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className={`bg-[#141414] flex justify-between items-center p-3 md600:p-6 rounded-lg cursor-pointer`}>
            <div className="flex items-center justify-between md600:mb-4">
              <PiHourglass className="w-6 h-6 text-white" />
            </div>
            <div className="text-end">
              <div className="text-xl md:text-3xl font-bold text-white mb-2">{BasicCounts?.totalSoonToExpire}</div>
              <div className="text-white text-sm">Total Soon to Expire</div>
            </div>
          </div>
        </div>
        <div onClick={() => { navigate('/admin/transaction') }} className="p-[2px] rounded-lg" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className={`bg-[#141414] flex justify-between items-center p-3 md600:p-6 rounded-lg cursor-pointer`}>
            <div className="flex items-center justify-between md600:mb-4">
              <PiMoneyLight className="w-6 h-6 text-white" />
            </div>
            <div className="text-end">
              <div className="text-xl md:text-3xl font-bold text-white mb-2">{BasicCounts?.totalRevenue}</div>
              <div className="text-white text-sm">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className="mt-6 p-[2px] rounded-lg " style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">Top Category</h2>
            </div>

            <div className="md600:flex items-start md600:space-x-8">
              {/* Categories List */}
              <div className="flex-1 h-[168px] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-x-8">
                  {topCategory && topCategory.length > 0 &&
                    topCategory.map((cat, idx) => (
                      <CategoryItem
                        key={cat.categoryId}
                        icon={
                          cat.category.categoryName === "Action" ? GiPistolGun :
                            cat.category.categoryName === "Horror" ? FaSkullCrossbones :
                              cat.category.categoryName === "Comedy" ? FaFaceLaugh :
                                cat.category.categoryName === "Anime" ? GiSparkles :
                                  cat.category.categoryName === "Drama" ? GiTheater :
                                    cat.category.categoryName === "Thriller" ? GiKitchenKnives :
                                      cat.category.categoryName === "Historical" ? HiOutlineDocumentText :
                                        cat.category.categoryName === "Romance" ? MdFavorite :
                                          FaFilm
                        }
                        name={cat.category.categoryName}
                        percentage={`+${cat.percentage}%`}
                        style={{ color: getCategoryColor(idx) }}
                      />
                    ))
                  }
                </div>
              </div>

              {/* Donut Chart */}
              <div className="flex-shrink-0">
                <Doughnut data={piechartData} options={piechartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-[2px] rounded-lg" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-[42px]">
              <h2 className="text-base md600:text-xl font-semibold text-white">Total Revenue</h2>
            </div>

            {/* Line Chart */}
            <div>
              <Line data={Linechartdata} options={Linechartoptions} />
            </div>
          </div>
        </div>

        <div className="p-[2px] rounded-lg" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">New Subscribers</h2>
            </div>

            {/* Bar 1 Chart */}
            <div>
              <Bar data={barchartdata} options={barchartoptions} />
            </div>
          </div>
        </div>

        <div className="p-[2px] rounded-lg" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">Most Watched</h2>
            </div>

            {/* Bar 2 Chart */}
            <div>
              <Bar data={barchart2data} options={barchart2options} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div className="mt-6 p-[2px] rounded-lg" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">Transactions</h2>
              <button onClick={() => { navigate('/admin/transaction') }} className="text-[#00C6FF] hover:text-[#0072FF] transition-colors duration-300 ease-in-out text-sm font-medium">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-gray-400 font-medium text-sm py-3 px-4">Name</th>
                    <th className="text-left text-gray-400 font-medium text-sm py-3 px-4">Date</th>
                    <th className="text-left text-gray-400 font-medium text-sm py-3 px-4">Plan</th>
                    <th className="text-left text-gray-400 font-medium text-sm py-3 px-4">Amount</th>
                    <th className="text-left text-gray-400 font-medium text-sm py-3 px-4">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-700/50">
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
                      <td className="py-4 px-4 text-gray-300 text-sm">
                        {transaction.createdAt
                          ? new Date(transaction.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })
                          : transaction.createdAt}
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm">{transaction.PlanName}</td>
                      <td className="py-4 px-4 text-gray-300 text-sm font-medium">{transaction.amount}</td>
                      <td className="py-4 px-4 text-gray-300 text-sm">
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
          </div>
        </div>
      </div>
    </div >
  )
}

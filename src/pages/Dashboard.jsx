import { useState } from 'react';
import { 
  FaUsers, 
  FaCar, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaMapMarkerAlt,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaTachometerAlt,
  FaShieldAlt
} from 'react-icons/fa';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Dummy data
  const stats = [
    {
      title: 'Total Riders',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: FaUsers,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Vehicles',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: FaCar,
      color: 'bg-green-500'
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '+15.3%',
      changeType: 'positive',
      icon: FaMoneyBillWave,
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Rides',
      value: '8,945',
      change: '+22.1%',
      changeType: 'positive',
      icon: FaChartLine,
      color: 'bg-purple-500'
    }
  ];

  const recentRides = [
    {
      id: 1,
      rider: 'John Smith',
      driver: 'Mike Johnson',
      pickup: 'Downtown Mall',
      dropoff: 'Airport Terminal 1',
      amount: '$25.50',
      status: 'completed',
      time: '2 min ago'
    },
    {
      id: 2,
      rider: 'Sarah Wilson',
      driver: 'David Brown',
      pickup: 'Central Park',
      dropoff: 'Shopping Center',
      amount: '$18.75',
      status: 'in_progress',
      time: '5 min ago'
    },
    {
      id: 3,
      rider: 'Michael Davis',
      driver: 'Lisa Anderson',
      pickup: 'Train Station',
      dropoff: 'University Campus',
      amount: '$32.00',
      status: 'completed',
      time: '12 min ago'
    },
    {
      id: 4,
      rider: 'Emma Thompson',
      driver: 'Robert Wilson',
      pickup: 'Hospital',
      dropoff: 'Residential Area',
      amount: '$28.90',
      status: 'cancelled',
      time: '15 min ago'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'rider_registered',
      message: 'New rider registered: John Smith',
      time: '2 min ago',
      icon: FaUsers,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'vehicle_added',
      message: 'New vehicle added: Toyota Camry (ABC-123)',
      time: '5 min ago',
      icon: FaCar,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'payment_received',
      message: 'Payment received: $45.20 from ride #1234',
      time: '8 min ago',
      icon: FaMoneyBillWave,
      color: 'text-yellow-500'
    },
    {
      id: 4,
      type: 'support_ticket',
      message: 'New support ticket: Ride cancellation issue',
      time: '12 min ago',
      icon: FaExclamationTriangle,
      color: 'text-red-500'
    },
    {
      id: 5,
      type: 'driver_approved',
      message: 'Driver approved: Sarah Johnson',
      time: '15 min ago',
      icon: FaCheckCircle,
      color: 'text-green-500'
    }
  ];

  const topDrivers = [
    {
      id: 1,
      name: 'Mike Johnson',
      rating: 4.9,
      rides: 156,
      earnings: '$2,450',
      status: 'online',
      avatar: 'MJ'
    },
    {
      id: 2,
      name: 'David Brown',
      rating: 4.8,
      rides: 142,
      earnings: '$2,180',
      status: 'online',
      avatar: 'DB'
    },
    {
      id: 3,
      name: 'Lisa Anderson',
      rating: 4.7,
      rides: 128,
      earnings: '$1,950',
      status: 'offline',
      avatar: 'LA'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="page-section">
      {/* Header */}
      <div className="page-header mb-6">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your ride-sharing platform today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="page-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className={`text-sm mt-2 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last period
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Rides */}
        <div className="lg:col-span-2">
          <div className="page-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Rides
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentRides.map((ride) => (
                <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <FaMapMarkerAlt className="text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ride.rider} → {ride.driver}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ride.pickup} → {ride.dropoff}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {ride.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {ride.amount}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                      {getStatusText(ride.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <div className="page-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${activity.color}`}>
                    <activity.icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Drivers */}
        <div className="page-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Drivers
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topDrivers.map((driver) => (
              <div key={driver.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {driver.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {driver.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <FaStar className="text-yellow-500 text-xs" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {driver.rating} ({driver.rides} rides)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {driver.earnings}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    driver.status === 'online' 
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
                      : 'text-gray-600 bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {driver.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="page-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Platform Overview
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FaTachometerAlt className="text-blue-600 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">98.5%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FaShieldAlt className="text-green-600 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">99.2%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Safety Score</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-blue-600" />
                  <span className="text-sm text-gray-900 dark:text-white">Support Calls</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">24</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-green-600" />
                  <span className="text-sm text-gray-900 dark:text-white">Pending Tickets</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">8</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-purple-600" />
                  <span className="text-sm text-gray-900 dark:text-white">Scheduled Rides</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
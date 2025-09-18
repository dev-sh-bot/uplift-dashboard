import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { formatDate, triggerToast } from '../utils/helper';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { useQueryParams } from '../hooks/useQueryParams';

const VehicleTypeList = () => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    // Debounce search term to reduce API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Handle query params for search
    const { updatePageParam } = useQueryParams(searchTerm, debouncedSearchTerm, setSearchTerm);

    const fetchVehicleTypes = async (search = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}admin/vehicle-type`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                params: {
                    search,
                },
            });

            const dataArr = Array.isArray(response.data.data) ? response.data.data : [];
            setVehicleTypes(dataArr);
            setTotalItems(response.data.total || dataArr.length);
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
            triggerToast('Failed to fetch vehicle types', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicleTypes(debouncedSearchTerm);
    }, [debouncedSearchTerm, user?.token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    colors={['#8484c1', "#8484c1", "#8484c1", "#8484c1", "#8484c1"]}
                />
            </div>
        );
    }

    return (
        <div className="page-section">
            {/* Search and Create Bar */}
            <div className="search-container">
                <div className="flex items-center justify-between gap-4">
                    <div className="w-80 relative">
                        <FaSearch className="search-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search vehicle types by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button
                        onClick={() => navigate('/vehicle-types/add')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
                    >
                        <FaPlus size={14} />
                        <span>Add Vehicle Type</span>
                    </button>
                </div>
            </div>

            {/* Vehicle Types Table */}
            <div className="page-card p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-facebook-border">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">Vehicle Types</h2>
                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">
                        Total: {totalItems} vehicle types
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-facebook-border">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Vehicle Type</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Description</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Create At</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {vehicleTypes.map((vehicleType) => (
                                <tr key={vehicleType.id} className="table-row hover:bg-gray-50 dark:hover:bg-facebook-hover transition-colors">
                                    <td className="table-cell text-gray-900 dark:text-facebook-text">
                                        <div className="flex items-center">
                                            <div className="avatar-container h-12 w-12">
                                                {vehicleType.icon ? (
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        src={`${ASSETS_URL}${vehicleType.icon}`}
                                                        alt={vehicleType.title}
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder h-12 w-12 rounded-lg">
                                                        <span className="avatar-text text-sm">
                                                            {vehicleType.title?.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="table-cell-text-primary text-gray-900 dark:text-facebook-text font-medium">
                                                    {vehicleType.title}
                                                </div>
                                                <div className="table-cell-text-secondary text-gray-500 dark:text-facebook-textSecondary">
                                                    ID: {vehicleType.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text max-w-xs">
                                        <div className="truncate" title={vehicleType.description}>
                                            {vehicleType.description || 'No description available'}
                                        </div>
                                    </td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text max-w-xs">
                                        <div className="truncate">
                                        {vehicleType.created_at ? formatDate(vehicleType.created_at) : ''}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VehicleTypeList;
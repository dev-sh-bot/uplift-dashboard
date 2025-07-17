import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import ReactPaginate from 'react-paginate';
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const VehicleTypeList = () => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    const fetchVehicleTypes = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}admin/vehicle-type-rates`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                params: {
                    page,
                    search,
                },
            });

            setVehicleTypes(response.data.data);
            setTotalPages(response.data.last_page);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
            triggerToast('Failed to fetch vehicle types', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicleTypes(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    };



    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

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
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search vehicle types by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <button
                        onClick={() => navigate('/vehicle-type-rates/add')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
                    >
                        <FaPlus size={14} />
                        <span>Add Vehicle Type Rate</span>
                    </button>
                </div>
            </div>

            {/* Vehicle Types Table */}
            <div className="table-container">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-facebook-border">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">Vehicle Type Rates</h2>
                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">
                        Total: {totalItems} vehicle type rates
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-facebook-border">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell">Vehicle Type</th>
                                <th className="table-header-cell">Pricing</th>
                                <th className="table-header-cell">Base Price</th>
                                <th className="table-header-cell">Per KM</th>
                                <th className="table-header-cell">Per Min</th>
                                <th className="table-header-cell">Booking Fee</th>
                                <th className="table-header-cell">Created</th>
                                <th className="table-header-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {vehicleTypes.map((vehicleType) => (
                                <tr key={vehicleType.id} className="table-row">
                                    <td className="table-cell">
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
                                                <div className="table-cell-text-primary">
                                                    {vehicleType.title}
                                                </div>
                                                <div className="table-cell-text-secondary">
                                                    ID: {vehicleType.id}
                                                </div>
                                                {vehicleType.description && (
                                                    <div className="text-xs text-gray-400 dark:text-facebook-textMuted mt-1">
                                                        {vehicleType.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary">
                                            <span className="font-medium">Base:</span> {formatCurrency(vehicleType.base_price)}
                                        </div>
                                        <div className="table-cell-text-secondary">
                                            <span className="font-medium">Per KM:</span> {formatCurrency(vehicleType.per_km)}
                                        </div>
                                        <div className="table-cell-text-secondary">
                                            <span className="font-medium">Per Min:</span> {formatCurrency(vehicleType.per_min)}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary font-semibold">
                                            {formatCurrency(vehicleType.base_price)}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary font-semibold">
                                            {formatCurrency(vehicleType.per_km)}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary font-semibold">
                                            {formatCurrency(vehicleType.per_min)}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary font-semibold">
                                            {formatCurrency(vehicleType.booking_fee)}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-secondary">
                                            {formatDate(vehicleType.created_at)}
                                        </div>
                                    </td>
                                    <td className="table-cell text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="action-button action-button-view">
                                                <FaEye size={16} />
                                            </button>
                                            <button className="action-button action-button-edit">
                                                <FaEdit size={16} />
                                            </button>
                                            <button className="action-button action-button-delete">
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-container">
                        <ReactPaginate
                            previousLabel="Previous"
                            nextLabel="Next"
                            breakLabel="..."
                            breakClassName="break-me"
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageChange}
                            containerClassName="flex justify-center space-x-1"
                            pageClassName="pagination-button"
                            pageLinkClassName="block"
                            activeClassName="pagination-active"
                            previousClassName="pagination-button"
                            nextClassName="pagination-button"
                            disabledClassName="opacity-50 cursor-not-allowed"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleTypeList; 
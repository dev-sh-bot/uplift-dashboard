import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import ReactPaginate from 'react-paginate';
import { FaSearch, FaEye, FaEdit, FaTrash, FaCog, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StatusUpdateModal from '../components/StatusUpdateModal';

const RidersList = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedRider, setSelectedRider] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    const fetchRiders = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}admin/riders`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                params: {
                    page,
                    search,
                },
            });

            setRiders(response.data.data);
            setTotalPages(response.data.last_page);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error('Error fetching riders:', error);
            triggerToast('Failed to fetch riders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateRiderStatus = async (riderId, newStatus, suspensionReason = '') => {
        try {
            setIsUpdatingStatus(true);
            
            const response = await axios.put(
                `${API_URL}admin/riders/approved/${riderId}/${newStatus}`,
                { reason: suspensionReason },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                triggerToast(`Rider status updated to ${newStatus}`, 'success');
                // Refresh the riders list
                fetchRiders(currentPage, searchTerm);
                setStatusModalOpen(false);
                setSelectedRider(null);
            }
        } catch (error) {
            console.error('Error updating rider status:', error);
            triggerToast(error.response?.data?.message || 'Failed to update rider status', 'error');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleStatusUpdate = (rider) => {
        setSelectedRider(rider);
        setStatusModalOpen(true);
    };

    const handleStatusConfirm = (newStatus, suspensionReason) => {
        if (selectedRider) {
            updateRiderStatus(selectedRider.id, newStatus, suspensionReason);
        }
    };

    useEffect(() => {
        fetchRiders(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    };



    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'status-badge status-badge-active',
            inactive: 'status-badge status-badge-inactive',
            pending: 'status-badge status-badge-pending',
        };
        return (
            <span className={`${statusClasses[status] || 'status-badge status-badge-offline'}`}>
                {status}
            </span>
        );
    };

    const getApprovalBadge = (isApproved) => {
        const approvalClasses = {
            approved: 'status-badge status-badge-active',
            rejected: 'status-badge status-badge-inactive',
            unknown: 'status-badge status-badge-offline',
        };
        return (
            <span className={`${approvalClasses[isApproved] || 'status-badge status-badge-offline'}`}>
                {isApproved}
            </span>
        );
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
                            placeholder="Search riders by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <button
                        onClick={() => navigate('/riders/add')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
                    >
                        <FaPlus size={14} />
                        <span>Add Rider</span>
                    </button>
                </div>
            </div>

            {/* Riders Table */}
            <div className="table-container">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-facebook-border">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">Riders</h2>
                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">
                        Total: {totalItems} riders
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-facebook-border">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell">Rider</th>
                                <th className="table-header-cell">Contact</th>
                                <th className="table-header-cell">Location</th>
                                <th className="table-header-cell">Status</th>
                                <th className="table-header-cell">Approval</th>
                                <th className="table-header-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {riders.map((rider) => (
                                <tr key={rider.id} className="table-row">
                                    <td className="table-cell">
                                        <div className="flex items-center">
                                            <div className="avatar-container h-10 w-10">
                                                {rider.avatar ? (
                                                    <img
                                                        className="avatar-image h-10 w-10"
                                                        src={`${ASSETS_URL}${rider.avatar}`}
                                                        alt={`${rider.first_name} ${rider.last_name}`}
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder h-10 w-10">
                                                        <span className="avatar-text">
                                                            {rider.first_name?.charAt(0)}{rider.last_name?.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="table-cell-text-primary">
                                                    {rider.first_name} {rider.last_name}
                                                </div>
                                                <div className="table-cell-text-secondary">
                                                    @{rider.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary">{rider.email}</div>
                                        <div className="table-cell-text-secondary">{rider.phone}</div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary">{rider.nationality}</div>
                                        <div className="table-cell-text-secondary">{rider.lat_long}</div>
                                    </td>
                                    <td className="table-cell">
                                        {getStatusBadge(rider.status)}
                                    </td>
                                    <td className="table-cell">
                                        {getApprovalBadge(rider.is_approved)}
                                    </td>
                                    <td className="table-cell text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                className="action-button action-button-view"
                                                onClick={() => navigate(`/riders/${rider.id}`)}
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button 
                                                className="action-button action-button-settings"
                                                onClick={() => handleStatusUpdate(rider)}
                                                title="Update Status"
                                            >
                                                <FaCog size={16} />
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

            {/* Status Update Modal */}
            <StatusUpdateModal
                isOpen={statusModalOpen}
                onClose={() => {
                    setStatusModalOpen(false);
                    setSelectedRider(null);
                }}
                onConfirm={handleStatusConfirm}
                currentStatus={selectedRider?.is_approved || ''}
                riderName={selectedRider ? `${selectedRider.first_name} ${selectedRider.last_name}` : ''}
                isProcessing={isUpdatingStatus}
            />
        </div>
    );
};

export default RidersList;
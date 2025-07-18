import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import ReactPaginate from 'react-paginate';
import { FaSearch, FaEye, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    const fetchCustomers = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}admin/customers`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                params: {
                    page,
                    search,
                },
            });

            setCustomers(response.data.data);
            setTotalPages(response.data.last_page);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error('Error fetching customers:', error);
            triggerToast('Failed to fetch customers', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'status-badge status-badge-active',
            inactive: 'status-badge status-badge-inactive',
            offline: 'status-badge status-badge-offline',
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
                        <FaSearch className="search-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search customers by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="table-container">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-facebook-border">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">Customers</h2>
                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">
                        Total: {totalItems} customers
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-facebook-border">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell">Customer</th>
                                <th className="table-header-cell">Contact</th>
                                <th className="table-header-cell">Location</th>
                                <th className="table-header-cell">Status</th>
                                <th className="table-header-cell">Approval</th>
                                <th className="table-header-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="table-row">
                                    <td className="table-cell">
                                        <div className="flex items-center">
                                            <div className="avatar-container h-10 w-10">
                                                {customer.avatar ? (
                                                    <img
                                                        className="avatar-image h-10 w-10"
                                                        src={`${ASSETS_URL}${customer.avatar}`}
                                                        alt={`${customer.first_name} ${customer.last_name}`}
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder h-10 w-10">
                                                        <span className="avatar-text">
                                                            {customer.first_name?.charAt(0)}{customer.last_name?.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="table-cell-text-primary">
                                                    {customer.first_name} {customer.last_name}
                                                </div>
                                                <div className="table-cell-text-secondary">
                                                    @{customer.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary">{customer.email}</div>
                                        <div className="table-cell-text-secondary">{customer.phone}</div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="table-cell-text-primary">{customer.nationality}</div>
                                        <div className="table-cell-text-secondary">{customer.lat_long}</div>
                                    </td>
                                    <td className="table-cell">
                                        {getStatusBadge(customer.status)}
                                    </td>
                                    <td className="table-cell">
                                        {getApprovalBadge(customer.is_approved)}
                                    </td>
                                    <td className="table-cell text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                className="action-button action-button-view"
                                                onClick={() => navigate(`/customers/${customer.id}`)}
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button className="action-button action-button-edit">
                                                <FaEdit size={16} />
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

export default CustomerList; 
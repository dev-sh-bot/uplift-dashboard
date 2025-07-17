import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';


const CustomerView = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}admin/customers/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer details:', error);
            triggerToast('Failed to fetch customer details', 'error');
            navigate('/customers');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800',
            offline: 'bg-gray-100 text-gray-800',
            pending: 'bg-yellow-100 text-yellow-800',
        };
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const getApprovalBadge = (isApproved) => {
        const approvalClasses = {
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
            unknown: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${approvalClasses[isApproved] || 'bg-gray-100 text-gray-800'}`}>
                {isApproved}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    if (!customer) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Customer not found</p>
            </div>
        );
    }

    return (
        <div className="page-section">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Basic Info Card */}
                    <div className="page-card p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    {customer.avatar ? (
                                        <img
                                            className="h-16 w-16 rounded-full object-cover"
                                            src={`${ASSETS_URL}${customer.avatar}`}
                                            alt={`${customer.first_name} ${customer.last_name}`}
                                        />
                                    ) : (
                                        <div className="avatar-placeholder h-16 w-16">
                                            <span className="avatar-text text-lg">
                                                {customer.first_name?.charAt(0)}{customer.last_name?.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">
                                        {customer.first_name} {customer.last_name}
                                    </h3>
                                    <p className="text-gray-500 dark:text-facebook-textSecondary">@{customer.username}</p>
                                    <p className="text-sm text-gray-400 dark:text-facebook-textMuted">ID: {customer.id}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Email:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{customer.email}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Phone:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{customer.phone}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Nationality:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{customer.nationality}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="page-card p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Location Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Current Location:</span>
                                <p className="text-gray-900 dark:text-facebook-text">{customer.lat_long || 'Not available'}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Address:</span>
                                <p className="text-gray-900 dark:text-facebook-text">{customer.address || 'Not available'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="page-card p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Additional Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Date of Birth:</span>
                                <p className="text-gray-900 dark:text-facebook-text">{customer.date_of_birth || 'Not available'}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Gender:</span>
                                <p className="text-gray-900 dark:text-facebook-text capitalize">{customer.gender || 'Not available'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status Card */}
                    <div className="page-card p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Status Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Online Status:</span>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${customer.online_status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    <span className="text-gray-900 dark:text-facebook-text capitalize">{customer.online_status}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Account Status:</span>
                                {getStatusBadge(customer.status)}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Approval Status:</span>
                                {getApprovalBadge(customer.is_approved)}
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="page-card p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Account Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Member Since:</span>
                                <p className="text-gray-900 dark:text-facebook-text">{formatDate(customer.created_at)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Last Updated:</span>
                                <p className="text-gray-900 dark:text-facebook-text">{formatDate(customer.updated_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* User ID */}
                    <div className="page-card p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">System Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">User ID:</span>
                                <p className="text-gray-900 dark:text-facebook-text">{customer.user_id}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Role:</span>
                                <p className="text-gray-900 dark:text-facebook-text capitalize">{customer.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerView; 
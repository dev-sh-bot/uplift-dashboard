import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaCog } from 'react-icons/fa';
import StatusUpdateModal from '../components/StatusUpdateModal';
import InspectionModal from '../components/InspectionModal';

const RiderView = () => {
    const [rider, setRider] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [verificationDocs, setVerificationDocs] = useState({});
    const [loading, setLoading] = useState(true);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    useEffect(() => {
        fetchRiderDetails();
    }, [id]);

    const fetchRiderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}admin/riders/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            setRider(response.data.data);
            setVehicles(response.data.vehicles || []);
            setVerificationDocs(response.data.verification_docs || {});
        } catch (error) {
            console.error('Error fetching rider details:', error);
            triggerToast('Failed to fetch rider details', 'error');
            navigate('/riders');
        } finally {
            setLoading(false);
        }
    };

    const updateRiderStatus = async (newStatus, suspensionReason = '') => {
        try {
            setIsUpdatingStatus(true);
            
            // If status is being changed to suspended, send email first
            if (newStatus === 'suspended' && suspensionReason) {
                try {
                    // TODO: Replace with actual email API endpoint
                    // await axios.post(`${API_URL}admin/send-suspension-email`, {
                    //     rider_id: id,
                    //     reason: suspensionReason
                    // }, {
                    //     headers: {
                    //         Authorization: `Bearer ${user?.token}`,
                    //     },
                    // });
                    console.log('Sending suspension email with reason:', suspensionReason);
                } catch (error) {
                    console.error('Error sending suspension email:', error);
                    // Continue with status update even if email fails
                }
            }
            
            const response = await axios.put(
                `${API_URL}admin/riders/approved/${id}/${newStatus}`,
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
                // Refresh the rider details
                fetchRiderDetails();
                setStatusModalOpen(false);
            }
        } catch (error) {
            console.error('Error updating rider status:', error);
            triggerToast(error.response?.data?.message || 'Failed to update rider status', 'error');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleStatusConfirm = (newStatus, suspensionReason) => {
        updateRiderStatus(newStatus, suspensionReason);
    };

    const handleInspection = (vehicle) => {
        setSelectedVehicle(vehicle);
        setInspectionModalOpen(true);
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

    if (!rider) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Rider not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="page-card p-4">
                        <div className="text-center">
                            <div className="flex justify-center mb-3">
                                {rider.avatar ? (
                                    <img
                                        className="h-24 w-24 rounded-full object-cover border-4 border-purple-100"
                                        src={`${ASSETS_URL}${rider.avatar}`}
                                        alt={`${rider.first_name} ${rider.last_name}`}
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center border-4 border-purple-100">
                                        <span className="text-white font-bold text-2xl">
                                            {rider.first_name?.charAt(0)}{rider.last_name?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <h2 className="text-xl font-bold text-gray-900 dark:text-facebook-text mb-1">
                                {rider.first_name} {rider.last_name}
                            </h2>
                            <p className="text-gray-600 dark:text-facebook-textSecondary mb-1">@{rider.username}</p>
                            <p className="text-sm text-gray-500 dark:text-facebook-textMuted mb-3">ID: {rider.id}</p>
                            
                            <div className="flex justify-center mb-3">
                                {getStatusBadge(rider.status)}
                            </div>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${rider.online_status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    <span className="text-gray-600 dark:text-facebook-textSecondary capitalize">{rider.online_status}</span>
                                </div>
                                
                                <div className="flex items-center justify-center space-x-2">
                                    {rider.background_verfied ? (
                                        <FaCheckCircle className="text-green-600" />
                                    ) : (
                                        <FaTimesCircle className="text-red-600" />
                                    )}
                                    <span className={rider.background_verfied ? 'text-green-600' : 'text-red-600'}>
                                        Background {rider.background_verfied ? 'Verified' : 'Not Verified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Info and Vehicles */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Profile Info Card */}
                    <div className="page-card p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Profile Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Email:</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-900 dark:text-facebook-text">{rider.email}</p>
                                        {rider.email_verified_at && (
                                            <span className="text-xs text-green-600 flex items-center justify-end">
                                                <FaCheckCircle className="mr-1" />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FaPhone className="text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Phone:</span>
                                    </div>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.phone}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Location:</span>
                                    </div>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.lat_long}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Nationality:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.nationality || 'Not provided'}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">License Number:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.license_number || 'Not provided'}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Total Rides:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.total_rides || 0}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Current Rating:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.current_rating || 0}/5</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="page-card p-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Additional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Social Security Number:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.social_security_number || 'Not provided'}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Device ID:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.device_id || 'Not provided'}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Driving Experience:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{rider.driving_experience || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Background Verified:</span>
                                    <div className="flex items-center space-x-2">
                                        {rider.background_verfied ? (
                                            <FaCheckCircle className="text-green-600" />
                                        ) : (
                                            <FaTimesCircle className="text-red-600" />
                                        )}
                                        <span className={rider.background_verfied ? 'text-green-600' : 'text-red-600'}>
                                            {rider.background_verfied ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Member Since:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{formatDate(rider.created_at)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Last Updated:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{formatDate(rider.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles */}
                    {vehicles.length > 0 && (
                        <div className="page-card p-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Vehicles</h2>
                            <div className="space-y-3">
                                {vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="border border-gray-200 dark:border-facebook-border rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-facebook-text">
                                                    {vehicle.make} {vehicle.model} ({vehicle.year})
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-facebook-textSecondary">{vehicle.vehicle_type}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusBadge(vehicle.status)}
                                                <button
                                                    onClick={() => handleInspection(vehicle)}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    Inspection
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500 dark:text-facebook-textSecondary">Registration:</span>
                                                <p className="text-gray-900 dark:text-facebook-text">{vehicle.registration_number}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500 dark:text-facebook-textSecondary">Color:</span>
                                                <p className="text-gray-900 dark:text-facebook-text">{vehicle.color}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500 dark:text-facebook-textSecondary">Insurance:</span>
                                                <p className="text-gray-900 dark:text-facebook-text">{vehicle.insurance_validity || 'Not provided'}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500 dark:text-facebook-textSecondary">Created:</span>
                                                <p className="text-gray-900 dark:text-facebook-text">{formatDate(vehicle.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status and Account Info */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Status Card */}
                        <div className="page-card p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">Status Information</h2>
                                <button
                                    onClick={() => setStatusModalOpen(true)}
                                    className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="Update Status"
                                >
                                    <FaCog size={16} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Online Status:</span>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${rider.online_status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        <span className="text-gray-900 dark:text-facebook-text capitalize">{rider.online_status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Account Status:</span>
                                    {getStatusBadge(rider.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Approval Status:</span>
                                    {getApprovalBadge(rider.is_approved)}
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="page-card p-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Account Information</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Member Since:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{formatDate(rider.created_at)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">Last Updated:</span>
                                    <p className="text-gray-900 dark:text-facebook-text">{formatDate(rider.updated_at)}</p>
                                </div>
                                {rider.license_expiry && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">License Expiry:</span>
                                        <p className="text-gray-900 dark:text-facebook-text">{formatDate(rider.license_expiry)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verification Documents */}
                        {Object.keys(verificationDocs).length > 0 && (
                            <div className="page-card p-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Verification Documents</h2>
                                <div className="space-y-2">
                                    {Object.entries(verificationDocs).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">{value}:</span>
                                            <div className="flex items-center space-x-2">
                                                <FaCheckCircle className="text-green-600" />
                                                <span className="text-green-600 text-sm">Verified</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            <StatusUpdateModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onConfirm={handleStatusConfirm}
                currentStatus={rider?.is_approved || ''}
                riderName={`${rider?.first_name} ${rider?.last_name}`}
                isProcessing={isUpdatingStatus}
            />

            {/* Inspection Modal */}
            <InspectionModal
                isOpen={inspectionModalOpen}
                onClose={() => setInspectionModalOpen(false)}
                vehicle={selectedVehicle}
            />
        </div>
    );
};

export default RiderView; 
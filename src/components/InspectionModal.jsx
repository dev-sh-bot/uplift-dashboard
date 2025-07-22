import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaCar, FaChevronDown, FaCheck, FaTimes as FaTimesIcon, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { ColorRing } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { triggerToast } from '../utils/helper';

const inspectionFields = [
    { key: 'headlights', label: 'Headlights' },
    { key: 'airlights', label: 'Airlights' },
    { key: 'indicators', label: 'Indicators' },
    { key: 'stop_lights', label: 'Stop Lights' },
    { key: 'windshield', label: 'Windshield' },
    { key: 'windshield_wipers', label: 'Windshield Wipers' },
    { key: 'safty_belt', label: 'Safety Belt' },
    { key: 'tires', label: 'Tires' },
    { key: 'speedometer', label: 'Speedometer' },
];

const InspectionModal = ({
    isOpen,
    onClose,
    vehicle,
    isProcessing = false
}) => {
    const user = useSelector(selectUser);
    const [inspectionData, setInspectionData] = useState([]);
    const [selectedInspectionIndex, setSelectedInspectionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    // Removed image popup modal state
    const [imageStatuses, setImageStatuses] = useState({}); // { [imageUrl]: { status, loading } }

    useEffect(() => {
        if (isOpen && vehicle) {
            setLoading(true);
            axios.get(`${API_URL}admin/vehicles-inspection/${vehicle.id}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            })
                .then(res => {
                    const inspections = res.data.data || [];
                    setInspectionData(inspections);
                    setSelectedInspectionIndex(0); // Reset to first inspection
                })
                .catch(() => {
                    setInspectionData([]);
                    setSelectedInspectionIndex(0);
                })
                .finally(() => setLoading(false));
        } else {
            setInspectionData([]);
            setSelectedInspectionIndex(0);
        }
    }, [isOpen, vehicle]);

    // Fetch image statuses when inspection data changes
    useEffect(() => {
        if (inspectionData.length > 0) {
            const newStatuses = {};
            inspectionData.forEach((inspection) => {
                inspectionFields.forEach(field => {
                    let fieldImages = [];
                    try {
                        fieldImages = inspection[field.key] ? JSON.parse(inspection[field.key]) : [];
                    } catch {
                        fieldImages = [];
                    }
                    fieldImages.forEach((img) => {
                        // Default to pending if not already set
                        if (!newStatuses[img]) {
                            newStatuses[img] = { status: 'pending', loading: false };
                        }
                    });
                });
            });
            setImageStatuses(newStatuses);
        }
    }, [inspectionData]);

    const handleApproveReject = async (img, action) => {
        setImageStatuses(prev => ({ ...prev, [img]: { ...prev[img], loading: true } }));
        try {
            // Use image name or a unique identifier as image_id
            const imageId = encodeURIComponent(img);
            const response = await axios.post(`${API_URL}admin/vehicles/approve-inspection/${imageId}`, { status: action }, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            if (response.status === 200) {
                setImageStatuses(prev => ({ ...prev, [img]: { status: action, loading: false } }));
            } else {
                setImageStatuses(prev => ({ ...prev, [img]: { ...prev[img], loading: false } }));
                triggerToast('Failed to update status', 'error');
            }
        } catch {
            setImageStatuses(prev => ({ ...prev, [img]: { ...prev[img], loading: false } }));
            triggerToast('Failed to update status', 'error');
        }
    };

    const getImageStatusBadge = (status) => {
        if (status === 'approved') return <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-xs font-semibold">Approved</span>;
        if (status === 'rejected') return <span className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full text-xs font-semibold">Rejected</span>;
        return <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>;
    };

    const handleClose = () => {
        onClose();
    };

    // Removed image lightbox handlers

    const getStatusIcon = (status) => {
        switch (status) {
            case 1:
                return <FaCheckCircle className="text-green-600" title="Passed" />;
            case 0:
                return <FaTimesCircle className="text-red-600" title="Failed" />;
            default:
                return <FaCalendarAlt className="text-yellow-600" title="Pending" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOverallStatus = (inspection) => {
        const statusFields = inspectionFields.map(field => inspection[`is_${field.key}`]);
        const passedCount = statusFields.filter(status => status === 1).length;
        const failedCount = statusFields.filter(status => status === 0).length;

        if (failedCount > 0) return { status: 'failed', text: 'Failed', color: 'text-red-600' };
        if (passedCount === statusFields.length) return { status: 'passed', text: 'Passed', color: 'text-green-600' };
        return { status: 'pending', text: 'Pending', color: 'text-yellow-600' };
    };

    const currentInspection = inspectionData[selectedInspectionIndex];

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={handleClose}
                contentLabel="Vehicle Inspection"
                className="fixed inset-0 flex flex-col items-stretch justify-center z-40"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30"
            >
                {/* Header */}
                <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Vehicle Inspection</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        disabled={isProcessing}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6 bg-white dark:bg-gray-800 max-h-[80vh] overflow-y-auto max-w-[90vw] w-full mx-auto">
                    {/* Vehicle Info */}
                    {vehicle && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <FaCar className="text-gray-400" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {vehicle.make} {vehicle.model} ({vehicle.year})
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Registration</p>
                                    <p className="text-gray-900 dark:text-white">{vehicle.registration_number}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Color</p>
                                    <p className="text-gray-900 dark:text-white">{vehicle.color}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Type</p>
                                    <p className="text-gray-900 dark:text-white">{vehicle.vehicle_type}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Status</p>
                                    <p className="text-gray-900 dark:text-white capitalize">{vehicle.status}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inspection Selection */}
                    {inspectionData.length > 1 && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Inspection Session</h4>
                            <div className="relative">
                                <select
                                    value={selectedInspectionIndex}
                                    onChange={(e) => setSelectedInspectionIndex(parseInt(e.target.value))}
                                    className="w-full p-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {inspectionData.map((inspection, index) => {
                                        const overallStatus = getOverallStatus(inspection);
                                        return (
                                            <option key={index} value={index}>
                                                {formatDate(inspection.created_at)} - {overallStatus.text} ({index + 1}/{inspectionData.length})
                                            </option>
                                        );
                                    })}
                                </select>
                                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Inspection Details */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Inspection Details</h4>
                            {currentInspection && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(currentInspection.created_at)}
                                    </span>
                                    {(() => {
                                        const overallStatus = getOverallStatus(currentInspection);
                                        return (
                                            <span className={`text-xs font-medium ${overallStatus.color}`}>
                                                {overallStatus.text}
                                            </span>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <ColorRing visible={true} height="40" width="40" colors={['#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6']} />
                            </div>
                        ) : currentInspection ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {inspectionFields.map(field => {
                                    let images = [];
                                    try {
                                        images = currentInspection[field.key] ? JSON.parse(currentInspection[field.key]) : [];
                                    } catch {
                                        images = [];
                                    }
                                    const status = currentInspection[`is_${field.key}`];
                                    return (
                                        <div key={field.key} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex flex-col gap-2">
                                            <div className="flex items-center gap-2 mb-1 w-full">
                                                {getStatusIcon(status)}
                                                <span className="font-medium text-gray-900 dark:text-white">{field.label}</span>
                                            </div>
                                            <div className="flex gap-4 flex-wrap">
                                                {images.length > 0 ? images.map((img, idx) => (
                                                    <div key={idx} className="relative w-full group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-2 flex flex-col items-center w-36">
                                                        <img
                                                            src={`${ASSETS_URL}${img}`}
                                                            alt={field.label}
                                                            className="w-28 h-20 object-cover rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity mb-2"
                                                            onClick={() => window.open(`${ASSETS_URL}${img}`, '_blank')}
                                                        />
                                                        <div className="flex flex-col items-center gap-1 w-full">
                                                            {getImageStatusBadge(imageStatuses[img]?.status)}
                                                            <div className="flex gap-2 mt-1">
                                                                <button
                                                                    className={`flex items-center gap-1 px-2 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                                                                    disabled={imageStatuses[img]?.loading || imageStatuses[img]?.status === 'approved'}
                                                                    onClick={() => handleApproveReject(img, 'approved')}
                                                                >
                                                                    {imageStatuses[img]?.loading && imageStatuses[img]?.status !== 'rejected' ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className={`flex items-center gap-1 px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                                                                    disabled={imageStatuses[img]?.loading || imageStatuses[img]?.status === 'rejected'}
                                                                    onClick={() => handleApproveReject(img, 'rejected')}
                                                                >
                                                                    {imageStatuses[img]?.loading && imageStatuses[img]?.status !== 'approved' ? <FaSpinner className="animate-spin" /> : <FaTimesIcon />}
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">No image</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : inspectionData.length === 0 ? (
                            <div className="text-gray-500 dark:text-gray-400">No inspection data found for this vehicle.</div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400">Select an inspection session to view details.</div>
                        )}
                    </div>

                    {/* Inspection Summary */}
                    {currentInspection && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Inspection Summary</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                {(() => {
                                    const statusFields = inspectionFields.map(field => currentInspection[`is_${field.key}`]);
                                    const passedCount = statusFields.filter(status => status === 1).length;
                                    const failedCount = statusFields.filter(status => status === 0).length;
                                    const pendingCount = statusFields.filter(status => status === null || status === undefined).length;
                                    return (
                                        <>
                                            <div className="text-center">
                                                <div className="text-green-600 font-semibold">{passedCount}</div>
                                                <div className="text-gray-500 dark:text-gray-400">Passed</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-red-600 font-semibold">{failedCount}</div>
                                                <div className="text-gray-500 dark:text-gray-400">Failed</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-yellow-600 font-semibold">{pendingCount}</div>
                                                <div className="text-gray-500 dark:text-gray-400">Pending</div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 py-2 px-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        disabled={isProcessing}
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
};

InspectionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    vehicle: PropTypes.object,
    isProcessing: PropTypes.bool
};

export default InspectionModal;
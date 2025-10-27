import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaCar, FaChevronDown } from 'react-icons/fa';
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
    const [submitting, setSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});


    console.log('inspectionData', vehicle);

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
    }, [isOpen, vehicle, user?.token]);

    // Fetch image statuses when inspection data changes
    useEffect(() => {
        if (inspectionData.length > 0) {
            const newStatuses = {};
            const newSelectedActions = {};
            inspectionData.forEach((inspection) => {
                inspectionFields.forEach(field => {
                    let fieldImages = [];
                    try {
                        fieldImages = inspection[field.key] ? JSON.parse(inspection[field.key]) : [];
                    } catch {
                        fieldImages = [];
                    }
                    const fieldState = inspection[`is_${field.key}`];
                    const statusForField = fieldState === 1 ? 'approved' : fieldState === 0 ? 'rejected' : 'pending';
                    fieldImages.forEach((img) => {
                        newStatuses[img] = { status: statusForField, loading: false };
                        if (!newSelectedActions[img]) newSelectedActions[img] = statusForField;
                    });
                });
            });
            setImageStatuses(newStatuses);
        }
    }, [inspectionData]);

    // Initialize field status form data when selection changes
    useEffect(() => {
        const current = inspectionData[selectedInspectionIndex];
        const next = {};
        inspectionFields.forEach((f) => {
            const key = `is_${f.key}`;
            const val = current ? current[key] : null;
            next[key] = (val === 0 || val === 1) ? val : null;
        });
        setFormData(next);
    }, [inspectionData, selectedInspectionIndex]);

    // per-image controls removed; component-level controls are used

    const handleFieldStatusChange = (fieldKey, value) => {
        setFormData(prev => ({ ...prev, [`is_${fieldKey}`]: value }));
        setIsEditMode(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Build payload containing all is_* fields
            const payload = {};
            inspectionFields.forEach((f) => {
                const key = `is_${f.key}`;
                payload[key] = formData[key];
            });

            await axios.post(
                `${API_URL}admin/vehicles/approve-inspection/${vehicle.id}`,
                payload,
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            triggerToast('Inspection submitted successfully', 'success');
            setIsEditMode(false);
            // Reflect new values locally to update UI instantly
            setInspectionData((prev) => {
                const copy = [...prev];
                if (copy[selectedInspectionIndex]) {
                    inspectionFields.forEach((f) => {
                        const key = `is_${f.key}`;
                        copy[selectedInspectionIndex][key] = payload[key];
                    });
                }
                return copy;
            });
            // Recompute image status badges based on updated values
            const current = inspectionData[selectedInspectionIndex];
            if (current) {
                const updated = {};
                inspectionFields.forEach((field) => {
                    const imgs = (() => { try { return current[field.key] ? JSON.parse(current[field.key]) : []; } catch { return []; } })();
                    const st = payload[`is_${field.key}`];
                    const statusForField = st === 1 ? 'approved' : st === 0 ? 'rejected' : 'pending';
                    imgs.forEach((img) => { updated[img] = { status: statusForField, loading: false }; });
                });
                setImageStatuses(updated);
            }
        } catch {
            triggerToast('Failed to submit inspection', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const allOptionsSelected = () => {
        return inspectionFields.every((f) => {
            const key = `is_${f.key}`;
            const val = formData[key];
            return val === 0 || val === 1;
        });
    };

    const getImageStatusBadge = (status) => {
        if (status === 'approved') return <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block">Approved</span>;
        if (status === 'rejected') return <span className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block">Rejected</span>;
        return <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block">Pending</span>;
    };

    const handleClose = () => {
        setIsEditMode(false);
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
                className="fixed inset-0 flex flex-col items-center justify-center z-40 p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-30"
            >
                <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="relative flex items-center justify-between pb-3 px-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                                <FaCar className="text-blue-600 dark:text-blue-400 text-sm" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Vehicle Inspection</h2>
                                {vehicle && (
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                        {vehicle.make} {vehicle.model} - {vehicle.registration_number}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all"
                            disabled={isProcessing}
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden flex">
                        {/* Left Sidebar - Information */}
                        <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                            <div className="p-3 space-y-3">
                                {/* Vehicle Info */}
                                {vehicle && (
                                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Vehicle Details</h4>
                                        <div className="space-y-2">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Year</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{vehicle.year}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Color</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{vehicle.color}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Type</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{vehicle.vehicle_type}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Inspection Selection */}
                                {inspectionData.length > 1 && (
                                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Inspection Session</h4>
                                        <div className="relative">
                                            <select
                                                value={selectedInspectionIndex}
                                                onChange={(e) => {
                                                    setSelectedInspectionIndex(parseInt(e.target.value));
                                                    setIsEditMode(false);
                                                }}
                                                className="w-full p-1.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
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
                                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                                        </div>
                                    </div>
                                )}

                                {/* Inspection Date and Status */}
                                {currentInspection && (
                                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Inspection Info</h4>
                                        <div className="space-y-2">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Date</p>
                                                <p className="text-xs text-gray-900 dark:text-white">{formatDate(currentInspection.created_at)}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
                                                {(() => {
                                                    const overallStatus = getOverallStatus(currentInspection);
                                                    return (
                                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${overallStatus.status === 'passed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                                overallStatus.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                            }`}>
                                                            {overallStatus.text}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Inspection Summary */}
                                {currentInspection && (
                                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                                        <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">Summary</h4>
                                        <div className="space-y-2">
                                            {(() => {
                                                const statusFields = inspectionFields.map(field => currentInspection[`is_${field.key}`]);
                                                const passedCount = statusFields.filter(status => status === 1).length;
                                                const failedCount = statusFields.filter(status => status === 0).length;
                                                const pendingCount = statusFields.filter(status => status === null || status === undefined).length;
                                                return (
                                                    <>
                                                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                                            <div className="flex items-center gap-1.5">
                                                                <FaCheckCircle className="text-green-600 text-sm" />
                                                                <span className="text-xs font-medium text-green-700 dark:text-green-400">Accepted</span>
                                                            </div>
                                                            <span className="text-base font-bold text-green-600 dark:text-green-400">{passedCount}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                                            <div className="flex items-center gap-1.5">
                                                                <FaTimesCircle className="text-red-600 text-sm" />
                                                                <span className="text-xs font-medium text-red-700 dark:text-red-400">Rejected</span>
                                                            </div>
                                                            <span className="text-base font-bold text-red-600 dark:text-red-400">{failedCount}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                                                            <div className="flex items-center gap-1.5">
                                                                <FaCalendarAlt className="text-yellow-600 text-sm" />
                                                                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Pending</span>
                                                            </div>
                                                            <span className="text-base font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Content - Inspection Items */}
                        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
                            <div className="p-3">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Inspection Components</h4>
                                    {currentInspection && !isEditMode && (
                                        <button
                                            onClick={() => {
                                                // Enter edit mode with no preselected values
                                                const cleared = {};
                                                inspectionFields.forEach((f) => { cleared[`is_${f.key}`] = null; });
                                                setFormData(cleared);
                                                setIsEditMode(true);
                                            }}
                                            className="px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {currentInspection && isEditMode && (
                                        <button
                                            onClick={() => setIsEditMode(false)}
                                            className="px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center py-6">
                                        <ColorRing visible={true} height="28" width="28" colors={['#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6']} />
                                    </div>
                                ) : currentInspection ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {inspectionFields.map(field => {
                                                let images = [];
                                                try {
                                                    images = currentInspection[field.key] ? JSON.parse(currentInspection[field.key]) : [];
                                                } catch {
                                                    images = [];
                                                }
                                                const status = currentInspection[`is_${field.key}`];
                                                return (
                                                    <div key={field.key} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-2 py-1.5 border-b border-gray-200 dark:border-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <div className="text-xs">{getStatusIcon(status)}</div>
                                                                <span className="font-semibold text-xs text-gray-900 dark:text-white truncate">{field.label}</span>
                                                            </div>
                                                        </div>
                                                        <div className="p-1.5 space-y-1.5">
                                                            {isEditMode && (
                                                                <div className="flex gap-1">
                                                                    <label className={`flex-1 flex items-center justify-center gap-0.5 py-1 px-1.5 rounded-md cursor-pointer border transition-all ${formData[`is_${field.key}`] === 1
                                                                        ? 'bg-green-500 border-green-500 text-white shadow-sm'
                                                                        : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                                                                        }`}>
                                                                        <input
                                                                            type="radio"
                                                                            name={`field-${field.key}`}
                                                                            value="1"
                                                                            checked={formData[`is_${field.key}`] === 1}
                                                                            onChange={() => handleFieldStatusChange(field.key, 1)}
                                                                            className="hidden"
                                                                            disabled={submitting}
                                                                        />
                                                                        <FaCheckCircle className={`text-xs ${formData[`is_${field.key}`] === 1 ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                                                        <span className={`text-xs font-semibold ${formData[`is_${field.key}`] === 1 ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Approve</span>
                                                                    </label>
                                                                    <label className={`flex-1 flex items-center justify-center gap-0.5 py-1 px-1.5 rounded-md cursor-pointer border transition-all ${formData[`is_${field.key}`] === 0
                                                                        ? 'bg-red-500 border-red-500 text-white shadow-sm'
                                                                        : 'bg-gray-50 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700'
                                                                        }`}>
                                                                        <input
                                                                            type="radio"
                                                                            name={`field-${field.key}`}
                                                                            value="0"
                                                                            checked={formData[`is_${field.key}`] === 0}
                                                                            onChange={() => handleFieldStatusChange(field.key, 0)}
                                                                            className="hidden"
                                                                            disabled={submitting}
                                                                        />
                                                                        <FaTimesCircle className={`text-xs ${formData[`is_${field.key}`] === 0 ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                                                        <span className={`text-xs font-semibold ${formData[`is_${field.key}`] === 0 ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Reject</span>
                                                                    </label>
                                                                </div>
                                                            )}
                                                            
                                                            {images.length > 0 ? images.map((img, idx) => (
                                                                <div key={idx} className="space-y-1.5">
                                                                    <div className="relative group">
                                                                        <img
                                                                            src={`${ASSETS_URL}${img}`}
                                                                            alt={field.label}
                                                                            className="w-full h-28 object-cover rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                                                                            onClick={() => window.open(`${ASSETS_URL}${img}`, '_blank')}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-md transition-all pointer-events-none" />
                                                                    </div>
                                                                    {!isEditMode && getImageStatusBadge(imageStatuses[img]?.status)}
                                                                    
                                                                </div>
                                                            )) : (
                                                                <div className="text-center py-3">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">No image</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </form>
                                ) : inspectionData.length === 0 ? (
                                    <div className="text-center py-6">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 mb-1.5">
                                            <FaCar className="text-gray-400 text-base" />
                                        </div>
                                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-0.5">No Inspection Data</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">No inspection data found for this vehicle.</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-1.5">
                                            <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-base" />
                                        </div>
                                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-0.5">Select an Inspection</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Choose an inspection session above to view details.</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center px-3 pt-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isEditMode ? 'Review and submit your decision' : 'Click Edit to modify inspection'}
                        </p>
                        <div className="flex gap-1.5">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                disabled={isProcessing || submitting}
                            >
                                Close
                            </button>
                            {currentInspection && isEditMode && (
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={submitting || !allOptionsSelected()}
                                    className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    {submitting ? (
                                        <>
                                            <ColorRing visible={true} height="12" width="12" colors={['#fff', '#fff', '#fff', '#fff', '#fff']} />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="text-xs" />
                                            <span>Submit Inspection</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
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

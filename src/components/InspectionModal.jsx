import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaCar, FaEye, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { ColorRing } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';

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
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [allImages, setAllImages] = useState([]);

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
                    
                    // Prepare all images for lightbox
                    const images = [];
                    inspections.forEach((inspection, inspectionIndex) => {
                        inspectionFields.forEach(field => {
                            let fieldImages = [];
                            try {
                                fieldImages = inspection[field.key] ? JSON.parse(inspection[field.key]) : [];
                            } catch {
                                fieldImages = [];
                            }
                            fieldImages.forEach((img, imgIndex) => {
                                images.push({
                                    src: `${ASSETS_URL}${img}`,
                                    alt: `${field.label} - ${inspectionIndex + 1}`,
                                    field: field.label,
                                    inspectionIndex,
                                    originalIndex: imgIndex
                                });
                            });
                        });
                    });
                    setAllImages(images);
                })
                .catch(() => {
                    setInspectionData([]);
                    setSelectedInspectionIndex(0);
                    setAllImages([]);
                })
                .finally(() => setLoading(false));
        } else {
            setInspectionData([]);
            setSelectedInspectionIndex(0);
            setAllImages([]);
        }
    }, [isOpen, vehicle]);

    const handleClose = () => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
        onClose();
    };

    const openImageLightbox = (imageSrc, fieldLabel, inspectionIndex, imgIndex) => {
        console.log('Opening lightbox:', { imageSrc, fieldLabel, inspectionIndex, imgIndex });
        console.log('All images:', allImages);
        
        // Simple approach: just set the selected image directly
        setSelectedImage(imageSrc);
        
        // Find the image index in allImages array
        const foundIndex = allImages.findIndex(img => img.src === imageSrc);
        setSelectedImageIndex(foundIndex >= 0 ? foundIndex : 0);
    };

    const closeImageLightbox = () => {
        console.log('Closing lightbox');
        setSelectedImage(null);
        setSelectedImageIndex(0);
    };

    const navigateImage = (direction) => {
        if (allImages.length === 0) return;
        
        let newIndex;
        if (direction === 'next') {
            newIndex = (selectedImageIndex + 1) % allImages.length;
        } else {
            newIndex = selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1;
        }
        setSelectedImageIndex(newIndex);
        setSelectedImage(allImages[newIndex].src);
    };

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
                className="fixed inset-0 flex flex-col items-stretch justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
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
                <div className="p-4 space-y-6 bg-white dark:bg-gray-800 max-h-[80vh] overflow-y-auto">
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
                                            <div className="flex items-center gap-2 mb-1">
                                                {getStatusIcon(status)}
                                                <span className="font-medium text-gray-900 dark:text-white">{field.label}</span>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {images.length > 0 ? images.map((img, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img
                                                            src={`${ASSETS_URL}${img}`}
                                                            alt={field.label}
                                                            className="w-28 h-20 object-cover rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={() => openImageLightbox(`${ASSETS_URL}${img}`, field.label, selectedInspectionIndex, idx)}
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                                                            <FaEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-lg" />
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

                    {/* (Optional) Add inspection status/notes form here if needed */}
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

            {/* Image Lightbox */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90"
                    onClick={closeImageLightbox}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeImageLightbox}
                            className="absolute top-2 right-2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <FaTimes size={20} />
                        </button>

                        {/* Navigation buttons */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage('prev');
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage('next');
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
                                >
                                    <FaChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        <img
                            src={selectedImage}
                            alt={allImages[selectedImageIndex]?.alt || 'Inspection Image'}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Image info */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg text-sm">
                                {selectedImageIndex + 1} of {allImages.length} - {allImages[selectedImageIndex]?.field}
                            </div>
                        )}
                    </div>
                </div>
            )}
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
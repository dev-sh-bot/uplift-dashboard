import { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaCar } from 'react-icons/fa';

const InspectionModal = ({
    isOpen,
    onClose,
    vehicle,
    isProcessing = false
}) => {
    const [inspectionNotes, setInspectionNotes] = useState('');
    const [inspectionStatus, setInspectionStatus] = useState('pending');

    const handleSubmit = async () => {
        try {
            // TODO: Implement inspection submission API
            console.log('Submitting inspection:', {
                vehicleId: vehicle?.id,
                status: inspectionStatus,
                notes: inspectionNotes
            });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            onClose();
        } catch (error) {
            console.error('Error submitting inspection:', error);
        }
    };

    const handleClose = () => {
        setInspectionNotes('');
        setInspectionStatus('pending');
        onClose();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed':
                return <FaCheckCircle className="text-green-600" />;
            case 'failed':
                return <FaTimesCircle className="text-red-600" />;
            default:
                return <FaCalendarAlt className="text-yellow-600" />;
        }
    };

    return (
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
            <div className="p-4 space-y-6 bg-white dark:bg-gray-800">
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

                {/* Inspection Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Inspection Status
                    </label>
                    <div className="space-y-2">
                        {[
                            { value: 'passed', label: 'Passed', color: 'text-green-600' },
                            { value: 'failed', label: 'Failed', color: 'text-red-600' },
                            { value: 'pending', label: 'Pending Review', color: 'text-yellow-600' }
                        ].map((option) => (
                            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="inspectionStatus"
                                    value={option.value}
                                    checked={inspectionStatus === option.value}
                                    onChange={(e) => setInspectionStatus(e.target.value)}
                                    className="text-primary-600 focus:ring-primary-500"
                                    disabled={isProcessing}
                                />
                                <span className={`font-medium ${option.color}`}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Inspection Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Inspection Notes
                    </label>
                    <textarea
                        value={inspectionNotes}
                        onChange={(e) => setInspectionNotes(e.target.value)}
                        placeholder="Enter inspection details, findings, or recommendations..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows="4"
                        disabled={isProcessing}
                    />
                </div>

                {/* Inspection History (Mock Data) */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Inspections</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {getStatusIcon('passed')}
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Passed</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">All systems checked and verified</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {getStatusIcon('failed')}
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Failed</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Brake system needs attention</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">1 week ago</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 py-2 px-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    disabled={isProcessing}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-700 border border-transparent rounded-md hover:bg-primary-700 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isProcessing ? 'Submitting...' : 'Submit Inspection'}
                </button>
            </div>
        </Modal>
    );
};

InspectionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    vehicle: PropTypes.object,
    isProcessing: PropTypes.bool
};

export default InspectionModal; 
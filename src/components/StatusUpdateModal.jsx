import { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

const StatusUpdateModal = ({
    isOpen,
    onClose,
    onConfirm,
    currentStatus,
    riderName,
    isProcessing = false
}) => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [suspensionReason, setSuspensionReason] = useState('');
    const [errors, setErrors] = useState({});

    const statusOptions = [
        { value: 'approved', label: 'Approved', color: 'text-green-600' },
        { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
        { value: 'suspended', label: 'Suspended', color: 'text-red-600' }
    ];

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setSuspensionReason('');
        setErrors({});
    };

    const handleSubmit = async () => {
        const newErrors = {};

        if (!selectedStatus) {
            newErrors.status = 'Please select a status';
        }

        if (selectedStatus === 'suspended' && !suspensionReason.trim()) {
            newErrors.reason = 'Reason is required for suspension';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // If status is being changed to suspended, we need to send email
        if (selectedStatus === 'suspended') {
            try {
                // TODO: Replace with actual email API endpoint
                // await axios.post(`${API_URL}admin/send-suspension-email`, {
                //     rider_id: riderId,
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

        onConfirm(selectedStatus, suspensionReason);
    };

    const handleClose = () => {
        setSelectedStatus('');
        setSuspensionReason('');
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Update Rider Status"
            className="fixed inset-0 flex flex-col items-stretch justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            {/* Header */}
            <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Rider Status</h2>
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
                {/* Rider Info */}
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Update status for</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{riderName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current status: {currentStatus}</p>
                </div>

                {/* Status Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Select New Status
                    </label>
                    <div className="space-y-2">
                        {statusOptions.map((option) => (
                            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value={option.value}
                                    checked={selectedStatus === option.value}
                                    onChange={() => handleStatusChange(option.value)}
                                    className="text-primary-600 focus:ring-primary-500"
                                    disabled={isProcessing}
                                />
                                <span className={`font-medium ${option.color}`}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.status && (
                        <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                    )}
                </div>

                {/* Suspension Reason */}
                {selectedStatus === 'suspended' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Suspension Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={suspensionReason}
                            onChange={(e) => setSuspensionReason(e.target.value)}
                            placeholder="Please provide a reason for suspension..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            rows="4"
                            disabled={isProcessing}
                        />
                        {errors.reason && (
                            <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
                        )}
                    </div>
                )}

                {/* Warning for Suspension */}
                {selectedStatus === 'suspended' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                        <p className="text-red-800 dark:text-red-200 text-sm">
                            <strong>Warning:</strong> Suspending a rider will prevent them from accepting new rides.
                            This action can be reversed later.
                        </p>
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
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isProcessing || !selectedStatus}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-700 border border-transparent rounded-md hover:bg-primary-700 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isProcessing ? 'Updating...' : 'Update Status'}
                </button>
            </div>
        </Modal>
    );
};

StatusUpdateModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    currentStatus: PropTypes.string.isRequired,
    riderName: PropTypes.string.isRequired,
    isProcessing: PropTypes.bool
};

export default StatusUpdateModal; 
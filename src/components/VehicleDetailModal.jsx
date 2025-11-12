import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { FaTimes, FaCar } from 'react-icons/fa';
import axios from 'axios';
import { ASSETS_URL, API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { triggerToast } from '../utils/helper';
import { useState } from 'react';

const labelClass = 'text-xs flex items-center gap-2 font-semibold uppercase tracking-wide text-gray-500 dark:text-facebook-textSecondary';
const valueClass = 'text-base font-medium text-gray-900 dark:text-facebook-text';

const VehicleDetailModal = ({ isOpen, onClose, vehicle, riderId, onStatusChange }) => {
  const user = useSelector(selectUser);
  const [isUpdating, setIsUpdating] = useState(false);
  if (!vehicle) return null;

  // Parse images if present
  let photos = [];
  try {
    photos = vehicle.photos ? JSON.parse(vehicle.photos) : [];
  } catch {
    photos = [];
  }

  const handleStatusUpdate = async (status) => {
    try {
      setIsUpdating(true);
      const response = await axios.put(
        `${API_URL}admin/riders/approved/${riderId}/${status}`,
        { reason: '' },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        triggerToast(`Rider status updated to ${status}`, 'success');
        if (onStatusChange) {
          onStatusChange();
        }
        onClose();
      }
    } catch (error) {
      console.error('Error updating rider status:', error);
      triggerToast(error.response?.data?.message || 'Failed to update rider status', 'error');
    } finally {
      setIsUpdating(false);
    }
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Vehicle Details"
      className="fixed inset-0 flex flex-col items-stretch justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <FaTimes size={20} />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 shadow-md">
            <FaCar />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-facebook-text mb-1 flex items-center gap-2">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h2>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
              {vehicle.vehicle_type}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-between gap-2"><span className={labelClass}>Registration:</span><span className={valueClass}>{vehicle.registration_number}</span></div>
          <div className="flex items-center justify-between gap-2"><span className={labelClass}>Color:</span><span className={valueClass}>{vehicle.color}</span></div>
          <div className="flex items-center justify-between gap-2"><span className={labelClass}>Active:</span><span className={valueClass}>{vehicle.is_active}</span></div>
          <div className="flex items-center justify-between gap-2"><span className={labelClass}>Is Driving:</span><span className={valueClass}>{vehicle.is_driving}</span></div>
          <div className="flex items-center justify-between gap-2"><span className={labelClass}>Created At:</span><span className={valueClass}>{formatDate(vehicle.created_at)}</span></div>
          <div className="flex items-center justify-between gap-2"><span className={labelClass}>Updated At:</span><span className={valueClass}>{formatDate(vehicle.updated_at)}</span></div>
          <div className="flex items-center justify-between gap-2"><span className={labelClass}>Approved At:</span><span className={valueClass}>{vehicle.approved_at ? formatDate(vehicle.approved_at) : 'Pending'}</span></div>
          <div className="flex items-center justify-between gap-2"><span className={labelClass}>Approved By:</span><span className={valueClass}>{vehicle.approved_by || 'Pending'}</span></div>
          {vehicle.registration_certificate && (
            <div className="flex flex-col col-span-2">
              <span className={labelClass}>Registration Certificate:</span>
              <img src={`${ASSETS_URL}${vehicle.registration_certificate}`} alt="Registration Certificate" className="w-full h-32 object-contain rounded border mt-1" />
            </div>
          )}
          {vehicle.vehicle_insurance && (
            <div className="flex flex-col col-span-2">
              <span className={labelClass}>Vehicle Insurance:</span>
              <img src={`${ASSETS_URL}${vehicle.vehicle_insurance}`} alt="Vehicle Insurance" className="w-full h-32 object-contain rounded border mt-1" />
            </div>
          )}
          {photos.length > 0 && (
            <div className="flex flex-col col-span-2">
              <span className={labelClass}>Photos:</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                {photos.map((img, idx) => (
                  <img key={idx} src={`${ASSETS_URL}${img}`} alt={`Vehicle Photo ${idx + 1}`} className="w-24 h-20 object-cover rounded border" />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-6 gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate('approved')}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Updating...' : 'Approved'}
            </button>
            <button
              onClick={() => handleStatusUpdate('pending')}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-yellow-600 rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Updating...' : 'Pending'}
            </button>
            <button
              onClick={() => handleStatusUpdate('suspended')}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Updating...' : 'Suspended'}
            </button>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

VehicleDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vehicle: PropTypes.object,
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onStatusChange: PropTypes.func,
};

export default VehicleDetailModal; 
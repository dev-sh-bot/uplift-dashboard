import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
];

const SurgeRateCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}admin/list/vehicle-type-rates`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setVehicleTypes(response.data);
      } catch (error) {
        console.log(error);
        triggerToast('Failed to fetch vehicle types', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleTypes();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`${API_URL}admin/surge-rates`, data, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.status === 201 || response.status === 200) {
        triggerToast('Surge rate created successfully', 'success');
        navigate(-1);
      }
    } catch (error) {
      triggerToast(error.response?.data?.message || 'Failed to create surge rate', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          colors={['#8484c1', '#8484c1', '#8484c1', '#8484c1', '#8484c1']}
        />
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="page-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              Basic Information
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('vehicle_type_rate_id', { required: 'Vehicle type is required' })}
                  className="form-input"
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.title}</option>
                  ))}
                </select>
                {errors.vehicle_type_rate_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicle_type_rate_id.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    {...register('start_time', { required: 'Start time is required' })}
                    className="form-input"
                  />
                  {errors.start_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    {...register('end_time', { required: 'End time is required' })}
                    className="form-input"
                  />
                  {errors.end_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.end_time.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Surge Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('surge_rate', { required: 'Surge rate is required', min: 0 })}
                    className="form-input"
                    placeholder="e.g. 2.3"
                  />
                  {errors.surge_rate && (
                    <p className="text-red-500 text-sm mt-1">{errors.surge_rate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Day of Week <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('day_of_week', { required: 'Day of week is required' })}
                    className="form-input"
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                  {errors.day_of_week && (
                    <p className="text-red-500 text-sm mt-1">{errors.day_of_week.message}</p>
                  )}
                </div>
              </div>
              {/* Form Actions for mobile */}
              <div className="flex lg:hidden justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-facebook-text bg-gray-100 dark:bg-facebook-surface border border-gray-300 dark:border-facebook-border rounded-xl hover:bg-gray-200 dark:hover:bg-facebook-hover transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Surge Rate'}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-6 hidden lg:block">
          <div className="page-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4 flex items-center">
              <div className="w-1 h-6 bg-gray-600 rounded-full mr-3"></div>
              Actions
            </h2>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                onClick={handleSubmit(onSubmit)}
              >
                {isSubmitting ? 'Creating...' : 'Create Surge Rate'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-facebook-text bg-gray-100 dark:bg-facebook-surface border border-gray-300 dark:border-facebook-border rounded-xl hover:bg-gray-200 dark:hover:bg-facebook-hover transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeRateCreate; 
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { triggerToast } from '../utils/helper';
import { useNavigate, useLocation } from 'react-router-dom';

const daysOfWeek = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
];

const SurgeRateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleTypeRate, setVehicleTypeRate] = useState(null);
  const location = useLocation();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  
  const vehicleTypeRateData = location.state?.vehicleTypeRate;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  useEffect(() => {
    if (vehicleTypeRateData) {
      setVehicleTypeRate(vehicleTypeRateData);
    }
  }, [vehicleTypeRateData]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        vehicle_type_rate_id: vehicleTypeRate?.id
      };
      const response = await axios.post(`${API_URL}admin/surge-rates`, payload, {
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

  return (
    <div className="page-section">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="page-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              Create Surge Rate for {vehicleTypeRate?.title || 'Vehicle Type'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {vehicleTypeRate && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600 dark:text-blue-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Creating surge rate for: {vehicleTypeRate.title}
                      </h3>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Base Price: {vehicleTypeRate.base_price} | Per KM: {vehicleTypeRate.price_per_km} | Per Min: {vehicleTypeRate.price_per_min}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                  <Controller
                    name="day_of_week"
                    control={control}
                    rules={{
                      validate: value => (value && value.length > 0) || 'At least one day is required',
                    }}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-3">
                        {daysOfWeek.map((d) => (
                          <label key={d.value} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-facebook-textSecondary">
                            <input
                              type="checkbox"
                              value={d.value}
                              checked={field.value?.includes(d.value) || false}
                              onChange={e => {
                                const checked = e.target.checked;
                                let newValue = Array.isArray(field.value) ? [...field.value] : [];
                                if (checked) {
                                  newValue.push(d.value);
                                } else {
                                  newValue = newValue.filter(val => val !== d.value);
                                }
                                field.onChange(newValue);
                              }}
                              className="form-checkbox rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-facebook-border"
                            />
                            {d.label}
                          </label>
                        ))}
                      </div>
                    )}
                  />
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

export default SurgeRateForm; 
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import { FaUpload, FaArrowLeft, FaTimes, FaSync } from 'react-icons/fa';
import { useGlobalData } from '../hooks/useGlobalData';

const VehicleTypeRateForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedIcon, setUploadedIcon] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const {
        countries,
        states,
        getCitiesByState,
        countriesLoading,
        statesLoading,
        loadCountries,
        loadStatesByCountry,
        loadAllStates
    } = useGlobalData();

    console.log('VehicleTypeRateForm: Global data state:', {
        countriesCount: countries.length,
        statesCount: states.length,
        countriesLoading,
        statesLoading
    });

    // Load countries on component mount
    useEffect(() => {
        if (countries.length === 0) {
            loadCountries();
        }
    }, [countries.length, loadCountries]);

    const handleRefreshGlobalData = async () => {
        console.log('Manually refreshing global data...');
        await loadCountries();
        await loadAllStates();
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm();

    const selectedCountryId = watch('country_id');
    const selectedStateId = watch('state_id');

    // Get states and cities based on selection
    const availableStates = states; // States are already filtered by country when loaded
    const availableCities = selectedStateId ? getCitiesByState(selectedStateId) : [];

    // Load states when country changes
    useEffect(() => {
        if (selectedCountryId) {
            loadStatesByCountry(selectedCountryId);
        }
    }, [selectedCountryId, loadStatesByCountry]);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedIcon(file);
            const reader = new FileReader();
            reader.onload = () => {
                setIconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        maxFiles: 1,
        maxSize: 5242880 // 5MB
    });

    const removeIcon = () => {
        setUploadedIcon(null);
        setIconPreview(null);
        setValue('icon', null);
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            const formData = new FormData();

            // Add all form fields to FormData
            formData.append('title', data.title);
            formData.append('booking_fee', data.booking_fee);
            formData.append('base_price', data.base_price);
            formData.append('price_per_km', data.price_per_km);
            formData.append('price_per_min', data.price_per_min);
            formData.append('country_id', data.country_id);
            formData.append('state_id', data.state_id);
            formData.append('city_id', data.city_id);
            formData.append('description', data.description || '');
            formData.append('ride_charge', data.ride_charge || '0');

            // Add icon file if uploaded
            if (uploadedIcon) {
                formData.append('icon', uploadedIcon);
            }

            const response = await axios.post(`${API_URL}admin/vehicle-type-rates`, formData, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201 || response.status === 200) {
                triggerToast('Vehicle type rate created successfully', 'success');
                navigate('/vehicle-type-rates');
            }
        } catch (error) {
            console.error('Error creating vehicle type rate:', error);
            triggerToast(error.response?.data?.message || 'Failed to create vehicle type rate', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-section">
            {/* Header */}
            <div className="page-header mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/vehicle-type-rates')}
                        className="p-2 text-gray-600 dark:text-facebook-textSecondary hover:text-gray-900 dark:hover:text-facebook-text hover:bg-gray-100 dark:hover:bg-facebook-hover rounded-xl transition-colors"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="page-title">Add Vehicle Type Rate</h1>
                        <p className="page-subtitle mt-1">Create a new vehicle type with pricing information</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="page-card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4 flex items-center">
                            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('title', { required: 'Title is required' })}
                                    className="form-input"
                                    placeholder="Enter vehicle type title"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    Description
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows="3"
                                    className="form-textarea"
                                    placeholder="Enter description (optional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="page-card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4 flex items-center">
                            <div className="w-1 h-6 bg-green-600 rounded-full mr-3"></div>
                            Pricing Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    Base Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('base_price', {
                                        required: 'Base price is required',
                                        min: { value: 0, message: 'Base price must be positive' }
                                    })}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                                {errors.base_price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.base_price.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    Price per Kilometer <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price_per_km', {
                                        required: 'Price per km is required',
                                        min: { value: 0, message: 'Price per km must be positive' }
                                    })}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                                {errors.price_per_km && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price_per_km.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    Price per Minute <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price_per_min', {
                                        required: 'Price per minute is required',
                                        min: { value: 0, message: 'Price per minute must be positive' }
                                    })}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                                {errors.price_per_min && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price_per_min.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    Booking Fee <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('booking_fee', {
                                        required: 'Booking fee is required',
                                        min: { value: 0, message: 'Booking fee must be positive' }
                                    })}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                                {errors.booking_fee && (
                                    <p className="text-red-500 text-sm mt-1">{errors.booking_fee.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    Ride Charge
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('ride_charge', {
                                        min: { value: 0, message: 'Ride charge must be positive' }
                                    })}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                                {errors.ride_charge && (
                                    <p className="text-red-500 text-sm mt-1">{errors.ride_charge.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="page-card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4 flex items-center">
                            <div className="w-1 h-6 bg-purple-600 rounded-full mr-3"></div>
                            Location Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('country_id', {
                                        required: 'Country is required',
                                        onChange: () => {
                                            setValue('state_id', '');
                                            setValue('city_id', '');
                                        }
                                    })}
                                    className="form-input"
                                    disabled={countriesLoading}
                                >
                                    <option value="">
                                        {countriesLoading ? 'Loading countries...' : 'Select Country'}
                                    </option>
                                    {countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.country_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.country_id.message}</p>
                                )}
                                {countries.length === 0 && !countriesLoading && (
                                    <div className="mt-2">
                                        <p className="text-red-500 text-sm">No countries available</p>
                                        <button
                                            type="button"
                                            onClick={handleRefreshGlobalData}
                                            className="mt-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                        >
                                            <FaSync size={10} />
                                            <span>Retry</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('state_id', {
                                        required: 'State is required',
                                        onChange: () => {
                                            setValue('city_id', '');
                                        }
                                    })}
                                    className="form-input"
                                    disabled={!selectedCountryId || statesLoading}
                                >
                                    <option value="">
                                        {!selectedCountryId ? 'Select Country First' :
                                            statesLoading ? 'Loading states...' : 'Select State'}
                                    </option>
                                    {availableStates.map((state) => (
                                        <option key={state.id} value={state.id}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.state_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.state_id.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('city_id', {
                                        required: 'City is required'
                                    })}
                                    className="form-input"
                                    disabled={!selectedStateId}
                                >
                                    <option value="">Select City</option>
                                    {availableCities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.city_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.city_id.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Icon Upload */}
                    <div className="page-card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4 flex items-center">
                            <div className="w-1 h-6 bg-orange-600 rounded-full mr-3"></div>
                            Vehicle Icon
                        </h2>

                        {!iconPreview ? (
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragActive
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-300 dark:border-facebook-border hover:border-gray-400 dark:hover:border-facebook-textSecondary'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <FaUpload className="mx-auto h-8 w-8 text-gray-400 dark:text-facebook-textSecondary mb-3" />
                                <p className="text-sm text-gray-600 dark:text-facebook-textSecondary">
                                    {isDragActive
                                        ? 'Drop the icon here...'
                                        : 'Drag & drop an icon here, or click to select'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-facebook-textMuted mt-2">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={iconPreview}
                                    alt="Icon preview"
                                    className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-facebook-border"
                                />
                                <button
                                    type="button"
                                    onClick={removeIcon}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
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
                                {isSubmitting ? (
                                    <>
                                        <ColorRing
                                            visible={true}
                                            height="16"
                                            width="16"
                                            colors={['#ffffff', "#ffffff", "#ffffff", "#ffffff", "#ffffff"]}
                                        />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <span>Create Vehicle Type Rate</span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/vehicle-type-rates')}
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

export default VehicleTypeRateForm; 
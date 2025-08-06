import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import { FaUpload, FaTimes } from 'react-icons/fa';

const VehicleTypeForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedIcon, setUploadedIcon] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const { id } = useParams();
    const isEditMode = !!id;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    // Fetch existing data if editing
    useEffect(() => {
        if (isEditMode) {
            (async () => {
                try {
                    setIsSubmitting(true);
                    const response = await axios.get(`${API_URL}admin/vehicle-type/${id}`, {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    });
                    const data = response.data.data;
                    setValue('title', data.title);
                    setValue('description', data.description || '');
                    if (data.icon) {
                        setIconPreview(`${ASSETS_URL}${data.icon}`);
                    }
                } catch (error) {
                    console.error('Error fetching vehicle type:', error);
                    triggerToast('Failed to fetch vehicle type', 'error');
                } finally {
                    setIsSubmitting(false);
                }
            })();
        }
    }, [isEditMode, id, setValue, user]);

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
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description || '');

            // Add icon file if uploaded
            if (uploadedIcon) {
                formData.append('icon', uploadedIcon);
            }

            let response;
            if (isEditMode) {
                response = await axios.post(`${API_URL}admin/vehicle-type/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                response = await axios.post(`${API_URL}admin/vehicle-type`, formData, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            if (response.status === 201 || response.status === 200) {
                triggerToast(`Vehicle type ${isEditMode ? 'updated' : 'created'} successfully`, 'success');
                navigate('/vehicle-types');
            }
        } catch (error) {
            console.error('Error saving vehicle type:', error);
            triggerToast(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} vehicle type`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-section">
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
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
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
                                        <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                                    </>
                                ) : (
                                    <span>{isEditMode ? 'Update Vehicle Type' : 'Create Vehicle Type'}</span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/vehicle-types')}
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

export default VehicleTypeForm;
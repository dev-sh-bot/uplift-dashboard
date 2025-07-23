import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTimes } from 'react-icons/fa';

const priorities = [1, 2, 3, 4, 5];
const audiences = [
  { value: 'all', label: 'All' },
  { value: 'riders', label: 'Riders' },
  { value: 'customers', label: 'Customers' },
];
const statuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
];

const GeneralAnnouncementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const statusValue = watch('status');

  // Dropzone for attachment
  const onDropAttachment = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setAttachmentFile(acceptedFiles[0]);
      setValue('attachment', acceptedFiles[0]);
    }
  }, [setValue]);
  const {
    getRootProps: getAttachmentRootProps,
    getInputProps: getAttachmentInputProps,
    isDragActive: isAttachmentDragActive,
  } = useDropzone({ onDrop: onDropAttachment, maxFiles: 1 });

  // Dropzone for image
  const onDropImage = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
      setValue('image', acceptedFiles[0]);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, [setValue]);
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({ onDrop: onDropImage, accept: { 'image/*': [] }, maxFiles: 1 });

  const removeAttachment = () => {
    setAttachmentFile(null);
    setValue('attachment', null);
  };
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue('image', null);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('message', data.message);
      if (attachmentFile) {
        formData.append('attachment', attachmentFile);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('priority', data.priority);
      formData.append('audience', data.audience);
      formData.append('status', data.status);
      if (statusValue === 'approved') {
        formData.append('scheduled_at', data.scheduled_at);
      }

      const response = await axios.post(`${API_URL}admin/general-announcement`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201 || response.status === 200) {
        triggerToast('Announcement created successfully', 'success');
        navigate(-1);
      }
    } catch (error) {
      triggerToast(error.response?.data?.message || 'Failed to create announcement', 'error');
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
              Announcement Information
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="form-input"
                  placeholder="Enter announcement title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows="4"
                  className="form-textarea"
                  placeholder="Enter announcement message"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Attachment Dropzone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Attachment
                  </label>
                  {!attachmentFile ? (
                    <div
                      {...getAttachmentRootProps()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isAttachmentDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-facebook-border hover:border-gray-400 dark:hover:border-facebook-textSecondary'}`}
                    >
                      <input {...getAttachmentInputProps()} />
                      <FaUpload className="mx-auto h-8 w-8 text-gray-400 dark:text-facebook-textSecondary mb-3" />
                      <p className="text-sm text-gray-600 dark:text-facebook-textSecondary">
                        {isAttachmentDragActive ? 'Drop the file here...' : 'Drag & drop a file here, or click to select'}
                      </p>
                    </div>
                  ) : (
                    <div className="relative flex items-center gap-2 bg-gray-50 dark:bg-facebook-surface border border-gray-200 dark:border-facebook-border rounded-lg p-3">
                      <span className="truncate text-gray-900 dark:text-facebook-text font-medium">{attachmentFile.name}</span>
                      <button type="button" onClick={removeAttachment} className="ml-2 text-red-500 hover:text-red-700"><FaTimes /></button>
                    </div>
                  )}
                </div>
                {/* Image Dropzone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Image
                  </label>
                  {!imageFile ? (
                    <div
                      {...getImageRootProps()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isImageDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-facebook-border hover:border-gray-400 dark:hover:border-facebook-textSecondary'}`}
                    >
                      <input {...getImageInputProps()} />
                      <FaUpload className="mx-auto h-8 w-8 text-gray-400 dark:text-facebook-textSecondary mb-3" />
                      <p className="text-sm text-gray-600 dark:text-facebook-textSecondary">
                        {isImageDragActive ? 'Drop the image here...' : 'Drag & drop an image here, or click to select'}
                      </p>
                    </div>
                  ) : (
                    <div className="relative flex items-center gap-2 bg-gray-50 dark:bg-facebook-surface border border-gray-200 dark:border-facebook-border rounded-lg p-3">
                      {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded" />
                      )}
                      <span className="truncate text-gray-900 dark:text-facebook-text font-medium">{imageFile.name}</span>
                      <button type="button" onClick={removeImage} className="ml-2 text-red-500 hover:text-red-700"><FaTimes /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('priority', { required: 'Priority is required' })}
                    className="form-input"
                  >
                    <option value="">Select Priority</option>
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Audience <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('audience', { required: 'Audience is required' })}
                    className="form-input"
                  >
                    <option value="">Select Audience</option>
                    {audiences.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                  {errors.audience && <p className="text-red-500 text-sm mt-1">{errors.audience.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('status', { required: 'Status is required' })}
                    className="form-input"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                </div>
              </div>
              {statusValue === 'approved' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-facebook-textSecondary mb-2">
                    Scheduled At <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    {...register('scheduled_at', { required: statusValue === 'approved' ? 'Scheduled date/time is required' : false })}
                    className="form-input"
                  />
                  {errors.scheduled_at && <p className="text-red-500 text-sm mt-1">{errors.scheduled_at.message}</p>}
                </div>
              )}
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
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><ColorRing visible={true} height="20" width="20" colors={['#fff', '#fff', '#fff', '#fff', '#fff']} /> Creating...</span>
                  ) : (
                    'Create Announcement'
                  )}
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
                {isSubmitting ? 'Creating...' : 'Create Announcement'}
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

export default GeneralAnnouncementForm; 
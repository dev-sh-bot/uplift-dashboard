import { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaGoogle, FaApple, FaSave, FaEdit, FaSpinner } from 'react-icons/fa';
import { ColorRing } from 'react-loader-spinner';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { triggerToast } from '../utils/helper';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('rider');
    const [activeContentTab, setActiveContentTab] = useState('about');
    const [isLoading, setIsLoading] = useState(false);
    const [contentData, setContentData] = useState({
        rider: {
            about: '',
            pnp: '',
            tnc: ''
        },
        customer: {
            about: '',
            pnp: '',
            tnc: ''
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingContent, setEditingContent] = useState('');
    const [googleLoginEnabled, setGoogleLoginEnabled] = useState(true);
    const [appleLoginEnabled, setAppleLoginEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const user = useSelector(selectUser);

    // Fetch content from API
    const fetchContent = async (title, role) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}admin/settings/dataset`, {
                params: { title, role },
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            if (response.data && response.data.data) {
                setContentData(prev => ({
                    ...prev,
                    [role]: {
                        ...prev[role],
                        [title]: response.data.data.content || ''
                    }
                }));
            }
        } catch (error) {
            console.error(`Error fetching ${title} for ${role}:`, error);
            triggerToast(`Failed to load ${title} content`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Load content when tab changes
    useEffect(() => {
        if (activeContentTab && activeTab) {
            fetchContent(activeContentTab, activeTab);
        }
    }, [activeContentTab, activeTab]);

    // Load initial content
    useEffect(() => {
        fetchContent('about', 'rider');
    }, []);

    const handleSaveContent = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', activeContentTab);
            formData.append('role', activeTab);
            formData.append('content', editingContent);

            const response = await axios.post(`${API_URL}admin/settings/dataset-store`, formData, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                // Update local state with new content
                setContentData(prev => ({
                    ...prev,
                    [activeTab]: {
                        ...prev[activeTab],
                        [activeContentTab]: editingContent
                    }
                }));

                triggerToast('Content saved successfully', 'success');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving content:', error);
            triggerToast(error.response?.data?.message || 'Failed to save content', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Here you would make API calls to save the settings
            console.log('Saving settings:', {
                activeTab,
                contentData,
                googleLoginEnabled,
                appleLoginEnabled
            });

            triggerToast('Settings saved successfully', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving settings:', error);
            triggerToast('Failed to save settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingContent('');
        // Reset to original values if needed
    };

    const handleEditContent = () => {
        setEditingContent(getCurrentContent());
        setIsEditing(true);
    };

    const getContentTabLabel = (tab) => {
        switch (tab) {
            case 'about': return 'About';
            case 'pnp': return 'Privacy Policy';
            case 'tnc': return 'Terms & Conditions';
            default: return tab;
        }
    };

    const getCurrentContent = () => {
        return contentData[activeTab]?.[activeContentTab] || '';
    };

    return (
        <div className="page-section">
            <div className="flex h-full">
                {/* Left Sidebar */}
                <div className="w-64 page-card mr-6">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-facebook-text mb-6">Settings</h2>

                        {/* Tab Navigation */}
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('rider')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'rider'
                                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-500'
                                        : 'text-gray-600 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover'
                                    }`}
                            >
                                <FaUserTie className="text-lg" />
                                <span className="font-medium text-sm">Rider Settings</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('customer')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'customer'
                                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-500'
                                        : 'text-gray-600 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover'
                                    }`}
                            >
                                <FaUsers className="text-lg" />
                                <span className="font-medium text-sm">Customer Settings</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="page-header mb-6">
                        <div>
                            <h1 className="page-title">
                                {activeTab === 'rider' ? 'Rider' : 'Customer'} Settings
                            </h1>
                            <p className="page-subtitle mt-1">
                                Manage content and login options for {activeTab === 'rider' ? 'riders' : 'customers'}
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <FaEdit className="text-sm" />
                                    <span>Edit</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-gray-700 dark:text-facebook-textSecondary bg-gray-100 dark:bg-facebook-surface border border-gray-300 dark:border-facebook-border rounded-xl hover:bg-gray-200 dark:hover:bg-facebook-hover transition-colors"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                                    >
                                        {isSaving ? (
                                            <ColorRing
                                                visible={true}
                                                height="16"
                                                width="16"
                                                colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
                                            />
                                        ) : (
                                            <FaSave className="text-sm" />
                                        )}
                                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div className="page-card p-6 mb-6">
                        <div className="flex space-x-1 border-b border-gray-200 dark:border-facebook-border">
                            {['about', 'pnp', 'tnc'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveContentTab(tab)}
                                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeContentTab === tab
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 dark:text-facebook-textSecondary hover:text-gray-900 dark:hover:text-facebook-text hover:bg-gray-100 dark:hover:bg-facebook-hover'
                                        }`}
                                >
                                    {getContentTabLabel(tab)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Display */}
                    <div className="space-y-6">
                        {/* Content Section */}
                        <div className="page-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">
                                    {getContentTabLabel(activeContentTab)}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    {isLoading && (
                                        <div className="flex items-center space-x-2 text-blue-600">
                                            <FaSpinner className="animate-spin" />
                                            <span className="text-sm">Loading...</span>
                                        </div>
                                    )}
                                    {!isLoading && !isEditing && (
                                        <button
                                            onClick={handleEditContent}
                                            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            <FaEdit className="text-xs" />
                                            <span>Edit</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <ColorRing
                                        visible={true}
                                        height="40"
                                        width="40"
                                        colors={['#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6']}
                                    />
                                </div>
                            ) : isEditing ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        rows="12"
                                        className="w-full p-4 border border-gray-300 dark:border-facebook-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white dark:bg-facebook-surface text-gray-900 dark:text-facebook-text"
                                        placeholder={`Enter ${getContentTabLabel(activeContentTab).toLowerCase()} content...`}
                                    />
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 text-gray-700 dark:text-facebook-textSecondary bg-gray-100 dark:bg-facebook-surface border border-gray-300 dark:border-facebook-border rounded-xl hover:bg-gray-200 dark:hover:bg-facebook-hover transition-colors"
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveContent}
                                            disabled={isSaving}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {isSaving ? (
                                                <ColorRing
                                                    visible={true}
                                                    height="16"
                                                    width="16"
                                                    colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
                                                />
                                            ) : (
                                                <FaSave className="text-sm" />
                                            )}
                                            <span>{isSaving ? 'Saving...' : 'Save Content'}</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose max-w-none">
                                    <div className="text-sm text-gray-900 dark:text-facebook-textSecondary bg-gray-50 dark:bg-facebook-surface p-4 rounded-xl border border-gray-200 dark:border-facebook-border whitespace-pre-wrap">
                                        {getCurrentContent() || 'No content available'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Login Options */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="page-card p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4">
                                        Login Options
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Google Login */}
                                        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-facebook-border rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <FaGoogle className="text-red-500 text-xl" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-facebook-text">Google Login</p>
                                                    <p className="text-sm text-gray-500 dark:text-facebook-textSecondary">Allow users to sign in with Google</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={googleLoginEnabled}
                                                    onChange={(e) => setGoogleLoginEnabled(e.target.checked)}
                                                    disabled={!isEditing}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-facebook-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-facebook-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        {/* Apple Login */}
                                        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-facebook-border rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <FaApple className="text-gray-900 dark:text-facebook-text text-xl" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-facebook-text">Apple Login</p>
                                                    <p className="text-sm text-gray-500 dark:text-facebook-textSecondary">Allow users to sign in with Apple</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={appleLoginEnabled}
                                                    onChange={(e) => setAppleLoginEnabled(e.target.checked)}
                                                    disabled={!isEditing}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-facebook-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-facebook-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="space-y-6">
                                <div className="border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Content Management</h4>
                                    <p className="text-sm text-blue-900 dark:text-blue-300">
                                        Content is loaded dynamically from the server.
                                        Click on different tabs to view different content sections.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 
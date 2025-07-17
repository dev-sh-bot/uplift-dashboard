import { useState } from 'react';
import { FaUsers, FaUserTie, FaGoogle, FaApple, FaSave, FaEdit } from 'react-icons/fa';
import { ColorRing } from 'react-loader-spinner';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('rider');
    const [riderPrivacyPolicy, setRiderPrivacyPolicy] = useState(`
# Privacy Policy for Riders

## 1. Information We Collect

We collect information you provide directly to us, such as when you create an account, complete your profile, or contact us for support.

### Personal Information
- Name and contact information
- Driver's license and vehicle information
- Background check information
- Location data during rides

### Usage Information
- Ride history and earnings
- App usage patterns
- Device information

## 2. How We Use Your Information

We use the information we collect to:
- Provide and improve our services
- Process payments and earnings
- Ensure safety and security
- Communicate with you about your account

## 3. Information Sharing

We may share your information with:
- Customers during rides (limited information)
- Service providers who assist our operations
- Law enforcement when required by law

## 4. Data Security

We implement appropriate security measures to protect your personal information.

## 5. Your Rights

You have the right to:
- Access your personal information
- Request corrections to your data
- Delete your account
- Opt out of certain communications

## 6. Contact Us

If you have questions about this privacy policy, please contact us.
    `);
    
    const [customerPrivacyPolicy, setCustomerPrivacyPolicy] = useState(`
# Privacy Policy for Customers

## 1. Information We Collect

We collect information you provide directly to us, such as when you create an account, book rides, or contact us for support.

### Personal Information
- Name and contact information
- Payment information
- Location data during rides
- Ride preferences

### Usage Information
- Ride history and spending
- App usage patterns
- Device information

## 2. How We Use Your Information

We use the information we collect to:
- Provide and improve our services
- Process payments and transactions
- Ensure safety and security
- Communicate with you about your account

## 3. Information Sharing

We may share your information with:
- Drivers during rides (limited information)
- Service providers who assist our operations
- Law enforcement when required by law

## 4. Data Security

We implement appropriate security measures to protect your personal information.

## 5. Your Rights

You have the right to:
- Access your personal information
- Request corrections to your data
- Delete your account
- Opt out of certain communications

## 6. Contact Us

If you have questions about this privacy policy, please contact us.
    `);
    
    const [isEditing, setIsEditing] = useState(false);
    const [googleLoginEnabled, setGoogleLoginEnabled] = useState(true);
    const [appleLoginEnabled, setAppleLoginEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Here you would make actual API calls to save the settings
            console.log('Saving settings:', {
                activeTab,
                riderPrivacyPolicy,
                customerPrivacyPolicy,
                googleLoginEnabled,
                appleLoginEnabled
            });
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset to original values if needed
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
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                    activeTab === 'rider'
                                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-500'
                                        : 'text-gray-600 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover'
                                }`}
                            >
                                <FaUserTie className="text-lg" />
                                <span className="font-medium text-sm">Rider Settings</span>
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('customer')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                    activeTab === 'customer'
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
                                Manage privacy policies and login options for {activeTab === 'rider' ? 'riders' : 'customers'}
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

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Privacy Policy Editor */}
                        <div className="lg:col-span-2">
                            <div className="page-card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-4">
                                    Privacy Policy
                                </h3>
                                
                                {isEditing ? (
                                    <textarea
                                        value={activeTab === 'rider' ? riderPrivacyPolicy : customerPrivacyPolicy}
                                        onChange={(e) => {
                                            if (activeTab === 'rider') {
                                                setRiderPrivacyPolicy(e.target.value);
                                            } else {
                                                setCustomerPrivacyPolicy(e.target.value);
                                            }
                                        }}
                                        className="w-full h-96 p-4 border border-gray-300 dark:border-facebook-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm bg-white dark:bg-facebook-surface text-gray-900 dark:text-facebook-text"
                                        placeholder="Enter privacy policy content..."
                                    />
                                ) : (
                                    <div className="prose max-w-none">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-facebook-textSecondary bg-gray-50 dark:bg-facebook-surface p-4 rounded-xl border border-gray-200 dark:border-facebook-border">
                                            {activeTab === 'rider' ? riderPrivacyPolicy : customerPrivacyPolicy}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Login Options */}
                        <div className="space-y-6">
                            {/* Login Options Card */}
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

                            {/* Info Card */}
                            <div className="border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">About Privacy Policies</h4>
                                <p className="text-sm text-blue-900 dark:text-blue-300">
                                    Privacy policies are displayed to users during registration and can be updated at any time. 
                                    Changes will be effective immediately for new users.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 
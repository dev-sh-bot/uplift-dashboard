import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

const ITEM_HEIGHT = 40; // Estimated height per item

const NotificationDropdown = ({
    notifications,
    menuButtonLabel,
    spaceBetweenInPercent = 110,
    widthAsClass = 'w-96',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState('bottom');
    const [activeTab, setActiveTab] = useState('all'); // "all", "unread", "read"

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleOutsideClick = useCallback((event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    }, []);

    // Filter notifications based on the active tab
    const filteredNotifications = useMemo(() => {
        if (activeTab === 'all') return notifications;
        if (activeTab === 'unread')
            return notifications.filter((n) => n.read_at === null);
        if (activeTab === 'read')
            return notifications.filter((n) => n.read_at !== null);
        return notifications;
    }, [activeTab, notifications]);

    const updateMenuPosition = useCallback(() => {
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const spaceBelow = windowHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;
            const menuHeight = (filteredNotifications.length + 1) * ITEM_HEIGHT;
            setMenuPosition(
                spaceBelow < menuHeight && spaceAbove > spaceBelow ? 'top' : 'bottom'
            );
        }
    }, [filteredNotifications.length]);

    const toggleMenu = useCallback(() => {
        if (!isOpen) {
            updateMenuPosition();
        }
        setIsOpen(!isOpen);
    }, [isOpen, updateMenuPosition]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            window.addEventListener('scroll', updateMenuPosition);
            window.addEventListener('resize', updateMenuPosition);
            return () => {
                document.removeEventListener('mousedown', handleOutsideClick);
                window.removeEventListener('scroll', updateMenuPosition);
                window.removeEventListener('resize', updateMenuPosition);
            };
        }
    }, [isOpen, handleOutsideClick, updateMenuPosition]);


    const menuStyle = useMemo(
        () => ({
            [menuPosition === 'bottom' ? 'top' : 'bottom']: `${spaceBetweenInPercent}%`,
            maxHeight: '300px',
            overflowY: 'auto',
            display: isOpen ? 'block' : 'none',
        }),
        [menuPosition, isOpen, spaceBetweenInPercent]
    );

    // Helper functions
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const handleNotificationClick = (notification) => {
        // Handle notification click - mark as read and perform action
        console.log('Notification clicked:', notification);
        setIsOpen(false);
    };

    const handleMarkAllRead = () => {
        // Mark all notifications as read
        console.log('Mark all as read clicked');
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button ref={buttonRef} onClick={toggleMenu}>
                {menuButtonLabel}
            </button>
            <div
                ref={menuRef}
                className={`absolute z-10 right-0 ${widthAsClass} origin-top-right rounded-xl bg-white dark:bg-facebook-card shadow-lg dark:shadow-gray-900/20 ring-1 ring-black ring-opacity-5 dark:ring-facebook-border ${isOpen ? 'fade-in' : 'fade-out'
                    }`}
                style={menuStyle}
            >
                {/* Tab Bar with three filters */}
                <div className="flex border-b border-gray-200 dark:border-facebook-border">
                    <button
                        className={`flex-1 py-3 text-center transition-colors ${activeTab === 'all' ? 'bg-gray-200 dark:bg-facebook-surface font-semibold text-gray-900 dark:text-facebook-text' : 'bg-white dark:bg-facebook-card text-gray-600 dark:text-facebook-textSecondary hover:bg-gray-50 dark:hover:bg-facebook-hover'
                            }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`flex-1 py-3 text-center transition-colors ${activeTab === 'unread' ? 'bg-gray-200 dark:bg-facebook-surface font-semibold text-gray-900 dark:text-facebook-text' : 'bg-white dark:bg-facebook-card text-gray-600 dark:text-facebook-textSecondary hover:bg-gray-50 dark:hover:bg-facebook-hover'
                            }`}
                        onClick={() => setActiveTab('unread')}
                    >
                        Unread
                    </button>
                    <button
                        className={`flex-1 py-3 text-center transition-colors ${activeTab === 'read' ? 'bg-gray-200 dark:bg-facebook-surface font-semibold text-gray-900 dark:text-facebook-text' : 'bg-white dark:bg-facebook-card text-gray-600 dark:text-facebook-textSecondary hover:bg-gray-50 dark:hover:bg-facebook-hover'
                            }`}
                        onClick={() => setActiveTab('read')}
                    >
                        Read
                    </button>
                </div>

                {/* Notification List */}
                <div className="max-h-96 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-500 dark:text-facebook-textSecondary text-sm">
                                No {activeTab === 'all' ? '' : activeTab} notifications
                            </p>
                        </div>
                    ) : (
                        <ul className="py-2">
                            {filteredNotifications.map((notification, index) => (
                                <li
                                    key={index}
                                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-facebook-hover transition-colors cursor-pointer border-b border-gray-100 dark:border-facebook-border last:border-b-0 ${
                                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                                                    {notification.type?.charAt(0).toUpperCase() || 'N'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-facebook-text">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-facebook-textSecondary mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-facebook-textMuted mt-2">
                                                {formatTimeAgo(notification.created_at)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-facebook-border p-3">
                    <button
                        onClick={handleMarkAllRead}
                        className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                        Mark all as read
                    </button>
                </div>
            </div>
        </div>
    );
};

NotificationDropdown.propTypes = {
    user: PropTypes.object.isRequired,
    notifications: PropTypes.array.isRequired,
    onNotificationRead: PropTypes.func.isRequired,
    menuButtonLabel: PropTypes.node.isRequired,
    spaceBetweenInPercent: PropTypes.number,
    widthAsClass: PropTypes.string,
};

export default NotificationDropdown;
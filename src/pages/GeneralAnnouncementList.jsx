import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import { FaPlus, FaSearch, FaPaperclip } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GeneralAnnouncementList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}admin/general-announcement`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                    params: { search: searchTerm },
                });
                const dataArr = Array.isArray(response.data.data) ? response.data.data : [];
                setAnnouncements(dataArr);
                setTotalItems(response.data.total || dataArr.length);
            } catch {
                triggerToast('Failed to fetch announcements', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, searchTerm]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
            {/* Search and Create Bar */}
            <div className="search-container mb-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="w-80 relative">
                        <FaSearch className="search-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search announcements by title..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/general-announcement/create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
                    >
                        <FaPlus size={14} />
                        <span>Add Announcement</span>
                    </button>
                </div>
            </div>
            {/* Table Card */}
            <div className="page-card p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-facebook-border">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">General Announcements</h2>
                    <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">
                        Total: {totalItems} announcements
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-facebook-border">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Image</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Title</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Message</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Attachment</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Priority</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Audience</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Status</th>
                                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Scheduled At</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {announcements.map((item) => (
                                <tr key={item.id} className="table-row hover:bg-gray-50 dark:hover:bg-facebook-hover transition-colors">
                                    <td className="table-cell text-gray-900 dark:text-facebook-text">
                                        {item.image ? (
                                            <a href={`${ASSETS_URL}${item.image}`} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={`${ASSETS_URL}${item.image}`}
                                                    alt="Announcement"
                                                    className="w-16 h-16 object-cover rounded shadow border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                                                />
                                            </a>
                                        ) : (
                                            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 text-xs flex-col">
                                                <FaImage className="mb-1 text-lg" />
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text font-medium max-w-xs truncate">{item.title}</td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text max-w-xs truncate">{item.message}</td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text">
                                        {item.attachment ? (
                                            <a href={`${ASSETS_URL}${item.attachment}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                                                <FaPaperclip />
                                                Download
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text">{item.priority}</td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text capitalize">{item.audience}</td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text capitalize">{item.status}</td>
                                    <td className="table-cell text-gray-900 dark:text-facebook-text">{formatDate(item.scheduled_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GeneralAnnouncementList; 
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import { FaEye, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { useQueryParams } from '../hooks/useQueryParams';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Handle query params for search
  const { updatePageParam } = useQueryParams(searchTerm, debouncedSearchTerm, setSearchTerm);

  const fetchVehicles = async (search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}admin/vehicles`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        params: { search },
      });
      const dataArr = Array.isArray(response.data.data) ? response.data.data : [];
      setVehicles(dataArr);
      setTotalItems(response.data.total || dataArr.length);
    } catch {
      triggerToast('Failed to fetch vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(debouncedSearchTerm);
  }, [debouncedSearchTerm, user?.token]);

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
      {/* Search Bar */}
      <div className="search-container mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="w-80 relative">
            <FaSearch className="search-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search vehicles by registration, make, model..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
      {/* Table Card */}
      <div className="page-card p-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-facebook-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">Vehicles</h2>
          <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">
            Total: {totalItems} vehicles
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-facebook-border">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Registration</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Make</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Model</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Year</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Color</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Owner</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Status</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {vehicles.map((item) => (
                <tr key={item.id} className="table-row hover:bg-gray-50 dark:hover:bg-facebook-hover transition-colors">
                  <td className="table-cell text-gray-900 dark:text-facebook-text font-medium max-w-xs truncate">{item.registration_number}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{item.make}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{item.model}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{item.year}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{item.color}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{item.first_name} {item.last_name}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text capitalize">{item.is_active}</td>
                  <td className="table-cell text-sm font-medium">
                    <button
                      className="action-button action-button-view"
                      onClick={() => navigate(`/vehicles/${item.id}`)}
                    >
                      <FaEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleList; 
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { triggerToast } from '../utils/helper';
import { FaEye, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SurgeRateList = () => {
  const [surgeRates, setSurgeRates] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [surgeRes, vehicleRes] = await Promise.all([
          axios.get(`${API_URL}admin/surge-rates`, {
            headers: { Authorization: `Bearer ${user?.token}` },
            params: { search: searchTerm },
          }),
          axios.get(`${API_URL}admin/list/vehicle-type-rates`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          })
        ]);
        const dataArr = Array.isArray(surgeRes.data.data) ? surgeRes.data.data : Array.isArray(surgeRes.data) ? surgeRes.data : [];
        setSurgeRates(dataArr);
        setTotalItems(surgeRes.data.total || dataArr.length);
        setVehicleTypes(vehicleRes.data);
      } catch {
        triggerToast('Failed to fetch surge rates', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, searchTerm]);

  const getVehicleTypeName = (id) => {
    const vt = vehicleTypes.find(v => String(v.id) === String(id));
    return vt ? vt.title : id;
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
              placeholder="Search surge rates by vehicle type..."
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text">Surge Rates</h2>
          <span className="text-sm text-gray-500 dark:text-facebook-textSecondary">
            Total: {totalItems} surge rates
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-facebook-border">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Vehicle Type</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Start Time</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">End Time</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Day</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Surge Rate</th>
                <th className="table-header-cell text-gray-700 dark:text-facebook-text">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {surgeRates.map((rate) => (
                <tr key={rate.id} className="table-row hover:bg-gray-50 dark:hover:bg-facebook-hover transition-colors">
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{getVehicleTypeName(rate.vehicle_type_rate_id)}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{rate.start_time}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{rate.end_time}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{rate.day_of_week}</td>
                  <td className="table-cell text-gray-900 dark:text-facebook-text">{rate.surge_rate}</td>
                  <td className="table-cell text-sm font-medium">
                    <button
                      className="action-button action-button-view"
                      onClick={() => navigate(`/surge-rates/${rate.id}`)}
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

export default SurgeRateList; 
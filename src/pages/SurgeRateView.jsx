import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { FaArrowLeft, FaCar, FaCalendarAlt, FaClock } from 'react-icons/fa';

const labelClass = 'text-xs flex items-center gap-2 font-semibold uppercase tracking-wide text-gray-500 dark:text-facebook-textSecondary';
const valueClass = 'text-base font-medium text-gray-900 dark:text-facebook-text';

const SurgeRateView = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [surgeRes, vehicleRes] = await Promise.all([
          axios.get(`${API_URL}admin/surge-rates/${id}`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get(`${API_URL}admin/list/vehicle-type-rates`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          })
        ]);
        setData(surgeRes.data);
        setVehicleTypes(vehicleRes.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

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

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Surge rate not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
          <FaArrowLeft /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="page-section">
      <button onClick={() => navigate(-1)} className="mb-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow">
        <FaArrowLeft /> Back
      </button>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Info Card */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="page-card p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-md">
                <FaCar />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-facebook-text mb-1 flex items-center gap-2">
                  Surge Rate #{data.id}
                </h2>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
                  Vehicle Type: {getVehicleTypeName(data.vehicle_type_rate_id)}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className={labelClass}><FaClock className="text-blue-500" /> Start Time:</span>
                <span className={valueClass}>{data.start_time}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={labelClass}><FaClock className="text-blue-400" /> End Time:</span>
                <span className={valueClass}>{data.end_time}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={labelClass}>Day of Week:</span>
                <span className={valueClass}>{data.day_of_week}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={labelClass}>Surge Rate:</span>
                <span className={valueClass}>{data.surge_rate}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar Card */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="page-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Meta Information</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2"><span className={labelClass}><FaCalendarAlt className="text-gray-400" /> Created At:</span><span className={valueClass}>{new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div className="flex items-center justify-between gap-2"><span className={labelClass}><FaCalendarAlt className="text-gray-400" /> Updated At:</span><span className={valueClass}>{new Date(data.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeRateView; 
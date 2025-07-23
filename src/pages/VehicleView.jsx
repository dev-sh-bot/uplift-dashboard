import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { FaArrowLeft, FaCar, FaIdCard, FaCheckCircle, FaClock } from 'react-icons/fa';

const labelClass = 'text-xs flex items-center gap-2 font-semibold uppercase tracking-wide text-gray-500 dark:text-facebook-textSecondary';
const valueClass = 'text-base font-medium text-gray-900 dark:text-facebook-text';

const getApprovalBadge = (approved_at, approved_by) => {
  if (approved_at && approved_by) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <FaCheckCircle className="text-green-500 dark:text-green-400" /> Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
      <FaClock className="text-yellow-500 dark:text-yellow-400" /> Pending
    </span>
  );
};

const VehicleView = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}admin/vehicles/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setData(response.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

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
        <p className="text-gray-500 dark:text-facebook-textSecondary">Vehicle not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
          <FaArrowLeft /> Back
        </button>
      </div>
    );
  }

  // Parse photos JSON if present
  let photos = [];
  try {
    photos = data.photos ? JSON.parse(data.photos) : [];
  } catch {
    photos = [];
  }

  const isApproved = data.approved_at && data.approved_by;

  return (
    <div className="page-section">
      <button onClick={() => navigate(-1)} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
        <FaArrowLeft /> Back
      </button>
      <div className="page-card p-0 flex flex-col md:flex-row overflow-hidden">
        {/* Info Section */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 flex items-center justify-center bg-gray-100 dark:bg-facebook-surface rounded-xl border border-gray-200 dark:border-facebook-border shadow">
                  <FaCar className="h-12 w-12 text-gray-300 dark:text-facebook-border" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {data.make} {data.model} <span className="text-lg font-normal text-gray-500 dark:text-facebook-textSecondary">({data.year})</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 dark:text-facebook-textSecondary">
                    <span>Registration: <span className="font-semibold text-gray-900 dark:text-facebook-text">{data.registration_number}</span></span>
                    <span>Owner: <span className="font-semibold text-gray-900 dark:text-facebook-text">{data.first_name} {data.last_name}</span></span>
                  </div>
                </div>
              </div>
              {/* Approval Badge */}
              <div>{getApprovalBadge(data.approved_at, data.approved_by)}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className={labelClass}>Color</div>
                <div className={valueClass}>{data.color}</div>
              </div>
              <div>
                <div className={labelClass}>Status</div>
                <div className={valueClass}><span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${data.is_active === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>{data.is_active}</span></div>
              </div>
              <div>
                <div className={labelClass}>Is Driving</div>
                <div className={valueClass}><span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${data.is_driving === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>{data.is_driving}</span></div>
              </div>
              <div>
                <div className={labelClass}>Created At</div>
                <div className={valueClass}>{data.created_at ? new Date(data.created_at).toLocaleString() : '-'}</div>
              </div>
              {isApproved && (
                <>
                  <div>
                    <div className={labelClass}>Approved At</div>
                    <div className={valueClass}>{data.approved_at ? new Date(data.approved_at).toLocaleString() : '-'}</div>
                  </div>
                  <div>
                    <div className={labelClass}>Approved By</div>
                    <div className={valueClass}>{data.approved_by || '-'}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Divider for desktop */}
        <div className="hidden md:block w-px bg-gray-200 dark:bg-facebook-border mx-0" />
        {/* Documents Section */}
        <div className="flex-1 p-8 bg-gray-50 dark:bg-facebook-surface flex flex-col justify-between">
          <div>
            <div className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><FaIdCard /> Documents</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className={labelClass}>Registration Certificate</div>
                {data.registration_certificate ? (
                  <a href={`${ASSETS_URL}${data.registration_certificate}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${ASSETS_URL}${data.registration_certificate}`}
                      alt="Registration Certificate"
                      className="w-40 h-28 object-cover rounded border border-gray-200 dark:border-facebook-border shadow"
                    />
                  </a>
                ) : <div className="text-gray-400 dark:text-facebook-textSecondary">-</div>}
              </div>
              <div>
                <div className={labelClass}>Vehicle Insurance</div>
                {data.vehicle_insurance ? (
                  <a href={`${ASSETS_URL}${data.vehicle_insurance}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${ASSETS_URL}${data.vehicle_insurance}`}
                      alt="Vehicle Insurance"
                      className="w-40 h-28 object-cover rounded border border-gray-200 dark:border-facebook-border shadow"
                    />
                  </a>
                ) : <div className="text-gray-400 dark:text-facebook-textSecondary">-</div>}
              </div>
              <div className="md:col-span-2">
                <div className={labelClass}>Photos</div>
                <div className="flex gap-4 flex-wrap">
                  {photos.length > 0 ? photos.map((img, idx) => (
                    <a key={idx} href={`${ASSETS_URL}${img}`} target="_blank" rel="noopener noreferrer">
                      <img
                        src={`${ASSETS_URL}${img}`}
                        alt={`Vehicle Photo ${idx + 1}`}
                        className="w-40 h-28 object-cover rounded border border-gray-200 dark:border-facebook-border shadow"
                      />
                    </a>
                  )) : <div className="text-gray-400 dark:text-facebook-textSecondary">No photos</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleView; 
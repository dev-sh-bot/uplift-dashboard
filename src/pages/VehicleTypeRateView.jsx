import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ASSETS_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaCar } from 'react-icons/fa';
import { useGlobalData } from '../hooks/useGlobalData';

const labelClass = 'text-xs flex items-center gap-2 font-semibold uppercase tracking-wide text-gray-500 dark:text-facebook-textSecondary';
const valueClass = 'text-base font-medium text-gray-900 dark:text-facebook-text';

const VehicleTypeRateView = () => {
    const { id } = useParams();
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getCountryById, getStateById, getCityById, loadCountries, loadAllStates, getCitiesByState, countries, states, cities } = useGlobalData();


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}admin/vehicle-type-rates/${id}`, {
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

    // Ensure global data is loaded on mount
    useEffect(() => {
        loadCountries();
        loadAllStates();
    }, [loadCountries, loadAllStates]);

    // Fetch cities for the state after data is loaded
    useEffect(() => {
        if (data && data.state_id) {
            getCitiesByState(data.state_id);
        }
    }, [data, getCitiesByState]);

    // Only render when countries, states, and cities are loaded
    const isDataReady = data && countries.length > 0 && states.length > 0 && cities.length > 0;

    if (loading || !isDataReady) {
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
                <p className="text-gray-500">Vehicle type rate not found</p>
                <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                    <FaArrowLeft /> Back
                </button>
            </div>
        );
    }

    return (
        <div className="page-section">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Info Card */}
                <div className="flex-1 min-w-0 space-y-6">
                    <div className="page-card p-6">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="h-24 w-24 flex-shrink-0">
                                {data.icon ? (
                                    <img
                                        src={`${ASSETS_URL}${data.icon}`}
                                        alt={data.title}
                                        className="h-24 w-24 object-cover rounded-xl border border-gray-200 dark:border-facebook-border shadow-md"
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-xl bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 shadow-md">
                                        <FaCar />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-facebook-text mb-1 flex items-center gap-2 truncate">
                                    {data.title}
                                </h2>
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
                                    ID: {data.id}
                                </span>
                                <p className="text-gray-600 dark:text-facebook-textSecondary text-base mb-2 truncate">{data.description}</p>
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Pricing</div>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center justify-between gap-2"><span className={labelClass}>Base Price:</span><span className={valueClass}>{data.base_price}</span></div>
                                <div className="flex items-center justify-between gap-2"><span className={labelClass}>Price per KM:</span><span className={valueClass}>{data.price_per_km}</span></div>
                                <div className="flex items-center justify-between gap-2"><span className={labelClass}>Price per Min:</span><span className={valueClass}>{data.price_per_min}</span></div>
                                <div className="flex items-center justify-between gap-2"><span className={labelClass}>Booking Fee:</span><span className={valueClass}>{data.booking_fee}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Sidebar Card */}
                <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                    <div className="page-card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-facebook-text mb-3">Location</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2"><span className={labelClass}><FaMapMarkerAlt className="text-blue-500" /> Country:</span><span className={valueClass}>{getCountryById(data.country_id)?.name || data.country_id}</span></div>
                            <div className="flex items-center justify-between gap-2"><span className={labelClass}><FaMapMarkerAlt className="text-blue-400" /> State:</span><span className={valueClass}>{getStateById(data.state_id)?.name || data.state_id}</span></div>
                            <div className="flex items-center justify-between gap-2"><span className={labelClass}><FaMapMarkerAlt className="text-blue-300" /> City:</span><span className={valueClass}>{getCityById(data.city_id)?.name || data.city_id}</span></div>
                        </div>
                    </div>
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

export default VehicleTypeRateView; 
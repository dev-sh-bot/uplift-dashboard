import axios from 'axios';
import { API_URL } from '../utils/constants';

// Get auth token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token;
};

// Fetch countries from API
export const fetchCountries = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}admin/countries`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching countries:', error);
        return { 
            success: false, 
            error: error.response?.data || 'Failed to fetch countries' 
        };
    }
};

// Fetch states for a specific country
export const fetchStatesByCountry = async (countryId) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}admin/states/${countryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching states:', error);
        return { 
            success: false, 
            error: error.response?.data || 'Failed to fetch states' 
        };
    }
};

// Fetch all states
export const fetchAllStates = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}admin/states`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching all states:', error);
        return { 
            success: false, 
            error: error.response?.data || 'Failed to fetch states' 
        };
    }
}; 
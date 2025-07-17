import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    selectCities,
    selectGlobalDataLoading,
    selectGlobalDataError,
    selectGlobalDataInitialized,
    setInitialized
} from '../reducers/globalDataSlice';
import { fetchCountries, fetchStatesByCountry, fetchAllStates } from '../services/locationService';

export const useGlobalData = () => {
    const dispatch = useDispatch();
    const cities = useSelector(selectCities);
    const loading = useSelector(selectGlobalDataLoading);
    const error = useSelector(selectGlobalDataError);
    const initialized = useSelector(selectGlobalDataInitialized);
    
    // Local state for countries and states
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [countriesLoading, setCountriesLoading] = useState(false);
    const [statesLoading, setStatesLoading] = useState(false);

    // Initialize global data on first load
    useEffect(() => {
        console.log('useGlobalData: Initializing...', { 
            initialized, 
            citiesLength: cities.length 
        });
        
        if (!initialized) {
            console.log('useGlobalData: Setting initialized...');
            dispatch(setInitialized(true));
        }
    }, [dispatch, initialized]);

    // Helper functions for API calls
    const loadCountries = useCallback(async () => {
        setCountriesLoading(true);
        const result = await fetchCountries();
        if (result.success) {
            setCountries(result.data);
        }
        setCountriesLoading(false);
        return result;
    }, []);

    const loadStatesByCountry = useCallback(async (countryId) => {
        setStatesLoading(true);
        const result = await fetchStatesByCountry(countryId);
        if (result.success) {
            setStates(result.data);
            console.log('useGlobalData: States:', result.data);
        }
        setStatesLoading(false);
        return result;
    }, []);

    const loadAllStates = useCallback(async () => {
        setStatesLoading(true);
        const result = await fetchAllStates();
        if (result.success) {
            setStates(result.data);
        }
        setStatesLoading(false);
        return result;
    }, []);

    // Helper functions for data access
    const getStatesByCountry = (countryId) => {
        return states.filter(state => state.country_id === countryId);
    };

    const getCitiesByState = (stateId) => {
        return cities.filter(city => city.stateId === stateId.toString());
    };

    const getCountryById = (countryId) => {
        return countries.find(country => country.id === countryId);
    };

    const getStateById = (stateId) => {
        return states.find(state => state.id === stateId);
    };

    const getCityById = (cityId) => {
        return cities.find(city => city.id === cityId);
    };

    const getCountryName = (countryId) => {
        const country = getCountryById(countryId);
        return country ? country.name : '';
    };

    const getStateName = (stateId) => {
        const state = getStateById(stateId);
        return state ? state.name : '';
    };

    const getCityName = (cityId) => {
        const city = getCityById(cityId);
        return city ? city.name : '';
    };

    return {
        // Cities from Redux
        cities,
        loading,
        error,
        initialized,
        
        // Countries and states from local state
        countries,
        states,
        countriesLoading,
        statesLoading,
        
        // API functions
        loadCountries,
        loadStatesByCountry,
        loadAllStates,
        
        // Helper functions
        getStatesByCountry,
        getCitiesByState,
        getCountryById,
        getStateById,
        getCityById,
        getCountryName,
        getStateName,
        getCityName,
    };
}; 
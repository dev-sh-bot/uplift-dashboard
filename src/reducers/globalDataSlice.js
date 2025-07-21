import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cities:  [],
    loading: false,
    error: null,
    initialized: false,
};

const globalDataSlice = createSlice({
    name: 'globalData',
    initialState,
    reducers: {
        clearGlobalData: (state) => {
            state.cities = [];
            state.loading = false;
            state.error = null;
            state.initialized = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setInitialized: (state, action) => {
            state.initialized = action.payload;
        },
    },
});

// Selectors
export const selectCities = (state) => state.globalData.cities;
export const selectGlobalDataLoading = (state) => state.globalData.loading;
export const selectGlobalDataError = (state) => state.globalData.error;
export const selectGlobalDataInitialized = (state) => state.globalData.initialized;

// Helper selectors
export const selectCitiesByState = (state, stateId) => 
    state.globalData.cities.filter(city => city.stateId === stateId.toString());

export const { clearGlobalData, setError, setInitialized } = globalDataSlice.actions;

export default globalDataSlice.reducer; 
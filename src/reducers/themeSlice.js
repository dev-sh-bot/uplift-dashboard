import { createSlice } from '@reduxjs/toolkit';

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme from localStorage:', savedTheme); // Debug log
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('System prefers dark mode'); // Debug log
      return 'dark';
    }
  }
  
  console.log('Defaulting to light mode'); // Debug log
  return 'light';
};

const initialState = {
  theme: getInitialTheme(),
};

console.log('Initial theme state:', initialState.theme); // Debug log

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      console.log('Toggling theme from:', state.theme); // Debug log
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      console.log('Toggled theme to:', state.theme); // Debug log
    },
    setTheme: (state, action) => {
      console.log('Setting theme to:', action.payload); // Debug log
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.theme;
export default themeSlice.reducer; 
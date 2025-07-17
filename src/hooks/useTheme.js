import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '../reducers/themeSlice';

export const useTheme = () => {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    console.log('Theme changed to:', theme); // Debug log
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('Added dark class to html element'); // Debug log
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class from html element'); // Debug log
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
    console.log('Saved theme to localStorage:', theme); // Debug log
  }, [theme]);

  // Apply theme on mount
  useEffect(() => {
    console.log('useTheme hook mounted, applying theme:', theme); // Debug log
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Empty dependency array for mount-only effect

  return theme;
}; 
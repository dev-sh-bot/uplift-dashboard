import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../reducers/themeSlice';
import { selectTheme } from '../reducers/themeSlice';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const handleToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme); // Debug log
    dispatch(toggleTheme());
    console.log('toggleTheme action dispatched'); // Debug log
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FaMoon className="w-4 h-4" />
      ) : (
        <FaSun className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggle; 
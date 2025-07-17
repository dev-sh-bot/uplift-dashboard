import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import Sidebar from "./Sidebar";
import { useLocation } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import Header from './Header';
// import Notification from './Notification';

TopBarProgress.config({
  barColors: {
    "0": "#3898EB36",
    "1.0": "#1C70B9"
  },
  shadowBlur: 5,
});

const Layout = ({ children }) => {
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [progress, setProgress] = useState(false);

  // Save the previous page URL into sessionStorage based on specific conditions
  useEffect(() => {
    const currentPage = location.pathname;
    const lastStoredPage = sessionStorage.getItem('currentPage');

    if (lastStoredPage && lastStoredPage !== currentPage) {
      // Update 'previousPage' with the last stored 'currentPage' if it's different from the current page
      sessionStorage.setItem('previousPage', lastStoredPage);
    }

    // Update 'currentPage' with the new current path
    sessionStorage.setItem('currentPage', currentPage);
  }, [location.pathname]);

  // Use useRef to track the first render
  const isFirstRender = useRef(true);

  // Show progress bar when navigating
  useEffect(() => {
    if (isFirstRender.current) {
      // Skip showing progress bar on first render
      isFirstRender.current = false;
      return;
    }

    setProgress(true);
    const timer = setTimeout(() => {
      setProgress(false);
    }, 1000);

    // Cleanup timeout if component unmounts
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {progress && <TopBarProgress />}
      <div className="position-relative top-0 flex h-screen w-full overflow-auto bg-white dark:bg-facebook-dark">
        <Sidebar isExpanded={openSidebar} setIsExpanded={setOpenSidebar} />
        <main className={`w-full transition-all duration-300 ${openSidebar ? 'main-container' : 'main-container-expanded'} bg-white dark:bg-facebook-dark`}>
          <Header />
          <div className='p-5'>
            {children}
          </div>
        </main>
      </div>
      {/* <Notification /> */}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
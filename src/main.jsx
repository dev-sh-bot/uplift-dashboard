import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './store.js';
import 'react-toastify/dist/ReactToastify.css';
import "react-toggle/style.css"; // Import react-toggle styles
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Default theme

// Set the app element to the root element of your application
const rootElement = document.getElementById('root');
Modal.setAppElement(rootElement);

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="light"
      transition="Slide"
    />
  </Provider>
);

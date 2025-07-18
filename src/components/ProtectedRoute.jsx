import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../reducers/authSlice';

const ProtectedRoute = ({ children, loggedIn = false }) => {
    const user = useSelector(selectUser);

    // Handle routes that should only be accessible to unauthenticated users (e.g., Login)
    if (loggedIn) {
        if (user == null) {
            return children;
        }
        return <Navigate to="/" replace={true} />;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace={true} />;
    }

    // For all authenticated users, show the protected content
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    loggedIn: PropTypes.bool
};

export default ProtectedRoute;
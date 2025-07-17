import { useSelector } from 'react-redux';
import { selectLogoutLoading } from '../reducers/authSlice';
import { ColorRing } from 'react-loader-spinner';

const LogoutOverlay = () => {
    const logoutLoading = useSelector(selectLogoutLoading);

    if (!logoutLoading) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
                <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    colors={['#8484c1', "#8484c1", "#8484c1", "#8484c1", "#8484c1"]}
                />
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Logging Out
                    </h2>
                    <p className="text-gray-600">
                        Please wait while we securely log you out...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogoutOverlay; 
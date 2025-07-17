import Modal from 'react-modal';
import propTypes from 'prop-types';
import { useEffect } from 'react';

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, isProcessing, shouldCloseOnOverlayClick = true, shouldCloseOnEsc = true, heading, message, btnText }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmation Modal"
            // when click outside the modal, donot close the modal
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
            // when click outside the modal, donot close the modal
            shouldCloseOnEsc={shouldCloseOnEsc}
        >
            <div className={`my-2 ${isProcessing ? 'opacity-70 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                <h1 className="text-2xl text-left font-bold mb-4">{heading}</h1>
                <p className="text-left text-base w-11/12 mb-4 font-medium">{message}</p>
                <div className="flex justify-end space-x-4 pt-5 mt-5 border-t-2">
                    <button
                        type="button"
                        className="border-gray-500 border-2 font-semibold text-base text-gray-500 px-4 py-2 rounded-lg"
                        onClick={onRequestClose}
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-[#FF0000] border-[#FF0000] border-2 font-semibold text-base text-[#FFF] px-4 py-2 rounded-lg"
                        onClick={() => onConfirm()}
                        disabled={isProcessing}
                    >
                        {isProcessing ? btnText.confirm.duringActionText : btnText.confirm.beforeActionText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

ConfirmationModal.propTypes = {
    isOpen: propTypes.bool.isRequired,
    onRequestClose: propTypes.func.isRequired,
    onConfirm: propTypes.func.isRequired,
    shouldCloseOnOverlayClick: propTypes.bool,
    shouldCloseOnEsc: propTypes.bool,
    heading: propTypes.string.isRequired,
    message: propTypes.string.isRequired,
    isProcessing: propTypes.bool.isRequired,
    btnText: propTypes.object.isRequired
};

export default ConfirmationModal;
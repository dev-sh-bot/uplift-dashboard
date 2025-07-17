import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ITEM_HEIGHT = 40; // Estimated height of each menu item in pixels

const DropdownMenu = React.memo(({ options, menuButtonLabel, spaceBetweenInPercent, widthAsClass }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState('bottom');
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleOutsideClick = useCallback((event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    }, []);

    const updateMenuPosition = useCallback(() => {
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const spaceBelow = windowHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;
            const menuHeight = options.length * ITEM_HEIGHT;

            setMenuPosition(spaceBelow < menuHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
        }
    }, [options.length]);

    const toggleMenu = useCallback(() => {
        if (!isOpen) {
            updateMenuPosition();
        }
        setIsOpen(!isOpen);
    }, [isOpen, updateMenuPosition]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            window.addEventListener('scroll', updateMenuPosition);
            window.addEventListener('resize', updateMenuPosition);

            return () => {
                document.removeEventListener('mousedown', handleOutsideClick);
                window.removeEventListener('scroll', updateMenuPosition);
                window.removeEventListener('resize', updateMenuPosition);
            };
        }
    }, [isOpen, handleOutsideClick, updateMenuPosition]);

    const menuStyle = useMemo(() => ({
        [menuPosition === 'bottom' ? 'top' : 'bottom']: `${spaceBetweenInPercent}%`,
        maxHeight: '300px',
        overflowY: 'auto',
        display: isOpen ? 'block' : 'none',
        // Animations are handled via CSS classes
    }), [menuPosition, isOpen]);

    return (
        <div className="relative inline-block text-left">
            <button ref={buttonRef} onClick={toggleMenu}>
                {menuButtonLabel}
            </button>

            <div
                ref={menuRef}
                className={`absolute z-10 right-0 ${widthAsClass} origin-top-right rounded-xl bg-white dark:bg-facebook-card shadow-lg dark:shadow-gray-900/20 ring-1 ring-black ring-opacity-5 dark:ring-facebook-border ${isOpen ? 'fade-in' : 'fade-out'}`}
                style={menuStyle}
            >
                <ul className="py-2">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover transition-colors"
                        >
                            {option.type === 'link' ? (
                                <Link
                                    to={option.href}
                                    className="block w-full text-left"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {option.label}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        option.action();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left"
                                >
                                    {option.label}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
});

DropdownMenu.displayName = 'CustomDropdown';

DropdownMenu.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(['link', 'button']).isRequired,
            label: PropTypes.string.isRequired,
            href: PropTypes.string,
            action: PropTypes.func,
        })
    ).isRequired,
    menuButtonLabel: PropTypes.node.isRequired,
    spaceBetweenInPercent: PropTypes.number,
    widthAsClass: PropTypes.string,
};

export default DropdownMenu;
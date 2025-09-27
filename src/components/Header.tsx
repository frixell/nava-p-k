import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleMenu } from '../reducers/navigation';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const isMenuOpen = useAppSelector((state) => state.navigation.isMenuOpen);

    const handleToggleMenu = () => {
        dispatch(toggleMenu());
    };

    return (
        <header className="header">
            <NavLink to="/" className="header__title"><h1>Nava Kainer</h1></NavLink>
            <button onClick={handleToggleMenu} className="menu-toggle-button">
                {isMenuOpen ? 'Close' : 'Menu'}
            </button>
            <nav className={`main-nav ${isMenuOpen ? 'is-open' : ''}`}>
                {/* Add your navigation links here */}
            </nav>
        </header>
    );
};

export default Header;
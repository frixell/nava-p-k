import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, getInitialState } from './src/tests/test-utils';
import Header from './src/components/Header';

describe('<Header />', () => {
    it('should render the header with the title and menu button', () => {
        const preloadedState = getInitialState({
            navigation: { isMenuOpen: false },
        });

        // Use the new utility to render the component with a specific initial state
        renderWithProviders(<Header />, { preloadedState });

        expect(screen.getByText('Nava Kainer')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Menu/i })).toBeInTheDocument();
    });
});
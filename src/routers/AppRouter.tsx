import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Header from '../components/Header';
import HomePage from '../components/HomePage';
import AboutPage from '../components/AboutPage';
import CVPage from '../components/CVPage';
import TeachingPage from '../components/TeachingPage';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import AdminDashboardPage from '../components/AdminDashboardPage';

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/cv" element={<CVPage />} />
                <Route path="/teaching" element={<TeachingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <AdminDashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    </BrowserRouter>
);

export default AppRouter;
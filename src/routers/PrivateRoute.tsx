import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';

interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const uid = useAppSelector((state) => state.auth.uid);
    return uid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
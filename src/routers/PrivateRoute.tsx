import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../types/store';

interface PrivateRouteProps {
  redirectTo?: string;
  children?: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectTo = '/', children }) => {
  const isAuthenticated = useSelector<RootState, boolean>((state) => !!state.auth?.uid);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ?? <Outlet />;
};

export default PrivateRoute;

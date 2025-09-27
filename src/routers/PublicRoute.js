import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

// destructure props to get authentication and select component to serve
export const PublicRoute = ({
    isAuthenticated,
    children
}) => {
    return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid
});

export default connect(mapStateToProps)(PublicRoute);
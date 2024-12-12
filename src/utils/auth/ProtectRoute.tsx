import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import React from 'react';
import { UI_ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
    roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, roles }) => {
    const { accessToken, userRole } = useSelector((state: RootState) => state.auth);

    // If not authenticated, redirect to login
    if (!accessToken) {
        return <Navigate to={UI_ROUTES.LOGIN} replace />;
    }

    // If user role is not in the allowed roles, redirect to unauthorized or home
    if (roles && !roles.includes(userRole || '')) {
        return <Navigate to={UI_ROUTES.ACCESS_DENIED} replace />;
    }

    // If authenticated and authorized, render the component
    return <Component />;
};

export default ProtectedRoute;

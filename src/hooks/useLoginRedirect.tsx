import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { UI_ROUTES } from '@/constants/routes';

/**
 * Custom hook to redirect authenticated users from login page
 */
export const useLoginRedirect = () => {
    const navigate = useNavigate();
    const { accessToken, isExpired } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        if (accessToken && !isExpired) {
            navigate(UI_ROUTES.MASTER, { replace: true });
        }
        setLoading(false);

    }, [accessToken, isExpired, navigate]);
    return {
        isAuthenticated: !!accessToken && !isExpired,
        loading,
    };
};
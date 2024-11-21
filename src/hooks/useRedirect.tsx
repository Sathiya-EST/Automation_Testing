import { UI_ROUTES } from '@/constants/routes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRedirectAfterLogin = (isLoggedIn: boolean) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate(UI_ROUTES.MASTER);
        }
    }, [isLoggedIn, navigate]);
};

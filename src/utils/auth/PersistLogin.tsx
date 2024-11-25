import { UI_ROUTES } from '@/constants/routes';
import getNewAccessToken from '@/store/services/getNewAccessToken';
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setTokens } from '@/store/slice/authSlice';
import Spinner from '@/components/shared/Spinner';

const PersistLogin: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            if (!accessToken && !refreshToken) {
                setIsAuthenticated(false);
                navigate(UI_ROUTES.LOGIN);
                setLoading(false);
                return;
            }

            if (!accessToken && refreshToken) {
                const refreshedTokens = await getNewAccessToken('', refreshToken, navigate);

                if (refreshedTokens && refreshedTokens.accessToken) {
                    dispatch(setTokens({ accessToken: refreshedTokens.accessToken, refreshToken: refreshedTokens.refreshToken || refreshToken }));
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate(UI_ROUTES.LOGIN);
                }
                setLoading(false);
                return;
            }

            if (accessToken) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate(UI_ROUTES.LOGIN);
            }

            setLoading(false);
        };

        checkAuth();
    }, [accessToken, refreshToken, dispatch, navigate]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
                <Spinner />
            </div>
        );
    }


    return isAuthenticated ? <Outlet /> : null;
};

export default PersistLogin;

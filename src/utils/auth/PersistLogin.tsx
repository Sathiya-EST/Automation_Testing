import { UI_ROUTES } from '@/constants/routes';
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearTokens, setTokens } from '@/store/slice/authSlice';
import Spinner from '@/components/shared/Spinner';
import { useGetNewTokenMutation } from '@/store/services/auth/login';

const PersistLogin: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [getNewToken] = useGetNewTokenMutation();
    const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);

            if (!accessToken && !refreshToken) {
                setIsAuthenticated(false);
                navigate(UI_ROUTES.LOGIN);
                setLoading(false);
                return;
            }

            if (!accessToken && refreshToken) {
                try {
                    const response = await getNewToken({}).unwrap();

                    if (response && response.accessToken) {
                        dispatch(
                            setTokens({
                                accessToken: response.accessToken,
                                refreshToken: response.refreshToken || refreshToken,
                                userName: response.userName || null,
                                userRole: response.userRole || null,
                            })
                        );
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                        navigate(UI_ROUTES.LOGIN);
                    }
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    setIsAuthenticated(false);
                    navigate(UI_ROUTES.LOGIN);
                    dispatch(clearTokens());
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
    }, [accessToken, refreshToken, dispatch, navigate, getNewToken]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                <Spinner />
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : null;
};

export default PersistLogin;

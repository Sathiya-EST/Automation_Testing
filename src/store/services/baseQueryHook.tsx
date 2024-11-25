import { fetchBaseQuery, FetchArgs, BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { clearTokens, setIsExpired } from '../slice/authSlice';
import { RootState } from '../';
import getNewAccessToken from './getNewAccessToken';


const baseQueryWithAuth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState;
    const { accessToken, refreshToken } = state.auth;

    if (!accessToken || !refreshToken) {
        console.error('No access token or refresh token available.');
        return { error: { status: 401, data: 'Missing tokens' } };
    }

    const customBaseQuery = fetchBaseQuery({
        baseUrl: '',
        prepareHeaders: (headers) => {
            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`);
            }
            return headers;
        },
    });

    let result = await customBaseQuery(args, api, extraOptions);

    if (result.error?.originalStatus === 401) {

        if (refreshToken) {
            const refreshedTokens = await getNewAccessToken(refreshToken, api, extraOptions);

            if (refreshedTokens) {
                const { accessToken: newAccessToken } = refreshedTokens;
                result = await customBaseQuery(
                    { ...args, headers: { Authorization: `Bearer ${newAccessToken}` } },
                    api,
                    extraOptions
                );
            } else {
                console.error('Failed to refresh token, redirecting to login.');
                api.dispatch(setIsExpired(true));
            }
        } else {
            console.error('No refresh token available to refresh the access token.');
            api.dispatch(setIsExpired(true));
            api.dispatch(clearTokens());
        }
    }

    return result;
};

export default baseQueryWithAuth;

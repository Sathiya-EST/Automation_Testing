import { fetchBaseQuery, FetchArgs, BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { clearTokens, setIsExpired } from '../slice/authSlice';
import { RootState } from '../';
import getNewAccessToken from './getNewAccessToken';

const baseQueryWithAuth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState;
    const { accessToken, refreshToken } = state.auth;
    console.log("Tokens", accessToken, refreshToken);

    if (!accessToken || !refreshToken) {
        console.error('No access token or refresh token available.');
        return { error: { status: 401, data: 'Missing tokens' } };
    }

    // Custom base query for making API requests with the access token
    const customBaseQuery = fetchBaseQuery({
        baseUrl: '',
        prepareHeaders: (headers) => {
            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`);
            }
            return headers;
        },
    });

    // Send the original request
    let result = await customBaseQuery(args, api, extraOptions);

    // Check if the result is a 401 Unauthorized error
    if (result.error?.originalStatus === 401) {
        console.log('Received 401, attempting to refresh token...');

        if (refreshToken) {
            // Use getNewAccessToken to attempt to refresh the token
            const refreshedTokens = await getNewAccessToken(refreshToken, api, extraOptions);

            if (refreshedTokens) {
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshedTokens;
                // Retry the original request with the new access token
                result = await customBaseQuery(
                    { ...args, headers: { Authorization: `Bearer ${newAccessToken}` } },
                    api,
                    extraOptions
                );
            } else {
                console.error('Failed to refresh token, redirecting to login.');
                // Optionally, handle user redirection to login or show a session expired message
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

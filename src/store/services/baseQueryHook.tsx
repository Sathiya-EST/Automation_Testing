import { fetchBaseQuery, FetchArgs, BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setTokens, clearTokens } from '../slice/authSlice';
import { RootState } from '../';
import { USER_API } from '@/constants/api.constants';

interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

const baseQueryWithAuth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState;
    const { accessToken, refreshToken } = state.auth;

    if (!accessToken || !refreshToken) {
        console.error('No access token or refresh token available.');
        return { error: { status: 401, message: 'Missing tokens' } };
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

    // Send the original request
    let result = await customBaseQuery(args, api, extraOptions);
    console.log("xxxxxxx", result);
    console.log("xxxxxxx22", result.error);
    console.log("xxxxxxx22333", result.error?.status);
    console.log("xxxxxxx2233344", result.error?.originalStatus);

    // Check if the result is a 401 Unauthorized error
    if (result.error && result.error.originalStatus === 401) {
        console.log('Received 401, attempting to refresh token...');

        if (refreshToken) {
            // Try to refresh the token
            const refreshResponse = await customBaseQuery(
                {
                    url: USER_API.REFRESH_TOKEN,
                    method: 'POST',
                    body: { refresh_token: refreshToken },
                },
                api,
                extraOptions
            );

            // Check for invalid token format (XML or non-JSON response)
            if (refreshResponse.error) {
                const errorData = refreshResponse.error.data;
                if (errorData && typeof errorData === 'string' && errorData.startsWith('<')) {
                    // If the response starts with '<', we likely have XML or HTML
                    console.error('Received non-JSON error response:', errorData);
                    // Handle the XML response or throw an error to stop further processing
                    return { error: { status: 401, message: 'Invalid token or unexpected response format' } };
                }
            }

            // If the refresh token request is successful (in JSON format)
            if (refreshResponse.data) {
                const { access_token, refresh_token } = refreshResponse.data as RefreshTokenResponse;
                console.log('Successfully refreshed tokens.');

                // Dispatch the new tokens to Redux
                api.dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token }));

                // Retry the original request with the new access token
                result = await customBaseQuery(args, api, extraOptions);
            } else {
                // If the refresh token request fails, clear the tokens from Redux
                console.error('Failed to refresh token:', refreshResponse.error);
                api.dispatch(clearTokens());
            }
        } else {
            console.error('No refresh token available to refresh the access token.');
        }
    }

    return result;
};

export default baseQueryWithAuth;

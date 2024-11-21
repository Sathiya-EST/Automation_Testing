import { fetchBaseQuery, FetchArgs, BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setTokens, clearTokens } from '../slice/authSlice';
import { RootState } from '../'
import { USER_API } from '@/constants/api.constants';
interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}


const baseQueryWithRefresh: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState;
    const { accessToken, refreshToken } = state.auth;

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

    if (result.error && result.error.status === 401 && refreshToken) {
        const refreshResponse = await customBaseQuery(
            {
                url: USER_API.REFRESH_TOKEN,
                method: 'POST',
                body: { refresh_token: refreshToken },
            },
            api,
            extraOptions
        );

        // If the refresh token request succeeds
        if (refreshResponse.data) {
            const { access_token, refresh_token } = refreshResponse.data as RefreshTokenResponse;

            // Dispatch the new tokens to Redux
            api.dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token }));

            // Retry the original request with the new access token
            result = await customBaseQuery(args, api, extraOptions);
        } else {
            // If refresh token fails, clear the tokens from Redux
            api.dispatch(clearTokens());
            console.error('Failed to refresh token:', refreshResponse.error);
        }
    }

    return result;
};

export default baseQueryWithRefresh;

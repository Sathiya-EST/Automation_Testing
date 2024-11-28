import { USER_API } from "@/constants/api.constants";
import { fetchBaseQuery, BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { setTokens, clearTokens, setIsExpired } from "../slice/authSlice";
import { authHeader } from "./auth/login";

interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
    user_name: string;
    user_role: string;
}

interface TokenRefreshResult {
    accessToken: string;
    refreshToken: string;
    userName: string | null;
    userRole: string | null;
}


const getNewAccessToken = async (
    refreshToken: string,
    api: BaseQueryApi,
    extraOptions: any
): Promise<TokenRefreshResult | null> => {
    const baseQuery = fetchBaseQuery({
        baseUrl: USER_API.LOGIN_CREATOR,
    });

    try {
        const formData = new URLSearchParams();
        formData.append('refresh_token', refreshToken);
        formData.append('grant_type', 'refresh_token');

        const refreshResponse = await baseQuery(
            {
                url: '',
                method: 'POST',
                body: formData.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: authHeader,
                },
            },
            api,
            extraOptions
        );

        if (refreshResponse.error) {
            console.error('Failed to refresh token:', refreshResponse.error);
            api.dispatch(clearTokens());
            api.dispatch(setIsExpired(true));
            return null;
        }

        if (refreshResponse.data) {
            const { access_token, refresh_token, user_name, user_role } = refreshResponse.data as RefreshTokenResponse;
            console.log('Successfully refreshed tokens.');

            api.dispatch(setTokens({
                accessToken: access_token,
                refreshToken: refresh_token,
                userName: user_name || null,
                userRole: user_role || null,
            }));

            return {
                accessToken: access_token,
                refreshToken: refresh_token,
                userName: user_name || null,
                userRole: user_role || null,
            };
        }

        console.error('Unexpected error during token refresh.');
        api.dispatch(clearTokens());
        return null;

    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

export default getNewAccessToken;

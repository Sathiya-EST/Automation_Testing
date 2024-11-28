import { USER_API } from '@/constants/api.constants';
import { sanitizeInput } from '@/utils/sanitizatization';
import { getToken } from '@/utils/securels';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID;
const API_CLIENT_PASSWORD = import.meta.env.VITE_API_CLIENT_PASSWORD;

export const authHeader = 'Basic ' + btoa(API_CLIENT_ID + ':' + API_CLIENT_PASSWORD);

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: USER_API.LOGIN_CREATOR }),
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (credentials) => {
                // Sanitize the credentials
                const sanitizedUserId = sanitizeInput(credentials.userId);
                const sanitizedPassword = sanitizeInput(credentials.password);

                // Prepare the form data for the API request
                const formData = new URLSearchParams();
                formData.append('username', sanitizedUserId);
                formData.append('password', sanitizedPassword);
                formData.append('grant_type', 'password');

                return {
                    url: '',
                    method: 'POST',
                    body: formData.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: authHeader,
                    },
                };
            },
        }),
        getNewToken: builder.mutation({
            query: () => {
                const refreshToken = getToken('refreshToken')
                const formData = new URLSearchParams();
                formData.append('refreshToken', refreshToken);
                formData.append('grant_type', 'password');

                return {
                    url: '',
                    method: 'POST',
                    body: formData.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: authHeader,
                    },
                };
            }
        })
    }),
});

export const { useSignInMutation, useGetNewTokenMutation } = authApi;

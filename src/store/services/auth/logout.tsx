import { USER_API } from '@/constants/api.constants';
import { clearTokens } from '@/store/slice/authSlice';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuth from '../baseQueryHook';

export const revokeApi = createApi({
    reducerPath: 'revokeApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        signOut: builder.mutation({
            query: () => ({
                url: USER_API.LOGOUT,
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(clearTokens());
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
        }),/* ({ baseUrl: USER_API.LOGOUT }) */
    }),
});

export const { useSignOutMutation } = revokeApi
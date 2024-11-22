import { USER_API } from '@/constants/api.constants';
import { clearTokens } from '@/store/slice/authSlice';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const revokeApi = createApi({
    reducerPath: 'revokeApi',
    baseQuery: fetchBaseQuery({ baseUrl: USER_API.LOGOUT }),
    endpoints: (builder) => ({
        signOut: builder.mutation({
            query: () => ({
                url: '',
                method: 'POST',
            }),
            // async onQueryStarted(_, { dispatch, queryFulfilled }) {
            //     try {
            //         await queryFulfilled;
            //         dispatch(clearTokens());
            //     } catch (error) {
            //         console.error('Logout failed:', error);
            //     }
            // },
        }),
    }),
});

export const { useSignOutMutation } = revokeApi
import { MASTER_API } from '@/constants/api.constants';
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuth from '../baseQueryHook';

export const masterApi = createApi({
    reducerPath: 'masterApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getLog: builder.query({
            query: () => ({ url: MASTER_API.LOG }),
        }),
    }),
});

export const { useGetLogQuery } = masterApi
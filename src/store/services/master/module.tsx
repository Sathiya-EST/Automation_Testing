import { MASTER_API } from '@/constants/api.constants';
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuth from '../baseQueryHook';

export const masterApi = createApi({
    reducerPath: 'MasterApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getLog: builder.query({
            query: () => ({ url: MASTER_API.LOG }),
        }),
        getModule: builder.mutation({
            query: ({ pageNo, pageSize, sort, filters }) => ({
                url: MASTER_API.GET_MODULES,
                method: 'POST',
                body: {
                    pageNo,
                    pageSize,
                    sort: sort,
                    filters: filters,
                },
            }),
        }),
        getForms: builder.query({
            query: ({ pageNo, pageSize, sort, filters }) => ({
                url: MASTER_API.GET_MODULES,
                method: 'POST',
                body: {
                    pageNo,
                    pageSize,
                    sort: sort,
                    filters: filters,
                },
            }),
        })
    }),
});

export const { useGetLogQuery, useGetModuleMutation } = masterApi
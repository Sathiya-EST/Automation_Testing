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
        postModule: builder.mutation({
            query: ({ moduleName, moduleDescription }) => ({
                url: MASTER_API.CREATE_MODULE,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
                },
                body: {
                    moduleName,
                    moduleDescription,
                },
            }),
        }),
    }),
});

export const { useGetLogQuery, useGetModuleMutation, usePostModuleMutation } = masterApi
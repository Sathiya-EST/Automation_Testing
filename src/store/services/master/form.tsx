import { MASTER_API } from '@/constants/api.constants';
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuth from '../baseQueryHook';

export const formApi = createApi({
    reducerPath: 'FormApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getForms: builder.query({
            query: ({ pageNo, pageSize, sort, filters }) => ({
                url: MASTER_API.GET_FORMS_BY_MODULE,
                method: 'POST',
                body: {
                    pageNo,
                    pageSize,
                    sort: sort || [
                        {
                            key: 'createdOn',
                            order: 'ASC',
                        },
                    ],
                    filters: filters
                },
            }),
        }),
    }),
});

export const { useGetFormsQuery } = formApi;

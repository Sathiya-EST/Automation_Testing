import { createApi } from '@reduxjs/toolkit/query/react';
import { MASTER_API } from '@/constants/api.constants';
import baseQueryWithAuth from '../baseQueryHook';
import { DataTypes, FormFieldsType } from '@/types/data';
import { FormType } from '@/pages/master/components/CreateFormComp';

interface ApiResponse {
    success: boolean;
    message?: string;
    // Add any additional response fields you expect from the API
}

interface GetDataTypesResponse {
    data: DataTypes[];
    totalRecords: number;
}

interface AsyncDataResponse {
    data: any[];
    totalRecords: number;
}

interface AsyncDataParams {
    pageNo: number;
    pageSize: number;
    formName: string;
    fieldName?: string;
    searchQuery?: string;
}

interface TransformedAsyncData {
    transformedData: any[];
    totalRecords: number;
}

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
                    filters: filters,
                },
            }),
        }),

        getDataTypes: builder.query<DataTypes[], void>({
            query: () => ({
                url: MASTER_API.GET_DATA_TYPES,
                method: 'POST',
                body: {
                    pageNo: 1,
                    pageSize: 50,
                    sort: [],
                    filters: [],
                },
            }),
            transformResponse: (response: GetDataTypesResponse) => {
                return response.data;
            },
        }),

        createForm: builder.mutation({
            query: ({ data }: { data: FormType }) => ({
                url: MASTER_API.CREATE_FORM,
                method: 'POST',
                body: data,
            }),
        }),

        getFormPreview: builder.query<FormFieldsType, string>({
            query: (formName) => ({
                url: `${MASTER_API.PREVIEW_FORM}?formName=${formName}`,
                method: 'GET',
            }),
        }),

        getFormAsyncData: builder.query<TransformedAsyncData, AsyncDataParams>({
            query: ({ pageNo, pageSize, formName, fieldName, searchQuery }) => ({
                url: `${MASTER_API.GET_ASYNCDATA}?formName=${formName}`,
                method: 'POST',
                body: {
                    pageNo,
                    pageSize,
                    sort: [
                        {
                            key: "custom_strudent_id",
                            order: "ASC",
                        },
                    ],
                    filters: [],
                },
            }),
            transformResponse: (response: AsyncDataResponse, _meta, arg) => {
                const { fieldName, searchQuery } = arg;

                // Validate response structure
                if (!response || !response.data) {
                    return { transformedData: [], totalRecords: 0 };
                }

                // If fieldName is provided, filter and transform accordingly
                if (fieldName) {
                    const transformedData = response.data
                        .map((item: any) => ({
                            value: item[fieldName]?.toString() || '',
                            label: item[fieldName]?.toString() || '',
                        }))
                        .filter((item) =>
                            !searchQuery ||
                            item.label.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                    return {
                        transformedData,
                        totalRecords: response.totalRecords,
                    };
                }

                // Default transformation for other cases
                return {
                    transformedData: response.data,
                    totalRecords: response.totalRecords,
                };
            },
        }),

        updateForm: builder.mutation<ApiResponse, { formName: string; data: FormType }>({
            query: ({ formName, data }) => ({
                url: `${MASTER_API.UPDATE_FORM}?formName=${formName}`,
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetFormsQuery,
    useGetDataTypesQuery,
    useCreateFormMutation,
    useGetFormPreviewQuery,
    useLazyGetFormAsyncDataQuery,
    useGetFormAsyncDataQuery,
    useUpdateFormMutation,
} = formApi;

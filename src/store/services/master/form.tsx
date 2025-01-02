import { createApi } from '@reduxjs/toolkit/query/react';
import { MASTER_API } from '@/constants/api.constants';
import baseQueryWithAuth from '../baseQueryHook';
import { DataTypes, FileUploadData, FormFieldsType, FormViewData, GetReqParams, publishDataType, ResponseType } from '@/types/data';
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

interface RolesQueryProps {
    formName: string;
    pageNo?: number;
    pageSize?: number;
    accessKey: string
}

type TableColumn = {
    accessorKey: string;
    header: string;
    cell?: (info: { row: any }) => React.ReactNode;
};
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
            transformErrorResponse: (error: any) => {
                return error?.data || { message: "Error Occured" };
            },
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
                            key: fieldName,
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

        getModuleOptions: builder.query<{
            moduleOptions: { label: string; value: string }[];
            formOptions: { label: string; value: string }[];
        }, { pageNo: number; pageSize: number; sort?: any[]; filters?: any[]; selectedModuleName?: string | null }>({
            query: ({ pageNo, pageSize, sort = [], filters = [] }) => ({
                url: MASTER_API.GET_MODULES,
                method: 'POST',
                body: {
                    pageNo,
                    pageSize,
                    sort,
                    filters,
                },
            }),
            transformResponse: (response: { data: any[] }, meta, arg) => {
                const selectedModuleName = arg.selectedModuleName;

                return {
                    moduleOptions: response.data.map((module) => ({
                        label: module.moduleName,
                        value: module.moduleName,
                    })),
                    formOptions: response.data
                        .filter((module) =>
                            selectedModuleName && module.moduleName === selectedModuleName
                        )
                        .flatMap((module) =>
                            module.formList?.map((form: { formId: string; formName: string }) => ({
                                label: form.formName,
                                value: form.formId,
                            })) || []
                        ),
                };
            },
        }),

        getAsyncFormFields: builder.query<{ options: { label: string; value: string }[] }, string>({
            query: (formName) => {
                if (!formName) {
                    throw new Error("formName cannot be null or empty");
                }

                return {
                    url: `${MASTER_API.PREVIEW_FORM}?formName=${formName}`,
                    method: 'GET',
                };
            },
            transformResponse: (response: { fields: { name: string; label: string; field: { uniqueValue: boolean; required: boolean; readOnly: boolean } }[] }) => {
                if (!response || !response.fields) {
                    return { options: [] };
                }
                const filteredFields = response.fields.filter(field =>
                    field.field.uniqueValue === true &&
                    field.field.required === true &&
                    field.field.readOnly === true
                );
                return {
                    options: filteredFields.map((field) => ({
                        label: field.label,
                        value: field.name,
                    })),
                };
            },
        }),

        getPublishOptions: builder.query<any, RolesQueryProps>({
            query: ({ formName, pageNo = 1, pageSize = 1000, accessKey }) => ({
                url: `${MASTER_API.GET_ROLES}?formName=${formName}`,
                method: 'POST',
                body: {
                    pageNo,
                    pageSize,
                    sort: [],
                    filters: [],
                },
            }),
            transformResponse: (response: { data: any[] }, meta, arg) => {
                return response.data.map((item) => ({
                    label: item[arg.accessKey],
                    value: item[arg.accessKey],
                }));
            },
        }),

        publishForm: builder.mutation<ApiResponse, { formName: string; publishData: publishDataType | { isPublished: boolean } }>({
            query: ({ formName, publishData }) => ({
                url: `${MASTER_API.PUBLISH_FORM}?formName=${formName}`,
                method: 'PUT',
                body: publishData,
            }),
        }),

        getFormListData: builder.query<ResponseType, { reqParams: GetReqParams; formName: string }>({
            query: ({ reqParams, formName }) => ({
                url: `${MASTER_API.GET_FORM_RECORD_LIST}?formName=${formName}`,
                method: 'POST',
                body: {
                    pageNo: reqParams.pageNo,
                    pageSize: reqParams.pageSize,
                    sort: reqParams.sort || [
                        {
                            key: 'createdOn',
                            order: 'ASC',
                        },
                    ],
                    filters: reqParams.filters,
                },
            }),
        }),

        getFormListColumns: builder.query<{ columnData: TableColumn[]; data: FormViewData }, { formName: string }>({
            query: ({ formName }) => ({
                url: `${MASTER_API.GET_FORMDATA_COLUMNS}?formName=${formName}`,
                method: 'GET',
            }),
            transformResponse: (response: FormViewData): { columnData: TableColumn[]; data: FormViewData } => {
                const columnData: TableColumn[] = response.fields.map((column) => ({
                    accessorKey: column.name,
                    header: column.label,
                }));
                return { columnData, data: response };
            },
        }),

        getFormRecord: builder.query<Record<string, any>, { formName: string; formId: string }>({
            query: ({ formName, formId }) => ({
                url: `${MASTER_API.GET_FORM_RECORD_VIEW}?formName=${formName}&idPk=${formId}`,
                method: 'GET',
            }),
        }),

        addRecord: builder.mutation<ApiResponse, { formName: string; data: any }>({
            query: ({ formName, data }) => ({
                url: `${MASTER_API.ADD_RECORD}?formName=${formName}`,
                method: 'POST',
                body: data,
            }),
        }),

        updateRecord: builder.mutation<ApiResponse, { formName: string; formIdpk: string, data: any }>({
            query: ({ formName, formIdpk, data }) => ({
                url: `${MASTER_API.UPDATE_RECORD}?formName=${formName}&idPk=${formIdpk}`,
                method: 'PUT',
                body: data,
            }),
        }),

        deleteRecord: builder.mutation<ApiResponse, { formName: string; formIdpk: string }>({
            query: ({ formName, formIdpk }) => ({
                url: `${MASTER_API.DELETE_RECORD}?formName=${formName}&idPk=${formIdpk}`,
                method: 'DELETE',
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
    useGetModuleOptionsQuery,
    useGetAsyncFormFieldsQuery,
    useGetPublishOptionsQuery,
    usePublishFormMutation,
    useGetFormListDataQuery,
    useGetFormListColumnsQuery,
    useGetFormRecordQuery,
    useAddRecordMutation,
    useUpdateRecordMutation,
    useDeleteRecordMutation
} = formApi;

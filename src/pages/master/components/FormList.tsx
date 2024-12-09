import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import FormTable from "./FormTable";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/shared/Search";
import { Eye, Plus } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination";
import { useGetFormsQuery } from "@/store/services/master/form";
import { skipToken } from "@reduxjs/toolkit/query";
import AdvancedTable from "@/components/shared/Table";
import { Badge } from "@/components/ui/badge";
import { UI_ROUTES } from "@/constants/routes";
import Text from "@/components/shared/Text";
import { TableRequestParams } from "@/types/data";
import Spinner from "@/components/shared/Spinner";

interface MasterColumns {
    displayName: string;
    formDescription: string;
    formName: string;
    isPublished: boolean
}

const FormList: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const [query, setQuery] = useState<string | null>(null);
    // const [pageSize, setPageSize] = useState<number>(1);
    // const [pageNo, setPageNo] = useState<number>(1);
    const context = useOutletContext<{ selectedModuleId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [requestParams, setRequestParams] = useState<TableRequestParams>({
        pageNo: 1,
        pageSize: 10,
        sort: [{ key: 'createdOn', order: 'ASC' }],
        filters: moduleId
            ? [
                {
                    key: "moduleName",
                    operator: "EQUAL",
                    field_type: "STRING",
                    value: moduleId,
                },
            ]
            : [],
    });

    const onRequestParamsChange = (updatedParams: Partial<TableRequestParams>) => {
        setRequestParams((prevParams) => ({
            ...prevParams,
            ...updatedParams,
        }));
    };

    const handleView = (formName: string) => {
        navigate(UI_ROUTES.MASTER_FORM_PREVIEW, { state: { formName } });

    };
    const handleCreate = () => {
        navigate(UI_ROUTES.MASTER_FORM_CREATE, { state: { context } });
    };

    const { data, isLoading, error } = useGetFormsQuery(requestParams);
    const columns = [

        {
            accessorKey: 'displayName',
            header: 'Form Name',
            initiallyVisible: true
        },
        {
            accessorKey: 'formDescription',
            header: 'Description',
            maxSize: 500,
            size: 400,
            initiallyVisible: false
        },
        {
            accessorKey: 'createdBy',
            header: 'Created By',
        },
        {
            accessorKey: 'isPublished',
            header: 'Status',
            cell: (info: any) => (
                <Badge className={`text-xs text-white ${info.getValue() ? 'bg-green-400 text-green-900 hover:bg-green-600' : 'bg-red-400 text-red-900 hover:bg-red-600'}`}>
                    {info.getValue() ? 'Published' : 'unPublished'}
                </Badge>
            ),
            initiallyVisible: true

        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: (info: any) => {
                const formName = info.row.original.formName;
                return (
                    <Button
                        variant="default"
                        className="text-white text-[10px] h-[32px] rounded flex items-center justify-center px-4 py-1 border-none"
                        onClick={() => handleView(formName)}
                    >
                        <Eye className="mr-2 w-4 h-4" />
                        View
                    </Button>
                );
            },
            initiallyVisible: true

        }

    ];
    const handleAddFilter = (key: string, operator: string, field_type: string, value: any) => {
        setRequestParams((prevParams) => {
            const existingFilterIndex = prevParams.filters.findIndex(filter => filter.key === key);

            if (existingFilterIndex !== -1) {
                const updatedFilters = [...prevParams.filters];
                updatedFilters[existingFilterIndex] = {
                    ...updatedFilters[existingFilterIndex],
                    value,
                };

                return {
                    ...prevParams,
                    filters: updatedFilters,
                };
            }

            // If it doesn't exist, add a new filter
            return {
                ...prevParams,
                filters: [
                    ...prevParams.filters,
                    { key, operator, field_type, value },
                ],
            };
        });
    };

    const handleSearch = (query: string) => {
        const key = 'default_search_criteria';
        const operator = 'LIKE';
        const field_type = 'STRING';
        const value = query;

        handleAddFilter(key, operator, field_type, value);
    };

    return (
        <div className="p-4 space-y-1 bg-card">
            <Text className="text-lg font-bold">{moduleId}</Text>
            <div className="flex items-center space-x-4">
                <SearchInput
                    onSearch={(query: string) => handleSearch(query)}
                    className="flex-1 "
                />
                <Button variant="default" className="rounded text-white" onClick={handleCreate}>
                    <Plus size={18} strokeWidth={3} />
                    Create Form
                </Button>
            </div>
            {isLoading && <Spinner />}
            {data &&
                <AdvancedTable<MasterColumns>
                    columns={columns}
                    data={data.data || []}
                    totalCount={data?.totalRecords || 5}
                    requestParams={requestParams}
                    onRequestParamsChange={onRequestParamsChange}
                />
            }
        </div>
    );
};

export default FormList;

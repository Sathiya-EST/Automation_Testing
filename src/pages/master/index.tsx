import useBreadcrumb from "@/hooks/useBreadCrumb";
import { BreadcrumbItemType, GetReqParams, TableRequestParams } from "@/types/data";
import { useMemo, useState, useEffect, useCallback } from "react";
import ModuleList from "./components/ModuleList";
import { useNavigate } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useGetModuleMutation, usePostModuleMutation } from "@/store/services/master/module";
import { UI_ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast";
import { useGetFormsQuery } from "@/store/services/master/form";
import AdvancedTable from "@/components/shared/Table";
import Spinner from "@/components/shared/Spinner";
import { Eye, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/shared/Search";
import Text from "@/components/shared/Text";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import StatusFilterDropdown, { StatusValue } from "./components/StatusFilter";

interface MasterColumns {
    displayName: string;
    formDescription: string;
    formName: string;
    isPublished: boolean
}

const Master = () => {

    const [getModule, { data, error: moduleError, isLoading: moduleLoading }] = useGetModuleMutation();
    const { toast } = useToast();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState([
        { key: 'createdOn', order: 'ASC' }
    ]);
    const [filters, setFilters] = useState([]);
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [requestParams, setRequestParams] = useState<GetReqParams>({
        pageNo: 1,
        pageSize: 10,
        sort: [{ key: 'createdOn', order: 'ASC' }],
        filters: selectedModule
            ? [
                {
                    key: "moduleName",
                    operator: "EQUAL",
                    field_type: "STRING",
                    value: selectedModule,
                },
            ]
            : [],
    });

    const [postModule, { isLoading: moduleAddLoading, isError: moduleAddErr }] = usePostModuleMutation();
    const {
        data: formData,
        isLoading: formLoading,
        error: formError
    } = useGetFormsQuery(requestParams);

    const columns = [
        {
            accessorKey: 'displayName',
            header: t('master.form.list.tableHeader.formName'),
            // initiallyVisible: true
        },
        {
            accessorKey: 'formDescription',
            header: t('master.form.list.tableHeader.formDesc'),
            maxSize: 500,
            size: 400,
            // initiallyVisible: false
        },
        // {
        //     accessorKey: 'createdBy',
        //     header: 'Created By',
        // },
        {
            accessorKey: 'isPublished',
            header: t('master.form.list.tableHeader.status'),
            cell: (info: any) => (
                <Badge className={`text-xs text-white ${info.getValue() ? 'bg-green-400 text-green-900 hover:bg-green-600' : 'bg-red-400 text-red-900 hover:bg-red-600'}`}>
                    {info.getValue() ? 'Published' : 'unPublished'}
                </Badge>
            ),
            // initiallyVisible: true

        },
        {
            accessorKey: 'action',
            header: t('master.form.list.tableHeader.action'),
            cell: (info: any) => {
                const formName = info.row.original.formName;
                return (
                    <Button
                        variant="default"
                        className="text-white text-[10px] h-[32px] rounded flex items-center justify-center px-4 py-1 border-none"
                        onClick={() => handleView(formName)}
                    >
                        <Eye className="w-4 h-4" />
                        View
                    </Button>
                );
            },
            // initiallyVisible: true

        }

    ];

    const onRequestParamsChange = (updatedParams: Partial<GetReqParams>) => {
        setRequestParams((prevParams) => ({
            ...prevParams,
            ...updatedParams,
        }));
    };

    const updatedRoutes: BreadcrumbItemType[] = useMemo(() => [
        { type: 'link', title: 'Master', path: UI_ROUTES.MASTER, isActive: false },
        { type: 'page', title: 'Form', isActive: true },
    ], []);

    useBreadcrumb(updatedRoutes);

    const handleAddModule = async (ModuleData: { moduleName: string, moduleDescription?: string }) => {
        try {
            await postModule(ModuleData).unwrap();

            toast({
                title: "Module Added Successfully",
                variant: "success",
            });

            // Refresh the module list
            await getModule({ pageNo, pageSize, sort, filters });
        } catch (err) {
            console.error("Failed to add module:", err);

            toast({
                title: "Error Adding Module",
                description: "Failed to add module. Please try again.",
                variant: "destructive",
                action: (
                    <ToastAction
                        altText="Try again"
                        onClick={() => handleAddModule(ModuleData)}
                    >
                        Retry
                    </ToastAction>
                ),
            });
        }
    };

    const handleModuleClick = useCallback((moduleName: string) => {
        setSelectedModule(moduleName);
        const key = 'moduleName';
        const operator = 'EQUAL';
        const field_type = 'STRING';
        const value = moduleName;
        handleAddFilter(key, operator, field_type, value);
    }, []);

    const fetchModules = useCallback(async () => {
        try {
            await getModule({ pageNo, pageSize, sort, filters });
        } catch (err) {
            toast({
                title: "Error Fetching Modules",
                description: "Failed to load modules. Please refresh the page.",
                variant: "destructive",
                action: (
                    <ToastAction
                        altText="Retry"
                        onClick={fetchModules}
                    >
                        Retry
                    </ToastAction>
                ),
            });
            console.error('Failed to fetch modules', err);
        }
    }, [getModule, pageNo, pageSize, sort, filters, toast]);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    const handleView = (formName: string) => {
        navigate(UI_ROUTES.MASTER_FORM_PREVIEW, { state: { formName, selectedModule } });
    };

    const handleCreate = () => {
        navigate(`${UI_ROUTES.MASTER_FORM_CREATE}`, { state: { selectedModule } });
    };

    const handleAddFilter = (key: string, operator: 'LIKE' | 'EQUAL', field_type: 'STRING' | 'BOOLEAN', value: string | boolean) => {
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

    const handleStatusChange = (status: StatusValue) => {
        const key = 'isPublished';
        const operator = 'EQUAL';
        const field_type = 'BOOLEAN';
        const value = status === 'published' ? true : false;

        if (status === 'all') {
            setRequestParams((prevParams) => {
                const updatedFilters = prevParams.filters.filter(filter => filter.key !== key);
                return {
                    ...prevParams,
                    filters: updatedFilters,
                };
            });
        } else {
            handleAddFilter(key, operator, field_type, value);
        }
    };

    // Error Handling Components
    const renderErrorAlert = (errorMessage: string) => (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {errorMessage}
            </AlertDescription>
        </Alert>
    );

    return (
        <div>
            <ResizablePanelGroup
                direction="horizontal"
                className="max-w-full rounded-lg border flex"
            >
                {/* First Panel (Module List) */}
                <ResizablePanel defaultSize={20} className="h-full flex-grow">
                    {moduleLoading ? (
                        <Spinner />
                    ) : moduleError ? (
                        renderErrorAlert("Failed to load modules")
                    ) : data ? (
                        <ModuleList
                            data={data.data}
                            handleModuleSelect={handleModuleClick}
                            showForm={false}
                            onAddModule={handleAddModule}
                        />
                    ) : (
                        <div>No modules available.</div>
                    )}
                </ResizablePanel>

                {/* Resizable Handle */}
                <ResizableHandle withHandle />

                {/* Second Panel (Form/Detail View) */}
                <ResizablePanel defaultSize={80} className="h-full bg-background flex-grow">
                    <div className="p-4 space-y-1 bg-card ">
                        <Text className="text-lg font-bold">{selectedModule}</Text>
                        <div className="flex items-center space-x-4">
                            <SearchInput
                                onSearch={(query: string) => handleSearch(query)}
                                className="flex-1"
                            />
                            <StatusFilterDropdown onFilterChange={handleStatusChange} />

                            <Button
                                variant="default"
                                className="rounded text-white"
                                onClick={handleCreate}
                                disabled={moduleAddLoading}
                            >
                                <Plus size={18} strokeWidth={3} />
                                {t('master.form.list.createBtn')}
                            </Button>
                        </div>
                        <div className="pt-1">
                            {/* Error Handling for Form Data */}
                            {formError && renderErrorAlert("Failed to load form data")}

                            {formLoading && <Spinner />}

                            {formData && formData.data && formData.data.length > 0 ? (
                                <AdvancedTable<MasterColumns>
                                    columns={columns}
                                    data={formData.data}
                                    totalCount={formData?.totalRecords || 5}
                                    requestParams={requestParams}
                                    onRequestParamsChange={onRequestParamsChange}
                                />
                            ) : (
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>No Data</AlertTitle>
                                    <AlertDescription>
                                        No forms found for the selected module.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default Master;
import useBreadcrumb from "@/hooks/useBreadCrumb";
import { Filter, GetReqParams } from "@/types/data";
import { useMemo, useState, useEffect, useCallback } from "react";
import ModuleList from "./components/ModuleList";
import { useNavigate } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useGetModuleMutation, usePostModuleMutation } from "@/store/services/master/module";
import { UI_ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useGetFormsQuery } from "@/store/services/master/form";
import AdvancedTable from "@/components/shared/Table";
import Spinner from "@/components/shared/Spinner";
import { Eye, Plus, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/shared/Search";
import Text from "@/components/shared/Text";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import StatusFilterDropdown, { StatusValue } from "./components/StatusFilter";
import ErrorAlert from "@/components/shared/ErrorAlert";
import ModuleSelectionPlaceholder from "./components/ModuleSelectionInfo";
import { useMediaQuery } from 'react-responsive';
interface MasterColumns {
    displayName: string;
    formDescription: string;
    formName: string;
    isPublished: boolean;
}

const Master = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [moduleSearchVal, setModuleSearchVal] = useState("");
    const [selectedModule, setSelectedModule] = useState<string | null>('');
    const [formReqParams, setFormReqParams] = useState<GetReqParams>({
        pageNo: 1,
        pageSize: 10,
        sort: [{ key: "createdOn", order: "ASC" }],
        filters: [],
    });
    const [isModuleSelected, setIsModuleSelected] = useState(false);
    const [moduleReqParams, setModuleReqParams] = useState<GetReqParams>({
        pageNo: 1,
        pageSize: 10,
        sort: [{ key: "createdOn", order: "ASC" }],
        filters: [],
    });

    // Breadcrumbs
    useBreadcrumb(
        useMemo(
            () => [
                { type: "link", title: "Master", path: UI_ROUTES.MASTER, isActive: false },
                { type: "page", title: "Form", isActive: true },
            ],
            []
        )
    );

    const [getModule, { data: moduleData, error: moduleError, isLoading: moduleLoading }] = useGetModuleMutation();
    const [postModule, { isLoading: moduleAddLoading }] = usePostModuleMutation();
    const {
        data: formData,
        isLoading: formLoading,
        error: formError,
    } = useGetFormsQuery(formReqParams);

    const columns = [
        {
            accessorKey: "displayName",
            header: t("master.form.list.tableHeader.formName"),
        },
        {
            accessorKey: "formDescription",
            header: t("master.form.list.tableHeader.formDesc"),
            maxSize: 500,
            size: 400,
        },
        {
            accessorKey: "isPublished",
            header: t("master.form.list.tableHeader.status"),
            cell: ({ getValue }: any) => (
                <Badge
                    className={`text-xs text-white ${getValue() ? "bg-green-300 hover:bg-green-100 text-green-800" : "bg-red-300 hover:bg-red-200 text-red-800"}`}
                >
                    {getValue() ? "Published" : "Unpublished"}
                </Badge>
            ),
        },
        {
            accessorKey: "action",
            header: t("master.form.list.tableHeader.action"),
            cell: ({ row }: any) => (
                <Button
                    variant="default"
                    className="text-white text-[10px] h-[32px] px-4"
                    onClick={() => handleView(row.original.formName)}
                >
                    <Eye className="w-4 h-4" />
                    View
                </Button>
            ),
        },
    ];

    const handleAddModule = async (moduleData: { moduleName: string; moduleDescription?: string }) => {
        try {
            await postModule(moduleData).unwrap();
            toast({ title: "Module Added Successfully", variant: "success" });
            await getModule(moduleReqParams);
        } catch (err) {
            toast({
                title: "Error Adding Module",
                description: "Failed to add module. Please try again.",
                variant: "destructive",
                action: (
                    <ToastAction altText="Retry" onClick={() => handleAddModule(moduleData)}>
                        Retry
                    </ToastAction>
                ),
            });
        }
    };

    const handleModuleClick = useCallback((moduleName: string) => {
        setSelectedModule(moduleName);
        setFormReqParams({
            pageNo: 1,
            pageSize: 10,
            sort: [{ key: "createdOn", order: "ASC" }],
            filters: [],
        })
        handleAddFormFilter("moduleName", "EQUAL", "STRING", moduleName);
    }, []);

    const handleAddFormFilter = (key: string, operator: "LIKE" | "EQUAL", fieldType: "STRING" | "BOOLEAN", value: string | boolean) => {
        setFormReqParams((prev) => {
            const filters = prev.filters.filter((f) => f.key !== key);
            return { ...prev, filters: [...filters, { key, operator, field_type: fieldType, value }] };
        });
    };

    const handleSearch = (query: string) => {
        handleAddFormFilter("default_search_criteria", "LIKE", "STRING", query);
    };

    const handleStatusChange = (status: StatusValue) => {
        if (status === "all") {
            setFormReqParams((prev) => ({
                ...prev,
                filters: prev.filters.filter((filter) => filter.key !== "isPublished"),
            }));
        } else {
            handleAddFormFilter("isPublished", "EQUAL", "BOOLEAN", status === "published");
        }
    };

    const handleView = (formName: string) => {
        navigate(UI_ROUTES.MASTER_FORM_PREVIEW, { state: { formName, selectedModule } });
    };

    const handleCreate = () => {
        navigate(UI_ROUTES.MASTER_FORM_CREATE, { state: { selectedModule } });
    };

    useEffect(() => {
        (async () => {
            try {
                await getModule(moduleReqParams);
            } catch (err) {
                toast({
                    title: "Error Fetching Modules",
                    description: "Failed to load modules. Please refresh the page.",
                    variant: "destructive",
                    action: (
                        <ToastAction altText="Retry" onClick={() => getModule(moduleReqParams)}>
                            Retry
                        </ToastAction>
                    ),
                });
            }
        })();
    }, [getModule, moduleReqParams, toast]);

    const handleModuleSearch = (searchVal: string) => {
        setModuleSearchVal(searchVal)
        const key = "moduleName";
        const operator = "LIKE";
        const fieldType = "STRING";

        setModuleReqParams((prev) => {
            // Remove the `moduleName` key filter if the value is empty
            const filters = prev.filters.filter((f) => f.key !== key);

            if (searchVal.trim() === "") {
                // If the search value is empty, return the updated filters without adding a new one
                return {
                    ...prev,
                    filters,
                };
            }

            // Otherwise, add the new filter
            const newFilter: Filter = {
                key,
                operator,
                field_type: fieldType,
                value: searchVal,
            };

            return {
                ...prev,
                filters: [...filters, newFilter],
            };
        });
    };
    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 768px)' });

    const handleBackToModuleList = () => {
        setIsModuleSelected(false);
        setSelectedModule(null);
    };
    return (
        // <div className="h-auto">
        //     <ResizablePanelGroup
        //         direction="horizontal"
        //         className="max-w-full rounded-lg border flex h-full"
        //     >
        //         <ResizablePanel
        //             defaultSize={20}
        //             className="h-full min-h-full overflow-auto"
        //         >
        //             {moduleLoading ? (
        //                 <Spinner />
        //             ) : moduleError ? (
        //                 <ErrorAlert message="Failed to load modules" />
        //             ) : moduleData ? (
        //                 <ModuleList
        //                     data={moduleData.data}
        //                     handleModuleSelect={handleModuleClick}
        //                     showForm={false}
        //                     onAddModule={handleAddModule}
        //                     initialActiveModule={selectedModule}
        //                     onPageChange={(curPage: number) => { setModuleReqParams(prev => ({ ...prev, pageNo: curPage })) }}
        //                     currentPage={moduleReqParams.pageNo}
        //                     totalRecords={moduleData.totalRecords}
        //                     itemsPerPage={moduleReqParams.pageSize}
        //                     onSearch={handleModuleSearch}
        //                     initialSearchVal={moduleSearchVal}
        //                 />
        //             ) : (
        //                 <div>No modules available.</div>
        //             )}
        //         </ResizablePanel>
        //         <ResizableHandle withHandle />
        //         <ResizablePanel
        //             defaultSize={80}
        //             className="h-full min-h-full overflow-auto bg-background"
        //         >
        //             {!selectedModule ? (
        //                 <ModuleSelectionPlaceholder />
        //             ) : (
        //                 <div className="p-4 space-y-1 bg-card h-full">
        //                     <Text className="text-lg font-bold">{selectedModule}</Text>
        //                     <div className="flex items-center space-x-4">
        //                         <SearchInput onSearch={handleSearch} className="flex-1" />
        //                         <StatusFilterDropdown onFilterChange={handleStatusChange} />
        //                         <Button
        //                             variant="default"
        //                             className="rounded text-white"
        //                             onClick={handleCreate}
        //                             disabled={moduleAddLoading}
        //                         >
        //                             <Plus size={18} strokeWidth={3} />
        //                             {t("master.form.list.createBtn")}
        //                         </Button>
        //                     </div>

        //                     <div className="pt-1 h-[calc(100%-100px)]">
        //                         {formError && <ErrorAlert message="Failed to load form data" />}
        //                         {formLoading ? (
        //                             <Spinner />
        //                         ) : formData?.data?.length ? (
        //                             <AdvancedTable<MasterColumns>
        //                                 columns={columns}
        //                                 data={formData.data}
        //                                 totalCount={formData.totalRecords}
        //                                 requestParams={formReqParams}
        //                                 onRequestParamsChange={setFormReqParams}
        //                             />
        //                         ) : (
        //                             <Alert>
        //                                 <AlertTriangle className="h-4 w-4" />
        //                                 <AlertTitle>No Data</AlertTitle>
        //                                 <AlertDescription>No forms found for the selected module.</AlertDescription>
        //                             </Alert>
        //                         )}
        //                     </div>
        //                 </div>
        //             )}
        //         </ResizablePanel>
        //     </ResizablePanelGroup>
        // </div>
        <div className="h-auto">
            <ResizablePanelGroup
                direction="horizontal"
                className="max-w-full rounded-lg border flex h-full"
            >
                {!isMobileOrTablet && (
                    <ResizablePanel
                        defaultSize={20}
                        className="h-full min-h-full overflow-auto"
                    >
                        {moduleLoading ? (
                            <Spinner />
                        ) : moduleError ? (
                            <ErrorAlert message="Failed to load modules" />
                        ) : moduleData ? (
                            <ModuleList
                                data={moduleData.data}
                                handleModuleSelect={(moduleName: string) => {
                                    handleModuleClick(moduleName);
                                    setIsModuleSelected(true);
                                }}
                                showForm={false}
                                onAddModule={handleAddModule}
                                initialActiveModule={selectedModule || ''}
                                onPageChange={(curPage: number) => {
                                    setModuleReqParams((prev) => ({ ...prev, pageNo: curPage }));
                                }}
                                currentPage={moduleReqParams.pageNo}
                                totalRecords={moduleData.totalRecords}
                                itemsPerPage={moduleReqParams.pageSize}
                                onSearch={handleModuleSearch}
                                initialSearchVal={moduleSearchVal}
                            />
                        ) : (
                            <div>No modules available.</div>
                        )}
                    </ResizablePanel>
                )}

                {/* Resizable Handle between Panels */}
                {!isMobileOrTablet && <ResizableHandle withHandle />}

                {/* Right Panel: Module Details or Table */}
                <ResizablePanel
                    defaultSize={isMobileOrTablet ? 100 : 80} // Full screen on mobile/tablet
                    className="h-full min-h-full overflow-auto bg-background"
                >
                    {/* Back Button on Mobile/Tablets */}
                    {isMobileOrTablet && isModuleSelected && (
                        <Button
                            onClick={handleBackToModuleList}
                            className="p-2 rounded m-1"
                            variant="ghost"
                        >
                            <ArrowLeft />
                        </Button>
                    )}

                    {isMobileOrTablet ? (
                        !isModuleSelected ? (
                            <ModuleList
                                data={moduleData?.data || []}
                                handleModuleSelect={(moduleName: string) => {
                                    handleModuleClick(moduleName);
                                    setIsModuleSelected(true);
                                }}
                                showForm={false}
                                onAddModule={handleAddModule}
                                initialActiveModule={selectedModule || ''}
                                onPageChange={(curPage: number) => {
                                    setModuleReqParams((prev) => ({ ...prev, pageNo: curPage }));
                                }}
                                currentPage={moduleReqParams.pageNo}
                                totalRecords={moduleData?.totalRecords || 0}
                                itemsPerPage={moduleReqParams.pageSize}
                                onSearch={handleModuleSearch}
                                initialSearchVal={moduleSearchVal}
                            />
                        ) : (
                            <div className="p-4 space-y-1 bg-card h-full">
                                <Text className="text-lg font-bold">{selectedModule}</Text>
                                <div className="flex items-center space-x-4">
                                    <SearchInput onSearch={handleSearch} className="flex-1" />
                                    <StatusFilterDropdown onFilterChange={handleStatusChange} />
                                    <Button
                                        variant="default"
                                        className="rounded text-white"
                                        onClick={handleCreate}
                                        disabled={moduleAddLoading}
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                        {!isMobileOrTablet && t("master.form.list.createBtn")}
                                    </Button>
                                </div>

                                <div className="pt-1 h-[calc(100%-100px)]">
                                    {formError && <ErrorAlert message="Failed to load form data" />}
                                    {formLoading ? (
                                        <Spinner />
                                    ) : formData?.data?.length ? (
                                        <AdvancedTable<MasterColumns>
                                            columns={columns}
                                            data={formData.data}
                                            totalCount={formData.totalRecords}
                                            requestParams={formReqParams}
                                            onRequestParamsChange={setFormReqParams}
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
                        )
                    ) : !selectedModule ? (
                        // Show ModuleSelectionPlaceholder on larger screens when no module is selected
                        <ModuleSelectionPlaceholder />
                    ) : (
                        <div className="p-4 space-y-1 bg-card h-full">
                            <Text className="text-lg font-bold">{selectedModule}</Text>
                            <div className="flex items-center space-x-4">
                                <SearchInput onSearch={handleSearch} className="flex-1" />
                                <StatusFilterDropdown onFilterChange={handleStatusChange} />
                                <Button
                                    variant="default"
                                    className="rounded text-white"
                                    onClick={handleCreate}
                                    disabled={moduleAddLoading}
                                >
                                    <Plus size={18} strokeWidth={3} />
                                    {t("master.form.list.createBtn")}
                                </Button>
                            </div>

                            <div className="pt-1 h-[calc(100%-100px)]">
                                {formError && <ErrorAlert message="Failed to load form data" />}
                                {formLoading ? (
                                    <Spinner />
                                ) : formData?.data?.length ? (
                                    <AdvancedTable<MasterColumns>
                                        columns={columns}
                                        data={formData.data}
                                        totalCount={formData.totalRecords}
                                        requestParams={formReqParams}
                                        onRequestParamsChange={setFormReqParams}
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
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default Master;

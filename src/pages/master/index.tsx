import useBreadcrumb from "@/hooks/useBreadCrumb";
import { BreadcrumbItemType } from "@/types/data";
import { useMemo, useState, useEffect, useCallback } from "react";
import ModuleList from "./components/ModuleList";
import { Outlet, useNavigate } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useGetModuleMutation } from "@/store/services/master/module";
import { UI_ROUTES } from "@/constants/routes";

type Props = {};

const Master = (props: Props) => {
    const [getModule, { data, error, isLoading }] = useGetModuleMutation();
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState([
        { key: 'createdOn', order: 'ASC' }
    ]);
    const [filters, setFilters] = useState([]);
    const [selectedModule, setSelectedModule] = useState<string>('');
    const navigate = useNavigate();

    const updatedRoutes: BreadcrumbItemType[] = useMemo(() => [
        { type: 'link', title: 'Master', path: UI_ROUTES.MASTER, isActive: false },
        { type: 'page', title: 'Form', isActive: true },
    ], []);

    useBreadcrumb(updatedRoutes);

    const handleModuleClick = useCallback((moduleName: string) => {
        setSelectedModule(moduleName);
        navigate(`/master/form/${moduleName}`);
    }, [navigate]);

    const fetchModules = useCallback(async () => {
        try {
            await getModule({ pageNo, pageSize, sort, filters });
        } catch (err) {
            console.error('Failed to fetch modules', err);
        }
    }, [getModule, pageNo, pageSize, sort, filters]);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <ResizablePanelGroup
                direction="horizontal"
                className="max-w-full rounded-lg border md:min-w-[450px]"
            >
                <ResizablePanel defaultSize={20}>
                    {data ? (
                        <ModuleList data={data.data} handleModuleSelect={handleModuleClick} showForm={false} />
                    ) : (
                        <div>No modules available.</div>
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={80} className="h-full">
                    <Outlet context={{ selectedModule }} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default Master;

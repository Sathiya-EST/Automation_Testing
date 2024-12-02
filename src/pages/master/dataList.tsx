import React, { useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { BreadcrumbItemType } from '@/types/data';
import ModuleList from './components/ModuleList';

// Type definitions for better type safety
interface Module {
  moduleIdPk: string;
  moduleName: string;
  moduleDescription: string;
  formList: {
    formId: string;
    formName: string;
  }[];
}

const DataList: React.FC = () => {
  // Extract sample data to a separate constant or fetch from an API
  const sampleModuleData: Module[] = [
    {
      moduleIdPk: "module123",
      moduleName: "Employee Management",
      moduleDescription: "Handles employee data, records, and processes.",
      formList: [
        { formId: "form001", formName: "Employee Registration" },
        { formId: "form002", formName: "Leave Application" },
        { formId: "form003", formName: "Performance Review" },
      ],
    },
  ];

  // State management with explicit typing
  const [selectedModule, setSelectedModule] = useState<string>('');
  const navigate = useNavigate();

  // Memoized breadcrumb routes
  const updatedRoutes: BreadcrumbItemType[] = useMemo(() => [
    { type: 'link', title: 'Master', path: UI_ROUTES.MASTER, isActive: false },
    { type: 'page', title: 'Form', isActive: true },
], []);

  // Apply breadcrumb
  useBreadcrumb(updatedRoutes);

  // Memoized module selection handler
  const handleModuleClick = useCallback((moduleName: string) => {
    setSelectedModule(moduleName);
    navigate(`/master/data/${moduleName}`);
  }, [navigate]);

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full rounded-lg border md:min-w-[450px] h-[calc(100vh-100px)]" // Adjust height as needed
      >
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          className="overflow-auto"
        >
          {sampleModuleData?.length ? (
            <ModuleList
              data={sampleModuleData}
              handleModuleSelect={handleModuleClick}
              showForm={true}
            />
          ) : (
            <div className="p-4 text-muted-foreground">
              No modules available.
            </div>
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={80}
          minSize={50}
          className="h-full overflow-auto"
        >
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DataList;
import React, { useState, useCallback, memo } from "react";
import { ChevronDown, ChevronUp, Database } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import ModuleIcon from "@/assets/module_icon";
import { Button } from "@/components/ui/button";

interface FormItem {
  formId: string;
  formName: string;
}

interface ModuleData {
  moduleIdPk: string;
  moduleName: string;
  moduleDescription: string;
  formList?: FormItem[];
}

interface ModuleListProps {
  data: ModuleData[];
  handleModuleSelect: (moduleId: string) => void;
  handleFormSelect?: (formId: string) => void;
  showForm?: boolean;
}

const ModuleList: React.FC<ModuleListProps> = memo(({
  data,
  handleModuleSelect,
  handleFormSelect,
  showForm = true
}) => {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  const toggleModule = useCallback((moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  }, []);

  const handleModuleClick = useCallback((moduleIdPk: string, moduleName: string) => {
    toggleModule(moduleIdPk);
    handleModuleSelect(moduleName);
  }, [handleModuleSelect, toggleModule]);

  return (
    <div className="h-auto overflow-y-auto">
      <SidebarProvider className="bg-white dark:bg-gray-950">
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarMenu>
            {data.map((module) => (
              <Collapsible
                key={module.moduleIdPk}
                open={!!openModules[module.moduleIdPk]}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    onClick={() => handleModuleClick(module.moduleIdPk, module.moduleName)}
                    tooltip={module.moduleName}
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center justify-between w-full rounded-full"
                    >
                      <div className="flex items-center gap-2">
                        <ModuleIcon className="text-gray-500 flex-shrink-0" size={18} />
                        <span className="align-middle">{module.moduleName}</span>
                      </div>
                      {showForm && (openModules[module.moduleIdPk] ? <ChevronUp /> : <ChevronDown />)}
                    </Button>
                  </SidebarMenuButton>

                  <CollapsibleContent className="ml-4">

                    {showForm && module.formList && module.formList.length > 0 && (
                      <SidebarMenuSub>
                        {module.formList.map((form) => (
                          <SidebarMenuSubItem key={form.formId}>
                            <div className="flex items-center w-full">
                              <Database className="w-4 h-4 flex-shrink-0 text-gray-500" />
                              <SidebarMenuSubButton asChild>
                                <Button
                                  variant="ghost"
                                  className="flex items-end justify-between w-full rounded"
                                  onClick={() => handleFormSelect && handleFormSelect(form.formId)}
                                >
                                  <span className="ml-2">{form.formName}</span>
                                </Button>
                              </SidebarMenuSubButton>
                            </div>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarProvider>
    </div>
  );
});

ModuleList.displayName = 'ModuleList';

export default ModuleList;
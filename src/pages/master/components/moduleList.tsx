import React, { useState } from "react";
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

type FormItem = {
  formId: string;
  formName: string;
};

type ModuleData = {
  moduleIdPk: string;
  moduleName: string;
  moduleDescription: string;
  formList?: FormItem[];
};

interface ModuleListProps {
  data: ModuleData[];
}

const ModuleList: React.FC<ModuleListProps> = ({ data }) => {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <SidebarProvider>
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
                  onClick={() => toggleModule(module.moduleIdPk)}
                  tooltip={module.moduleName}
                >
                  <div className="flex items-center justify-between w-full">
                    <ModuleIcon />
                    <span>{module.moduleName}</span>
                    {openModules[module.moduleIdPk] ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </SidebarMenuButton>

                <CollapsibleContent>
                  {module.formList && module.formList.length > 0 ? (
                    <SidebarMenuSub>
                      {module.formList.map((form) => (
                        <SidebarMenuSubItem key={form.formId}>
                          <div className="flex items-center w-full">
                            {/* <Database className="w-4 h-4 flex-shrink-0" /> */}
                            <SidebarMenuSubButton asChild>
                              <a href={`#${form.formId}`}>
                                <span className="ml-2">{form.formName}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </div>

                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </CollapsibleContent>

              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarProvider>
  );
};

export default ModuleList;

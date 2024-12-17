import React, { useState, useCallback, memo } from "react";
import { ChevronDown, ChevronUp, Database, Plus } from "lucide-react";
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
import Text from "@/components/shared/Text";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

interface AddModuleDialogProps {
  onAddModule: (moduleData: Omit<ModuleData, 'moduleIdPk'>) => void;
}

const AddModuleDialog: React.FC<AddModuleDialogProps> = ({ onAddModule }) => {
  const [moduleName, setModuleName] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  const handleSubmit = () => {
    if (moduleName.trim()) {
      onAddModule({
        moduleName: moduleName.trim(),
        moduleDescription: moduleDescription.trim(),
        formList: []
      });
      setModuleName('');
      setModuleDescription('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Plus size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
          <DialogDescription>
            Create a new module by providing its name and description.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label htmlFor="moduleName" className="text-left">
            Name
          </Label>
          <Input
            id="moduleName"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            placeholder="Enter Module name"
            className="col-span-3"
          />
          <Label htmlFor="moduleDescription" className="text-left">
            Description
          </Label>
          <Textarea
            id="moduleDescription"
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
            placeholder="Enter Module description"
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!moduleName.trim()}
            className="w-full"
          >
            Add Module
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ModuleListProps {
  data: ModuleData[];
  handleModuleSelect?: (moduleId: string) => void;
  handleFormSelect?: (formId: string, moduleId: string) => void;
  onAddModule?: (moduleData: Omit<ModuleData, 'moduleIdPk'>) => void;
  showForm?: boolean;
}

const ModuleList: React.FC<ModuleListProps> = memo(({
  data,
  handleModuleSelect,
  handleFormSelect,
  onAddModule,
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
    handleModuleSelect && handleModuleSelect(moduleName);
  }, [handleModuleSelect, toggleModule]);

  return (
    <div className="h-auto overflow-y-auto">
      <SidebarProvider className="bg-white dark:bg-gray-950">
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            <Text className="font-semibold">Modules</Text>
            {onAddModule && (
              <AddModuleDialog onAddModule={onAddModule} />
            )}
          </SidebarGroupLabel>
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
                      className="flex items-center justify-between w-full rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <ModuleIcon className="text-gray-500 flex-shrink-0" size={18} />
                        <span className="align-middle truncate max-w-[200px]">
                          {module.moduleName}
                        </span>
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
                                  className="flex items-center justify-between w-full rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                  onClick={() => handleFormSelect && handleFormSelect(form.formId, module.moduleName)}
                                >
                                  <span className="ml-2 truncate max-w-[180px]">
                                    {form.formName}
                                  </span>
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Eye, EyeOff, GripHorizontal } from "lucide-react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Column } from "@tanstack/react-table";

// Enhanced type definitions
export interface TableSettings {
    pageSize: number;
    totalPages: number;
    width: string;
    maxWidth: string;
    height: string;
    maxHeight: string;
}

export interface TableSettingPopoverProps {
    settings: TableSettings;
    updateSettings: (updatedSettings: Partial<TableSettings>) => void;
    columnHeaders: Column<any, unknown>[];
}

const TableSettingPopover: React.FC<TableSettingPopoverProps> = ({
    settings,
    updateSettings,
    columnHeaders
}) => {
    // Memoized initial column visibility state
    const initialColumnVisibility = useMemo(() =>
        columnHeaders.reduce((acc, column) => {
            acc[column.id] = column.getIsVisible();
            return acc;
        }, {} as Record<string, boolean>),
        [columnHeaders]
    );

    // State for selected column visibility
    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(initialColumnVisibility);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleItem = useCallback((columnId: string) => {
        setSelectedItems(prevState => {
            const newVisibility = !prevState[columnId];
            const column = columnHeaders.find(col => col.id === columnId);

            column?.toggleVisibility(newVisibility);

            return {
                ...prevState,
                [columnId]: newVisibility
            };
        });
    }, [columnHeaders]);

    // Click outside handler with useCallback
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Optimized change handler for settings
    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement>,
        key: keyof TableSettings
    ) => {
        const value = key === 'pageSize' || key === 'height'
            ? Number(e.target.value)
            : e.target.value;

        updateSettings({ [key]: value });
    }, [updateSettings]);

    // Render column visibility dropdown items
    const renderColumnItems = useMemo(() =>
        columnHeaders.map((column) => {
            if (column.id === "action") return null;
            const isVisible = selectedItems[column.id];
            const header = column.columnDef.header as string;

            return (
                <div
                    key={column.id}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                        toggleItem(column.id);
                        setIsDropdownOpen(false);
                    }}
                >
                    <div className="flex items-center justify-between w-full">
                        <GripHorizontal className="mr-2" />
                        <div className="flex-1">{header}</div>
                        <div>
                            {isVisible ? (
                                <Eye className="w-4 h-4 text-gray-500" />
                            ) : (
                                <EyeOff className="w-4 h-4 text-gray-500" />
                            )}
                        </div>
                    </div>


                </div>
            );
        }),
        [columnHeaders, selectedItems, toggleItem]
    );

    return (
        <div className="grid gap-4 overflow-y-auto p-2 min-w-[250px]">
            {/* Columns Section */}
            <div>
                <Label htmlFor="columns" className="mb-2 block">Columns</Label>
                <div className="relative rounded-md w-full" ref={dropdownRef}>
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span>Hide Columns</span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                        />
                    </Button>

                    {isDropdownOpen && (
                        <div className="absolute z-50 bg-white border rounded-md shadow-lg w-full mt-2">
                            {renderColumnItems}
                        </div>
                    )}
                </div>
            </div>

            {/* Page Settings */}
            <div className="space-y-2">
                <h4 className="font-medium">Page Settings</h4>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="pageSize">Page Size</Label>
                    <Input
                        id="pageSize"
                        type="number"
                        min={1}
                        max={100}
                        value={settings.pageSize}
                        onChange={(e) => handleChange(e, "pageSize")}
                        className="col-span-2 h-8"
                    />
                </div>
            </div>

            {/* Dimensions Section */}
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium">Dimensions</h4>
                    <p className="text-sm text-muted-foreground">Set the table display dimensions</p>
                </div>
                <div className="grid gap-2">
                    {/* Width Settings */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Width</Label>
                        <div className="col-span-2 flex items-center">
                            <Input
                                id="width"
                                type="text"
                                value={settings.width}
                                onChange={(e) => handleChange(e, "width")}
                                className="col-span-2 h-8"
                            />
                            <span className="ml-2 text-gray-500">%</span>
                        </div>
                    </div>

                    {/* Max Width Settings */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxWidth">Max Width</Label>
                        <div className="col-span-2 flex items-center">
                            <Input
                                id="maxWidth"
                                type="text"
                                value={settings.maxWidth}
                                onChange={(e) => handleChange(e, "maxWidth")}
                                className="col-span-2 h-8"
                            />
                            <span className="ml-2 text-gray-500">px</span>
                        </div>
                    </div>

                    {/* Height Settings */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="height">Height</Label>
                        <div className="col-span-2 flex items-center">
                            <Input
                                id="height"
                                type="number"
                                value={settings.height}
                                onChange={(e) => handleChange(e, "height")}
                                className="col-span-2 h-8"
                            />
                            <span className="ml-2 text-gray-500">px</span>
                        </div>
                    </div>

                    {/* Max Height Settings */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxHeight">Max Height</Label>
                        <div className="col-span-2 flex items-center">
                            <Input
                                id="maxHeight"
                                type="text"
                                value={settings.maxHeight}
                                onChange={(e) => handleChange(e, "maxHeight")}
                                className="col-span-2 h-8"
                            />
                            <span className="ml-2 text-gray-500">px</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableSettingPopover;



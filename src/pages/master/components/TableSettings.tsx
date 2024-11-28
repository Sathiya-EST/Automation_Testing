import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TableSettings {
    pageSize: number;
    totalPages: number;
    width: string;
    maxWidth: string;
    height: string;
    maxHeight: string;
}


interface TableSettingPopoverProps {
    settings: TableSettings;
    updateSettings: (updatedSettings: TableSettings) => void;
    columnHeaders: Array<any>;
}

const TableSettingPopover = ({ settings, updateSettings, columnHeaders }: TableSettingPopoverProps) => {
    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
        columnHeaders.reduce((acc, option) => ({ ...acc, [option.columnId]: option.isVisible }), {}));

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleItem = (value: string) => {
        setSelectedItems((prevState) => ({
            ...prevState,
            [value]: !prevState[value],
        }));
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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

    const handleItemClick = (value: string) => {
        toggleItem(value);
        setIsDropdownOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof TableSettings) => {
        const value = e.target.value;
        updateSettings({
            ...settings,
            [key]: value,
        });
    };

    return (
        <div className="grid gap-4 overflow-y-auto p-2">
            {/* Columns Section */}
            <Label htmlFor="columns">Columns</Label>
            <div className="relative rounded-md w-full" ref={dropdownRef}>
                <Button
                    className="w-full max-w-xs cursor-pointer truncate flex items-center justify-between p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                    tabIndex={0}
                    onClick={handleDropdownToggle}
                >
                    <span className="text-sm text-gray-700">Columns</span>
                    <div className="flex items-center">
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                        />
                    </div>
                </Button>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute bg-white border rounded-md shadow-lg w-full mt-2">
                        {columnHeaders.map((column) => (
                            <div
                                key={column.value}
                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleItemClick(column.id)}
                            >
                                <div onClick={() => column.toggleVisibility(!!column.id)}>
                                    {selectedItems[column.id] ? (
                                        <EyeOff className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-gray-500" />
                                    )}
                                </div>
                                <span>{column?.columnDef?.header as string}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Page Settings */}
            <div className="space-y-2">
                <h4 className="font-medium">Page Settings</h4>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="pageSize">Page Size</Label>
                    <Input
                        id="pageSize"
                        type="number"
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
                    <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                </div>
                <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Width</Label>
                        <div className="col-span-2 flex items-center">
                            <Input
                                id="width"
                                value={settings.width}
                                onChange={(e) => handleChange(e, "width")}
                                className="col-span-2 h-8"
                            />
                            <span className="ml-2 text-gray-500">%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxWidth">Max. Width</Label>
                        <div className="col-span-2 flex items-center">
                            <Input
                                id="maxWidth"
                                value={settings.maxWidth}
                                onChange={(e) => handleChange(e, "maxWidth")}
                                className="col-span-2 h-8"
                            />
                            <span className="ml-2 text-gray-500">px</span>
                        </div>
                    </div>

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

                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxHeight">Max. Height</Label>
                        <div className="col-span-2 flex items-center">
                            <Input
                                id="maxHeight"
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

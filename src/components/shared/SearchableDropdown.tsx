"use client";
import * as React from "react";
import {  ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "../ui/checkbox";

// Define the type for dropdown items
interface DropdownItem {
    value: string;
    label: string;
}

interface SearchableDropdownProps {
    options: DropdownItem[];
    placeholder?: string;
    emptyStateText?: string;
    selectedValues: string[];
    onValueChange: (value: string[]) => void;
    className?: string;
    width?: string;
    multiselect?: boolean;
    disabled?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    placeholder = "Select an option...",
    emptyStateText = "No options found.",
    selectedValues,
    onValueChange,
    className,
    width = "w-[200px]",
    multiselect = false,
    disabled = false,
}) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (selectedValue: string) => {
        if (multiselect) {
            const updatedValues = selectedValues.includes(selectedValue)
                ? selectedValues.filter((value) => value !== selectedValue)
                : [...selectedValues, selectedValue];

            onValueChange(updatedValues);
        } else {
            onValueChange([selectedValue]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("justify-between", width, className, {
                        "text-muted-foreground": selectedValues.length === 0,
                    })}
                    disabled={disabled} 
                >
                    <div
                        className="truncate max-w-[150px]"
                        title={selectedValues.join(", ")}
                    >
                        {selectedValues.length > 0 ? (
                            selectedValues.join(", ")
                        ) : (
                            <span className="text-slate-400 font-normal">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("p-0", width)}>
                <Command>
                    <CommandInput placeholder={`Search options...`} />
                    <CommandList>
                        <CommandEmpty>{emptyStateText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => handleSelect(item.value)}
                                    className="flex items-center space-x-2 py-2 px-3 hover:bg-muted hover:rounded-md"
                                >
                                    <Checkbox
                                        checked={selectedValues.includes(item.value)}
                                        onChange={() => handleSelect(item.value)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm text-foreground">{item.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

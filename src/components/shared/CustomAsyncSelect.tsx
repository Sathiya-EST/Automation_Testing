import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useLazyGetFormAsyncDataQuery } from "@/store/services/master/form";

interface AsyncSelectDropdownProps {
    formName: string;
    fieldName: string;
    onChange: (value: string[] | string) => void;
    value: string[] | string;
    placeholder: string;
    readOnly?: boolean;
    multiple?: boolean;
}

const CustomAsyncSelect = ({
    formName,
    fieldName,
    onChange,
    value,
    placeholder,
    readOnly,
    multiple = false,
}: AsyncSelectDropdownProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [asyncOptions, setAsyncOptions] = useState<{ label: string; value: string }[]>([]);

    const [triggerGetFormAsyncData, { isLoading }] = useLazyGetFormAsyncDataQuery();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const result = await triggerGetFormAsyncData({
                    pageNo: 1,
                    pageSize: 1000,
                    formName,
                    fieldName,
                    searchQuery,
                }).unwrap();

                if (result && result.transformedData) {
                    const options = result.transformedData.map((item: any) => ({
                        label: item.label,
                        value: item.value,
                    }));
                    setAsyncOptions(options);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchOptions();
    }, [searchQuery, formName, fieldName, triggerGetFormAsyncData]);

    // Handle the selected value(s) (supports both single and multiple selections)
    const selectedValues = Array.isArray(value) ? value : [value];

    // Find the records for selected values
    const selectedRecords = multiple
        ? asyncOptions.filter((record) => selectedValues.includes(record.value))
        : asyncOptions.filter((record) => record.value === selectedValues[0]);

    const handleSelection = (selectedValue: string) => {
        if (multiple) {
            const newSelectedValues = selectedValues.includes(selectedValue)
                ? selectedValues.filter((val) => val !== selectedValue)
                : [...selectedValues, selectedValue];
            onChange(newSelectedValues);
        } else {
            onChange([selectedValue]);
        }
    };

    return (
        <div>
            <FormItem>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded="false"
                                aria-controls="async-select-dropdown"
                                className={cn("w-full justify-between", !selectedRecords.length && "text-muted-foreground")}
                                disabled={readOnly}
                            >
                                {multiple ? (
                                    <p className="font-normal">
                                        {selectedRecords.length > 0
                                            ? selectedRecords.map((record) => record.label).join(", ")
                                            : placeholder}
                                    </p>
                                ) : selectedRecords.length > 0 ? (
                                    <p className="font-normal">{selectedRecords[0].label}</p>
                                ) : (
                                    <p className="text-slate-400 font-normal">{placeholder}</p>
                                )}

                                {isLoading ? (
                                    <Loader2 className="ml-2 animate-spin text-primary" />
                                ) : (
                                    <ChevronsUpDown className="opacity-50" />
                                )}
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    {!readOnly && (
                        <PopoverContent id="async-select-dropdown" className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Search records..."
                                    className="h-9"
                                    value={searchQuery}
                                    onValueChange={(newValue) => setSearchQuery(newValue)}
                                    autoFocus
                                    aria-label="Search for options"
                                />
                                <CommandList>
                                    {isLoading ? (
                                        <div className="flex justify-center items-center p-4">
                                            <Loader2 className="animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <>
                                            <CommandEmpty>No records found.</CommandEmpty>
                                            <CommandGroup>
                                                {asyncOptions.map((option) => (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.value || ""}
                                                        onSelect={() => handleSelection(option.value || "")}
                                                        className={cn(
                                                            "flex items-center justify-between",
                                                            selectedValues.includes(option.value) && "bg-muted text-primary" // Highlight selected items
                                                        )}
                                                    >
                                                        <span>{option.label}</span>
                                                        {(multiple
                                                            ? selectedValues.includes(option.value)
                                                            : value === option.value) && (
                                                                <Check className="ml-auto text-primary" />
                                                            )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </>
                                    )}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    )}
                </Popover>
            </FormItem>
        </div>
    );
};

export default CustomAsyncSelect;

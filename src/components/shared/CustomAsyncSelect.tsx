import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface AsyncSelectDropdownProps {
    formName: string;
    fieldName: string;
    onChange: (value: string) => void; // Single string value
    value: string; // Single string value
    placeholder: string;
    options: { label: string; value: string | null }[]; // Options array
    isLoading: boolean;
    totalPages: number;
    fetchOptions: (formName: string, fieldName: string, pageNo: number, pageSize: number, query: string) => void;
    readOnly?: boolean;
}

const CustomAsyncSelect = ({
    formName,
    fieldName,
    onChange,
    value,
    placeholder,
    options,
    isLoading,
    totalPages,
    fetchOptions,
    readOnly,
}: AsyncSelectDropdownProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [pageNo, setPageNo] = useState(1);

    // Filter options to eliminate empty strings and null values
    const filteredOptions = options.filter(
        (option) => option.value && option.value.trim() !== ""
    );

    const selectedRecord = filteredOptions.find((record) => record.value === value);

    useEffect(() => {
        if (fetchOptions) {
            fetchOptions(formName, fieldName, pageNo, 10, searchQuery);
        }
    }, [searchQuery, pageNo]);

    const handleSelection = (selectedValue: string) => {
        onChange(selectedValue);
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
                                className={cn("w-full justify-between", !selectedRecord && "text-muted-foreground")}
                                disabled={readOnly}
                            >
                                {selectedRecord ? (
                                    <p className="font-normal">{selectedRecord.label}</p>
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
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Search records..."
                                    className="h-9"
                                    value={searchQuery}
                                    onValueChange={(newValue) => setSearchQuery(newValue)}
                                    autoFocus
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
                                                {filteredOptions.map((option) => (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.value || ""}
                                                        onSelect={() => handleSelection(option.value || "")}
                                                    >
                                                        {option.label}
                                                        {value === option.value && (
                                                            <Check className="ml-auto opacity-100" />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </>
                                    )}
                                </CommandList>
                            </Command>
                            <div className="flex justify-between p-2 border-t border-gray-200">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPageNo(pageNo - 1)}
                                    disabled={pageNo === 1 || readOnly}
                                >
                                    <ChevronLeft />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPageNo(pageNo + 1)}
                                    disabled={pageNo === totalPages || readOnly}
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        </PopoverContent>
                    )}
                </Popover>
                {/* <FormMessage /> */}
            </FormItem>
        </div>
    );
};

export default CustomAsyncSelect;

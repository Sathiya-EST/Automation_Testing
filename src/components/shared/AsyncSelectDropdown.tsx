import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormLabel, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface AsyncSelectDropdownProps {
    tableName: string;
    onChange: (value: string) => void;
    value: string;
    placeholder: string;
}

const AsyncSelectDropdown = ({ tableName, onChange, value, placeholder }: AsyncSelectDropdownProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const data = {
        records: [
            { label: "Record 1", value: "1" },
            { label: "Record 2", value: "2" },
            { label: "Record 3", value: "3" },
            { label: "Record 4", value: "4" },
            { label: "Record 5", value: "5" },
            { label: "Record 6", value: "6" },
        ],
    };

    const isLoading = false;
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Get the selected record's label
    const selectedRecord = data.records.find((record) => record.value === value);

    const options = data?.records || [];

    const handleSelect = (value: string) => {
        onChange(value);
    };

    return (
        <div className="space-y-6">
            <FormItem className="flex flex-col">
                <FormLabel>Record</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-[200px] justify-between", !value && "text-muted-foreground")}
                            >
                                {/* Display the label of the selected record */}
                                {selectedRecord ?
                                    (<p className="font-normal">{selectedRecord.label}</p>) :
                                    (<p className="text-slate-400 font-normal">{placeholder}</p>)}
                                {isLoading ? (
                                    <Loader2 className="ml-2 animate-spin text-primary " />
                                ) : (
                                    <ChevronsUpDown className="opacity-50" />
                                )}
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput
                                placeholder="Search records..."
                                className="h-9"
                                value={searchQuery}
                                onValueChange={(newValue) => setSearchQuery(newValue)}
                            />
                            <CommandList>
                                <CommandEmpty>No records found.</CommandEmpty>
                                <CommandGroup>
                                    {options
                                        .filter((option) =>
                                            option.label.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onSelect={() => handleSelect(option.value)}
                                            >
                                                {option.label}
                                                {option.value === value && <Check className="ml-auto opacity-100" />}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
        </div>
    );
};

export default AsyncSelectDropdown;

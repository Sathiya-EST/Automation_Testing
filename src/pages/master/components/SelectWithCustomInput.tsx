import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Check, ChevronsUpDown, Plus, X, FileText, Image, Music, Video, Archive, Table } from 'lucide-react';

const predefinedFileTypes = [
    { label: 'Image', value: '.jpg,.png,.svg,.gif,.bmp', icon: Image },
    { label: 'Text', value: '.txt,.pdf,.docx,.csv,.xls', icon: FileText },
    { label: 'Video', value: '.mp4,.avi,.mkv,.webm', icon: Video },
    { label: 'Audio', value: '.mp3,.wav,.ogg', icon: Music },
    { label: 'Archive', value: '.zip,.rar,.tar', icon: Archive },
    { label: 'Spreadsheet', value: '.xlsx,.xls,.csv', icon: Table },
];

interface SelectWithCustomInputProps {
    onChange: (value: string[]) => void;
    value: string[];
    placeholder: string;
}

const SelectWithCustomInput: React.FC<SelectWithCustomInputProps> = ({
    onChange,
    value = [],
    placeholder,
}) => {
    const [customType, setCustomType] = useState('');
    const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);
    const [search, setSearch] = useState('');

    const handleTypeSelect = (typeValue: string) => {
        const updatedValues = value.includes(typeValue)
            ? value.filter((val) => val !== typeValue)
            : [...value, typeValue];
        onChange(updatedValues);
    };

    const handleCustomTypeAdd = () => {
        const trimmedCustomType = customType.trim();
        const formattedCustomType = trimmedCustomType.startsWith('.')
            ? trimmedCustomType
            : `.${trimmedCustomType}`;
        if (!value.includes(formattedCustomType)) {
            const updatedValues = [...value, formattedCustomType];
            onChange(updatedValues);
        }
        setCustomType('');
        setIsCustomInputVisible(false);
    };

    const removeChip = (chipValue: string) => {
        const updatedValues = value.filter((val) => val !== chipValue);
        onChange(updatedValues);
    };

    const filteredPredefinedTypes = predefinedFileTypes.filter(type =>
        type.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-2 w-full">
            <Popover>
                <PopoverTrigger asChild>
                    <div
                        className="w-full border rounded-md p-3 flex items-center justify-between 
                                    cursor-pointer 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
                    >
                        <div className="flex flex-wrap gap-2">
                            {value.length > 0 ? (
                                value.map((chip) => (
                                    <div
                                        key={chip}
                                        className="flex items-center bg-primary/10 text-primary border
                                                    rounded-full py-1 px-3 text-sm 
                                                    transition-all hover:bg-primary/5 
                                                     space-x-1"
                                    >
                                        <span>{chip}</span>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeChip(chip);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-500">{placeholder || 'Select file types'}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </PopoverTrigger>

                <PopoverContent className="w-[350px] max-h-80 overflow-auto p-0 shadow-lg">
                    <Command>
                        <CommandInput
                            placeholder="Search file types..."
                            value={search}
                            onValueChange={setSearch}
                            className="border-b"
                        />
                        <CommandList>
                            {/* Predefined Types */}
                            <CommandGroup heading="Predefined Types">
                                {filteredPredefinedTypes.length > 0 ? (
                                    filteredPredefinedTypes.map((type) => {
                                        const TypeIcon = type.icon;
                                        return (
                                            <CommandItem
                                                key={type.value}
                                                value={type.value}
                                                onSelect={() => handleTypeSelect(type.value)}
                                                className="flex items-center justify-between 
                                                            hover:bg-gray-100 cursor-pointer 
                                                            transition-colors"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <TypeIcon className="h-5 w-5 text-gray-500" />
                                                    <span>{type.label}</span>
                                                </div>
                                                <Check
                                                    className={`h-4 w-4 transition-opacity 
                                                                ${value.includes(type.value)
                                                            ? 'opacity-100 text-green-500'
                                                            : 'opacity-0'}`}
                                                />
                                            </CommandItem>
                                        );
                                    })
                                ) : (
                                    <CommandEmpty>No types found</CommandEmpty>
                                )}
                            </CommandGroup>

                            {/* Custom Type Input */}
                            {isCustomInputVisible ? (
                                <div className="flex p-2 gap-2  border-t">
                                    <input
                                        type="text"
                                        placeholder="e.g. .json"
                                        value={customType}
                                        onChange={(e) => setCustomType(e.target.value)}
                                        className="flex-1 border p-2 rounded focus:outline-none ring-primary focus:ring-2 "
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handleCustomTypeAdd}
                                        disabled={!customType.trim()}
                                        className="bg-primary hover:bg-primary/80"
                                    >
                                        Add
                                    </Button>
                                </div>
                            ) : (
                                <CommandItem
                                    onSelect={() => setIsCustomInputVisible(true)}
                                    className="hover:bg-gray-100 cursor-pointer"
                                >
                                    <Plus className="mr-2 h-4 w-4 text-blue-500" />
                                    <span className="text-blue-500">Add Custom Type</span>
                                </CommandItem>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SelectWithCustomInput;
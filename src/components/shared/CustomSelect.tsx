// import React from 'react';
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue
// } from "@/components/ui/select";

// interface SelectDropdownProps {
//     label?: string;
//     placeholder?: string;
//     options: string[]; // Accepts an array of strings
//     value?: string[]; // Outputs and accepts values in string array format
//     onChange?: (value: string[]) => void;
//     className?: string;
//     readOnly?: boolean;
// }

// const CustomSelect: React.FC<SelectDropdownProps> = ({
//     label,
//     options,
//     placeholder,
//     value = [], // Default to an empty array
//     onChange,
//     className = '',
//     readOnly = false
// }) => {
//     const handleChange = (selectedValue: string) => {
//         // Ensure the value is always an array
//         const updatedValues = [selectedValue];
//         onChange?.(updatedValues);
//     };

//     // Filter out empty strings or invalid options
//     const filteredOptions = options.filter(option => option.trim() !== '');

//     return (
//         <div className={`grid gap-2 w-full ${className}`}>
//             {label && <label className="font-medium leading-none">{label}</label>}
//             <Select
//                 value={value.length > 0 ? value[0] : undefined} // Select requires a single value
//                 onValueChange={handleChange}
//                 disabled={readOnly}
//             >
//                 <SelectTrigger className="w-full">
//                     <SelectValue
//                         placeholder={placeholder}
//                         className={`${value.length === 0 ? 'text-red-500' : ''}`}
//                     />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectGroup>
//                         {label && <SelectLabel>{label}</SelectLabel>}
//                         {filteredOptions.length > 0 ? (
//                             filteredOptions.map((option) => (
//                                 <SelectItem key={option} value={option}>
//                                     {option}
//                                 </SelectItem>
//                             ))
//                         ) : (
//                             <SelectItem value="">No options available</SelectItem>
//                         )}
//                     </SelectGroup>
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// };

// export default CustomSelect;

import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SelectDropdownProps {
    label?: string;
    placeholder?: string;
    options: string[];
    value?: string[];
    onChange?: (value: string[]) => void;
    className?: string;
    readOnly?: boolean;
    multiple?: boolean;
}

const CustomSelect: React.FC<SelectDropdownProps> = ({
    label,
    options,
    placeholder,
    value = [],
    onChange,
    className = '',
    readOnly = false,
    multiple = false
}) => {
    const handleChange = (selectedValue: string) => {
        if (!multiple) {
            onChange?.([selectedValue]);
            return;
        }

        const updatedValues = value.includes(selectedValue)
            ? value.filter(v => v !== selectedValue)
            : [...value, selectedValue];
        onChange?.(updatedValues);
    };

    const handleRemove = (optionToRemove: string) => {
        const updatedValues = value.filter(v => v !== optionToRemove);
        onChange?.(updatedValues);
    };

    const filteredOptions = options.filter(option => option.trim() !== '');

    const renderTriggerContent = () => {
        if (value.length === 0) {
            return <SelectValue placeholder={placeholder} />;
        }

        if (!multiple) {
            return <SelectValue>{value[0]}</SelectValue>;
        }

        return (
            <div className="flex flex-wrap gap-1">
                {value.map((selectedValue) => (
                    <Badge
                        key={selectedValue}
                        variant="secondary"
                        className="mr-1 mb-1"
                    >
                        {selectedValue}
                        {!readOnly && (
                            <button
                                className="ml-1 hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(selectedValue);
                                }}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </Badge>
                ))}
            </div>
        );
    };

    return (
        <div className={`grid gap-2 w-full ${className}`}>
            {label && <label className="font-medium leading-none">{label}</label>}
            <Select
                value={value[0] || ''}
                onValueChange={handleChange}
                disabled={readOnly}
            >
                <SelectTrigger className="w-full min-h-[2.5rem]">
                    {renderTriggerContent()}
                </SelectTrigger>
                <SelectContent className="w-full max-h-[30rem] overflow-auto">
                    <SelectGroup>
                        {label && <SelectLabel>{label}</SelectLabel>}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <SelectItem
                                    key={option}
                                    value={option}
                                    className={`${value.includes(option) ? 'bg-secondary' : ''}`}
                                >
                                    {option}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="">No options available</SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default CustomSelect;
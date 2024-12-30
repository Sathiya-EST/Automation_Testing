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

interface SelectDropdownProps {
    label?: string;
    placeholder?: string;
    options: string[]; // Accepts an array of strings
    value?: string[]; // Outputs and accepts values in string array format
    onChange?: (value: string[]) => void;
    className?: string;
    readOnly?: boolean;
}

const CustomSelect: React.FC<SelectDropdownProps> = ({
    label,
    options,
    placeholder,
    value = [], // Default to an empty array
    onChange,
    className = '',
    readOnly = false
}) => {
    const handleChange = (selectedValue: string) => {
        // Ensure the value is always an array
        const updatedValues = [selectedValue];
        onChange?.(updatedValues);
    };

    // Filter out empty strings or invalid options
    const filteredOptions = options.filter(option => option.trim() !== '');

    return (
        <div className={`grid gap-2 w-full ${className}`}>
            {label && <label className="font-medium leading-none">{label}</label>}
            <Select
                value={value.length > 0 ? value[0] : undefined} // Select requires a single value
                onValueChange={handleChange}
                disabled={readOnly}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={placeholder}
                        className={`${value.length === 0 ? 'text-red-500' : ''}`}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {label && <SelectLabel>{label}</SelectLabel>}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <SelectItem key={option} value={option}>
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

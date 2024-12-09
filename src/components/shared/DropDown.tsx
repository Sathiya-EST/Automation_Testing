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

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectDropdownProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
    label,
    options,
    placeholder,
    value,
    onChange,
    className = ''
}) => {
    const handleChange = (selectedValue: string) => {
        onChange?.(selectedValue);
    };

    return (
        <div className={`grid gap-2 w-full ${className}`}>
            {label && <label className="font-medium leading-none">{label}</label>}
            <Select value={value} onValueChange={handleChange}>
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={placeholder}
                        className={`${!value ? 'text-red-500' : ''}`}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {label && <SelectLabel>{label}</SelectLabel>}
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectDropdown;
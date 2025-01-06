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

// export interface SelectOption {
//     value: string;
//     label: string;
// }

// interface SelectDropdownProps {
//     label?: string;
//     placeholder?: string;
//     options: SelectOption[];
//     value?: string;
//     onChange?: (value: string) => void;
//     className?: string;
//     readOnly?: boolean;
// }

// const SelectDropdown: React.FC<SelectDropdownProps> = ({
//     label,
//     options,
//     placeholder,
//     value,
//     onChange,
//     className = '',
//     readOnly = false
// }) => {
//     const handleChange = (selectedValue: string) => {
//         onChange?.(selectedValue);
//     };

//     const filteredOptions = options.filter(option => option.value !== '' && option.value !== null);

//     return (
//         <div className={`grid gap-2 w-full ${className}`}>
//             {label && <label className="font-medium leading-none">{label}</label>}
//             <Select value={value} onValueChange={handleChange} disabled={readOnly}>
//                 <SelectTrigger className="w-full">
//                     <SelectValue
//                         placeholder={placeholder}
//                         className={`${!value ? 'text-red-500' : ''}`}
//                     />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectGroup>
//                         {label && <SelectLabel>{label}</SelectLabel>}
//                         {filteredOptions.length > 0 ? (
//                             filteredOptions.map((option) => (
//                                 <SelectItem key={option.value} value={option.value}>
//                                     {option.label}
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

// export default SelectDropdown;

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
    readOnly?: boolean;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
    label,
    options,
    placeholder,
    value,
    onChange,
    className = '',
    readOnly = false
}) => {
    const handleChange = (selectedValue: string) => {
        onChange?.(selectedValue);
    };

    // Filter out invalid options
    const filteredOptions = options.filter(option =>
        option.value !== undefined &&
        option.value !== null &&
        option.value !== ''
    );

    return (
        <div className={`grid gap-2 w-full ${className}`}>
            {label && <label className="font-medium leading-none">{label}</label>}
            <Select
                value={value}
                onValueChange={handleChange}
                disabled={readOnly || filteredOptions.length === 0}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={
                            filteredOptions.length === 0
                                ? "No options available"
                                : placeholder
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {label && <SelectLabel>{label}</SelectLabel>}
                        {filteredOptions.map((option) => (
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
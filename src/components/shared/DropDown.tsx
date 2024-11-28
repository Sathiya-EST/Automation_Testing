import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectDropdownProps {
    label: string;
    options: SelectOption[];
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ label, options }) => (
    <div className="grid gap-2">
        <h4 className="font-medium leading-none">{label}</h4>
        <Select>
            <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
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

export default SelectDropdown;

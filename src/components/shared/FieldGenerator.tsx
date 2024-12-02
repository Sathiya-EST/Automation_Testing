import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectItem } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import DatePicker from "./Datepicker";
import TimePicker from "./TimePicker";
import SelectDropdown from "./DropDown";
import AsyncSelectDropdown from "./AsyncSelectDropdown";
import { CaseSensitive, CircleChevronDown, File, Hash, Search } from "lucide-react";
import DateTimePicker from "./DateTimepicker";

interface Field {
    name: string;
    layout: "GRID_1" | "GRID_2" | "GRID_3";
    field: {
        dataTypeName: string;
        type?: string;
        min?: number;
        max?: number;
        readOnly?: boolean;
        pattern?: string;
        formula?: string;
        required?: boolean;
        placeholder?: string;
        defaultValue?: string;
        alphabetic?: boolean;
        alphanumeric?: boolean;
        defaultChoice?: string[];
        uniqueValue?: boolean;
        decimalLimit?: number;
        positiveOnly?: boolean;
        negativeOnly?: boolean;
        multiple?: boolean;
        asynchronousField?: {
            formName?: string;
            fieldName?: string;
            fieldType?: string;
        };
        compute?: string[];
    };
    id: string;
}

interface FormProps {
    fields: Field[];
}

const FieldGenerator: React.FC<FormProps> = ({ fields }) => {
    const [date, setDate] = useState<Date | undefined>();
    const [selectedDateTime, setSelectedDateTime] = React.useState<string | undefined>(undefined);

    const handleDateTimeChange = (date: string | undefined) => {
        setSelectedDateTime(date);
    };
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
    };

    const handleTimeChange = (newTime: string) => {
        console.log(newTime);
    };

    const [selectedRecord, setSelectedRecord] = useState<string>("");

    const handleRecordChange = (value: string) => {
        setSelectedRecord(value);
    };

    const getGridClass = (layout: string) => {
        switch (layout) {
            case "GRID_1":
                return "grid-cols-1";
            case "GRID_2":
                return "grid-cols-2";
            case "GRID_3":
                return "grid-cols-3";
            default:
                return "grid-cols-3";
        }
    };

    const renderField = (field: Field) => {
        const { name, field: fieldProps } = field;
        const {
            type,
            dataTypeName,
            required,
            placeholder,
            defaultValue,
            defaultChoice,
            readOnly,
            multiple,
        } = fieldProps;

        const inputProps = {
            id: name,
            name: name,
            required,
            placeholder,
            defaultValue: defaultValue || "",
            readOnly: readOnly ?? false,
        };
        switch (type) {
            case "text":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <div className="relative">
                            <Input type={"text"} {...inputProps} className="pl-10" />
                            <CaseSensitive size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                );

            case "number":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <div className="relative">
                            <Input type={"number"} {...inputProps} pattern="[0-9]*" className="pl-10" />
                            <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                );
            case "numerical":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <div className="relative">
                            <Input type={"number"} {...inputProps} className="pl-10" />
                            <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                );
            case "select":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <div className="relative">
                            <SelectDropdown
                                options={
                                    defaultChoice?.map((option) => ({
                                        value: option,
                                        label: option,
                                    })) || []
                                }
                            />

                            {/* <CircleChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" /> */}
                        </div>

                    </div>
                );

            case "checkbox":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>
                            <Checkbox id={name} name={name} /> {name}
                        </Label>
                    </div>
                );

            case "date":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <DatePicker selectedDate={date} onChange={handleDateChange} />
                    </div>
                );

            case "upload":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <div className="relative">
                            <Input type="file" id={name} name={name} className="pl-10" required={required} multiple={multiple ?? false} />
                            <File size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                );

            case "time":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <TimePicker format={12} value={""} onChange={handleTimeChange} />
                    </div>
                );
            case "datetime":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <DateTimePicker
                            selectedDateTime={selectedDateTime}
                            onChange={handleDateTimeChange}
                            type="datetime"
                            placeholder="Select date and time"
                        />
                    </div>
                );
            case "asynchronouslist":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <AsyncSelectDropdown
                            tableName="your_table_name_here"
                            onChange={handleRecordChange}
                            value={selectedRecord}
                            placeholder={"placeholder"}
                        />
                    </div>
                );

            default:
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <Input type="text" {...inputProps} />
                    </div>
                );
        }
    };

    return (
        <form className={`grid gap-4 ${getGridClass(fields[0]?.layout)}`}>
            {fields.map(renderField)}
        </form>
    );
};

export default FieldGenerator;

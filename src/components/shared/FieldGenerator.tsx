import React, { useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import DatePicker from "./Datepicker";
import TimePicker from "./TimePicker";
import AsyncSelectDropdown from "./AsyncSelectDropdown";
import DateTimePicker from "./DateTimepicker";
import { CaseSensitive, File, Hash } from "lucide-react";
import SelectDropdown from "./DropDown";
import { FormFieldType } from "@/types/data";



interface FormProps {
    fields: FormFieldType[];
    control: Control<any>;
    // onSubmit: (data: FieldValues) => Promise<void>
    handleFetchAsyncOptions: (
        pageNo: number,
        pageSize: number,
        formName: string,
        fieldName: string,
        query: string
    ) => Promise<{ options: { label: string; value: string }[]; totalPages: number }>;
    layout: string;
}

const FieldGenerator: React.FC<FormProps> = ({ fields, control, handleFetchAsyncOptions,layout }) => {

    const [asyncDataOptions, setAsyncDataOptions] = useState<{ label: string; value: string }[]>([]);
    const [totalAsyncOptions, setTotalAsyncOptions] = useState(0);
    const [asyncOptionsLoading, setAsyncOptionsLoading] = useState(false);

    const getGridClass = (layout: string) => {
        switch (layout) {
            case "GRID_1":
                return "grid-cols-1";
            case "GRID_2":
                return "grid-cols-2";
            case "GRID_3":
                return "grid-cols-3";
            default:
                return "grid-cols-1";
        }
    };
    const handleFetchOptions = async (
        formName: string,
        fieldName: string,
        pageNo: number,
        pageSize: number,
        query: string
    ) => {
        setAsyncOptionsLoading(true);
        try {
            const { options, totalPages } = await handleFetchAsyncOptions(pageNo, pageSize, formName, fieldName, query);
            setAsyncDataOptions(options || []);
            setTotalAsyncOptions(totalPages);
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setAsyncOptionsLoading(false);
        }
    };


    const renderField = (field: FormFieldType) => {
        const { name, label, field: fieldProps } = field;
        const {
            type,
            required,
            placeholder,
            defaultValue,
            defaultChoice,
            readOnly,
            multiple,
            asynchronousField,
        } = fieldProps;

        switch (type) {
            case "text":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={defaultValue || ""}
                            render={({ field }) => (
                                <div className="relative">
                                    <Input {...field} type="text" required={required} placeholder={placeholder} className="pl-10" readOnly={readOnly} />
                                    <CaseSensitive size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                            )}

                        />
                    </div>
                );

            case "number":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={defaultValue || ""}
                            render={({ field }) => (
                                <div className="relative">
                                    <Input {...field} type="number" placeholder={placeholder} className="pl-10" />
                                    <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                            )}
                        />
                    </div>
                );
            case "numerical":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={defaultValue || ""}
                            render={({ field }) => (
                                <div className="relative">
                                    <Input {...field} type="number" placeholder={placeholder} className="pl-10" />
                                    <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                            )}
                        />
                    </div>
                );
            case "select":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={defaultChoice?.[0] || ""}
                            render={({ field }) => (
                                <SelectDropdown
                                    {...field}
                                    options={defaultChoice?.map((option) => ({ label: option, value: option })) || []}
                                // multiple={multiple ?? false}
                                />
                            )}
                        />
                    </div>
                );

            case "checkbox":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>
                            <Controller
                                name={name}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => <Checkbox {...field} />}
                            />{" "}
                            {name}
                        </Label>
                    </div>
                );

            case "date":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={null}
                            render={({ field }) => <DatePicker selectedDate={field.value} onChange={field.onChange} />}
                        />
                    </div>
                );

            case "datetime":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <DateTimePicker
                                    selectedDateTime={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select date and time"
                                />
                            )}
                        />
                    </div>
                );
            case "upload":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <div className="relative">
                                    <Input type="file" id={name} name={name} value={field.value} onChange={field.onChange} className="pl-10" required={required} multiple={multiple ?? false} />
                                    <File size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                            )}
                        />
                    </div>

                );
            case "time":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <div className="relative">
                                    <TimePicker format={12} value={field.value} onChange={field.onChange} />
                                </div>
                            )}
                        />
                    </div>
                );
            case "asynchronouslist":
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{label}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <AsyncSelectDropdown
                                    {...field}
                                    formName={asynchronousField?.formName ?? ""}
                                    fieldName={asynchronousField?.fieldName ?? ""}
                                    options={asyncDataOptions}
                                    isLoading={asyncOptionsLoading}
                                    totalPages={totalAsyncOptions || 0}
                                    fetchOptions={handleFetchOptions}
                                    placeholder="Select an option"
                                // multiple={multiple ?? false}
                                />
                            )}
                        />
                    </div>
                );

            default:
                return (
                    <div key={name} className="field-container">
                        <Label htmlFor={name}>{name}</Label>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={defaultValue || ""}
                            render={({ field }) => <Input {...field} type="text" />}
                        />
                    </div>
                );
        }
    };

    return (
        <div className={`grid gap-4 ${getGridClass(layout)}`}>
            {fields.map(renderField)}
        </div>
    )
};

export default FieldGenerator;

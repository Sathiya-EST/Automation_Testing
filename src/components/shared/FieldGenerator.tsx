import React, { useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import DatePicker from "./Datepicker";
import TimePicker from "./TimePicker";
import AsyncSelectDropdown from "./AsyncSelectDropdown";
import DateTimePicker from "./DateTimepicker";
import { CaseSensitive, File, Hash } from "lucide-react";
import SelectDropdown from "./DropDown";
import { FormFieldType } from "@/types/data";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import CustomSelect from "./CustomSelect";
import CustomAsyncSelect from "./CustomAsyncSelect";

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
    formAction?: 'view' | 'update' | 'add'
}

const FieldGenerator: React.FC<FormProps> = ({ fields, control, handleFetchAsyncOptions, layout, formAction }) => {
    const { formState: { errors } } = useFormContext();
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
            dataTypeName,
            required,
            placeholder,
            defaultValue,
            defaultChoice,
            readOnly,
            multiple,
            asynchronousField,
        } = fieldProps;

        // const isReadOnly = formAction === "view" || readOnly;
        const isReadOnly = formAction === "add" ? false : formAction === "view" ? true : readOnly;
        const fieldError: any = errors[name];

        switch (dataTypeName) {
            case "Text Input":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} type="text" required={required} placeholder={placeholder} className="pl-10" disabled={isReadOnly} defaultValue={defaultValue} />
                                    <CaseSensitive size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>

                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );

            case "Whole Number":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} type="number" placeholder={placeholder} className="pl-10" disabled={isReadOnly} defaultValue={defaultValue} />
                                    <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>

                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />

                )
            case "Decimal Number":
                return (

                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} type="number" placeholder={placeholder} className="pl-10" disabled={isReadOnly} defaultValue={defaultValue} />
                                    <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );
            case "List Box":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <CustomSelect
                                    {...field}
                                    options={defaultChoice || []}
                                    // options={defaultChoice?.map((option) => ({ label: option, value: option })) || []}
                                    readOnly={isReadOnly}
                                // multiple={multiple ?? false}
                                />
                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );

            case "Check Box / Boolean":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <FormControl>
                                    <Checkbox
                                        {...field}
                                        disabled={isReadOnly}
                                    />
                                </FormControl>
                                <FormLabel htmlFor={name} >{label}</FormLabel>

                            </div>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );

            case "Date":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <DatePicker selectedDate={field.value} onChange={field.onChange} readOnly={isReadOnly} />
                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );

            case "Date Time":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <DateTimePicker
                                    selectedDateTime={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select date and time"
                                    readOnly={isReadOnly}
                                />
                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );
            case "File Upload":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type="file" id={name} name={name} value={field.value} onChange={field.onChange} className="pl-10" required={required} multiple={multiple ?? false} readOnly={isReadOnly}
                                    // defaultValue={defaultValue}
                                    />
                                    <File size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>

                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );
            case "time":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <TimePicker format={12} value={field.value} onChange={field.onChange} readOnly={isReadOnly} />
                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );
            case "Asynchronous List":
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <CustomAsyncSelect
                                    {...field}
                                    formName={asynchronousField?.formName ?? ""}
                                    fieldName={asynchronousField?.fieldName ?? ""}
                                    options={asyncDataOptions}
                                    isLoading={asyncOptionsLoading}
                                    totalPages={totalAsyncOptions || 0}
                                    fetchOptions={handleFetchOptions}
                                    placeholder="Select an option"
                                    readOnly={isReadOnly}
                                // multiple={multiple ?? false}
                                />
                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
                );

            default:
                return (
                    <FormField key={name} control={control} name={name} render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                            <FormControl>
                                <Input {...field} type="text" readOnly={isReadOnly} defaultValue={defaultValue} />
                            </FormControl>
                            {/* <FormDescription>{fieldError?.message && <p>{fieldError.message}</p>}</FormDescription> */}
                            <FormMessage>
                                {fieldError?.message ? fieldError.message : null}
                            </FormMessage>
                        </FormItem>)}
                    />
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

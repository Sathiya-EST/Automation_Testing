import SelectDropdown from '@/components/shared/DropDown';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Control, useFormContext } from 'react-hook-form';
import DataTypeList from '../mock.json';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/types/data';
import { Button } from '@/components/ui/button';

type FieldControllerProps = {
    control: Control<any>;
    fieldIndex: number;
    handleSubmit: (data: any) => void;
};

const FieldController = ({ control, fieldIndex, handleSubmit }: FieldControllerProps) => {
    const { setValue, getValues } = useFormContext();
    const DataTypeoptions = DataTypeList.map(item => ({
        value: item.dataType,
        label: item.name
    }));
    const [selectedDataType, setSelectedDataType] = useState<string | null>(null);
    const [fieldsConfig, setFieldsConfig] = useState<Field>();

    useEffect(() => {
        if (selectedDataType) {
            const fieldConfig = DataTypeList.find((field) => field.dataType === selectedDataType);
            setFieldsConfig(fieldConfig as Field);
        }
    }, [selectedDataType]);

    const handleFieldUpdate = (value: string | boolean, fieldName: string) => {
        const updatedFields = getValues("fields");
        updatedFields[fieldIndex][fieldName] = value;
        setValue("fields", updatedFields);

        if (fieldName === 'dataTypeName') {
            setSelectedDataType(value as string);
            console.log("Selected DataType Updated:", value);
        }
    };


    const onFieldSubmit = (data: any) => {
        console.log("Field data submitted", data);
        handleSubmit(data);
    };

    return (
        <Card>
            <CardHeader className="p-4 font-semibold border-b-2">Add New Field</CardHeader>
            <CardContent className="grid gap-2 overflow-y-auto p-2">
                <form onSubmit={onFieldSubmit} className="grid gap-2 gap-y-5">
                    {/* Column Name Field */}
                    <FormField
                        control={control}
                        name={`fields.${fieldIndex}.name`}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-2">
                                <FormLabel htmlFor="name" className="text-left font-normal">
                                    Column Name
                                </FormLabel>
                                <div className="col-span-2 relative">
                                    <FormControl>
                                        <Input
                                            id="name"
                                            className="h-9 peer"
                                            placeholder="Enter Column Name"
                                            onChange={(e) => {
                                                handleFieldUpdate(e.target.value, 'name');
                                                field.onChange(e);
                                            }}
                                            value={field.value}
                                            name={field.name}
                                        />
                                    </FormControl>
                                    <FormDescription
                                        className="absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300"
                                    >
                                        Name of the Field
                                    </FormDescription>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Property Type Field */}
                    <FormField
                        control={control}
                        name={`fields.${fieldIndex}.field.dataTypeName`}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-2">
                                <FormLabel htmlFor="dataTypeName" className="text-left font-normal">
                                    Property Type
                                </FormLabel>
                                <div className="col-span-2">
                                    <FormControl>
                                        <SelectDropdown
                                            options={DataTypeoptions}
                                            className="h-9 peer"
                                            onChange={(value) => {
                                                handleFieldUpdate(value, 'dataTypeName');
                                                field.onChange(value);
                                            }}
                                            value={field.value}
                                            placeholder="Select Data type"
                                        />
                                    </FormControl>
                                    <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                        Defines the data type for the field.
                                    </FormDescription>
                                    <FormMessage className="mt-1 text-sm text-red-600" />
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Description Field */}
                    <FormField
                        control={control}
                        name={`fields.${fieldIndex}.field.description`}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-2">
                                <FormLabel htmlFor="description" className="text-left font-normal">
                                    Description
                                </FormLabel>
                                <div className="col-span-2">
                                    <FormControl>
                                        <Textarea
                                            id="description"
                                            className="h-8 peer"
                                            placeholder="Enter Description"
                                            onChange={(e) => {
                                                handleFieldUpdate(e.target.value, 'description');
                                                field.onChange(e);
                                            }}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormDescription className="absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                        Provides more info about the field.
                                    </FormDescription>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Dynamic Fields based on config */}
                    {fieldsConfig?.required && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.required`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="required" className="text-left font-normal">
                                        Required
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="required"
                                                className="text-gray-500"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'required');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            There must be a value in every row
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.uniqueValue && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.uniqueValue`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="uniqueValue" className="text-left font-normal">
                                        Unique
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="uniqueValue"
                                                className="text-gray-500"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'uniqueValue');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            Different rows must have different values for this field
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.readOnly && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.readOnly`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="readOnly" className="text-left font-normal">
                                        Read Only
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="readOnly"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'readOnly');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            This field cannot be edited by users
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.min && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.min`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="min" className="text-left font-normal">
                                        Min Length
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <Input
                                                id="min"
                                                className="h-9 peer"
                                                type="number"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'min');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Minimum number of characters in the string
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.max && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.max`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="max" className="text-left font-normal">
                                        Max Length
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <Input
                                                id="max"
                                                className="h-9 peer"
                                                type="number"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'max');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Maximum number of characters in the string
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 p-4">
                <Button type='button' className="btn-primary">Clear</Button>
                <Button type='submit' className="btn-primary" onClick={onFieldSubmit}>Update</Button>
            </CardFooter>
        </Card>
    );
};

export default FieldController;
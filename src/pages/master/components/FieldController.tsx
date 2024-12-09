import { z } from 'zod';
import SelectDropdown from '@/components/shared/DropDown';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Control, SubmitHandler, useController, useFieldArray, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTypes, Field } from '@/types/data';
import { Button } from '@/components/ui/button';
import Text from '@/components/shared/Text';
import SelectFieldOptions from '@/pages/master/components/SelectFieldOptions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SelectWithCustomInput from '@/pages/master/components/SelectWithCustomInput';



type FieldControllerProps = {
    control: Control<any>;
    fieldIndex: number;
    handleFieldUpdate: (value: string | boolean | number | string[], fieldName: string) => void;
    handleAsyncFieldUpdate: (value: string | boolean | number, fieldName: string) => void;
    dataType: DataTypes[];

};

const FieldController = ({
    control,
    fieldIndex,
    handleFieldUpdate,
    handleAsyncFieldUpdate,
    dataType,
}: FieldControllerProps) => {
    const [fieldsConfig, setFieldsConfig] = useState<Field>();

    const { field: { value: selectedType, onChange } } = useController({
        name: `fields[${fieldIndex}].field.type`,
        control,
    });
    const positiveOnly = useWatch({
        name: `fields[${fieldIndex}].field.positiveOnly`,
        control,
    });
    const negativeOnly = useWatch({
        name: `fields[${fieldIndex}].field.negativeOnly`,
        control,
    });
    const DataTypeoptions = dataType.map(item => ({
        value: item.dataType,
        label: item.name
    }));
    const DefaultChoices = useWatch({
        name: `fields.${fieldIndex}.field.defaultChoice`,
        control,
    });

    useEffect(() => {
        if (selectedType) {
            const fieldConfig = dataType.find((field) => field.dataType === selectedType);
            console.log("Found fieldConfig", fieldConfig);

            if (fieldConfig) {
                setFieldsConfig(fieldConfig as Field);
            } else {
                console.log("No fieldConfig found for dataType", selectedType);
            }
        }
    }, [selectedType, dataType]);

    const ASYNC_FIELD = 'asynchronouslist';
    const SELECT_FIELD = 'select';
    const FILE_FIELD = 'upload';
    const MAX_DEFAULTCHOICE = 3;

    const renderDefaultChoices = Array.isArray(DefaultChoices) && Array.isArray(DefaultChoices[fieldIndex])
        ? DefaultChoices[fieldIndex].length > 0
            ? DefaultChoices[fieldIndex].length > MAX_DEFAULTCHOICE
                ? DefaultChoices[fieldIndex].slice(0, MAX_DEFAULTCHOICE).join(", ") + "..."
                : DefaultChoices[fieldIndex].join(", ")
            : "No options available"
        : "Configure Select options";



    return (
        <Card>
            <CardHeader className=" font-semibold border-b-2">
                Add New Field
            </CardHeader>
            <CardContent className="grid gap-2 overflow-y-auto p-2 pb-5 mb-1">
                {/* Directly using parent form control */}
                <div className="grid gap-2 gap-y-5 ">
                    {/* Column Name Field */}
                    <FormField
                        control={control}
                        name={`fields[${fieldIndex}].name`}
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
                                            {...field}
                                            onChange={(e) => {
                                                handleFieldUpdate(e.target.value, 'name');
                                                field.onChange(e);
                                            }}
                                        // autoFocus={field ? true : false}

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
                    <FormField
                        control={control}
                        name={`fields[${fieldIndex}].dataTypeName`}
                        render={({ field }) => (
                            <FormItem className="hidden">
                                <FormLabel htmlFor="dataTypeName" className="text-left font-normal">
                                    Data type Name
                                </FormLabel>
                                <div className="col-span-2 relative">
                                    <FormControl>
                                        <Input
                                            id="dataTypeName"
                                            className="h-9 peer"
                                            placeholder="Enter Column Name"
                                            {...field}
                                            onChange={(e) => {
                                                handleFieldUpdate(e.target.value, 'dataTypeName');
                                                field.onChange(e);
                                            }}
                                            value={''}
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
                        name={`fields[${fieldIndex}].field.type`}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-2">
                                <FormLabel htmlFor="type" className="text-left font-normal">
                                    Property Type
                                </FormLabel>
                                <div className="col-span-2">
                                    <FormControl>
                                        <SelectDropdown
                                            options={DataTypeoptions}
                                            className="h-9 peer"
                                            onChange={(value) => {
                                                handleFieldUpdate(value, 'type');
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
                    {/* <FormField
                        control={control}
                        name={`fields[${fieldIndex}].field.description`}
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
                                            {...field}
                                            onChange={(e) => {
                                                handleFieldUpdate(e.target.value, 'description');
                                                field.onChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription className="absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                        Provides more info about the field.
                                    </FormDescription>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    /> */}

                    {selectedType === SELECT_FIELD && (
                        <Popover>
                            <FormField
                                control={control}
                                name={`fields[${fieldIndex}].field.defaultChoice`}
                                render={({ field }) => {
                                    return (
                                        <FormItem className="grid grid-cols-3 items-center gap-2">
                                            <FormLabel htmlFor="type" className="text-left font-normal">
                                                Select Options
                                            </FormLabel>
                                            <div className="col-span-2">
                                                <FormControl>
                                                    {/* PopoverTrigger should properly wrap the Button */}
                                                    <PopoverTrigger asChild>
                                                        <Button type="button" variant="outline" className='text-blue-500'>
                                                            {renderDefaultChoices}
                                                        </Button>
                                                    </PopoverTrigger>
                                                </FormControl>

                                                <PopoverContent className="w-auto max-h-80 p-0 overflow-y-auto">
                                                    <SelectFieldOptions control={control} fieldIndex={fieldIndex} />
                                                </PopoverContent>
                                                <FormMessage className="mt-1 text-sm text-red-600" />
                                            </div>
                                        </FormItem>
                                    );
                                }}
                            />
                        </Popover>
                    )}
                    {selectedType === FILE_FIELD && (
                        <FormField
                            control={control}
                            name={`fields[${fieldIndex}].field.defaultChoice`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="type" className="text-left font-normal">
                                        File Type
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <SelectWithCustomInput
                                                onChange={(value: string[]) => {
                                                    handleFieldUpdate(value, 'defaultChoice');
                                                    console.log("Selected Value:", value);
                                                    field.onChange(value);
                                                }}
                                                placeholder="Select Data type"
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Defines the file type for the field.
                                        </FormDescription>
                                        <FormMessage className="mt-1 text-sm text-red-600" />
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}





                    {/* Asynchoronous field Properties */}
                    {selectedType === ASYNC_FIELD && (
                        <>
                            <Text className="font-semibold">Asynchronous Field Properties</Text>
                            <FormField
                                control={control}
                                name={`fields[${fieldIndex}].asynchronousField.formName`}
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-2">
                                        <FormLabel htmlFor="formName" className="text-left font-normal">
                                            Form Name
                                        </FormLabel>
                                        <div className="col-span-2 relative">
                                            <FormControl>
                                                <Input
                                                    id="formName"
                                                    className="h-9 peer"
                                                    placeholder="Enter Form Name"
                                                    {...field}
                                                    onChange={(e) => {
                                                        handleFieldUpdate(e.target.value, 'formName');
                                                        field.onChange(e);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription
                                                className="absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300"
                                            >
                                                Enter the name of the form containing the observed field.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`fields[${fieldIndex}].asynchronousField.fieldName`}
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-2">
                                        <FormLabel htmlFor="fieldName" className="text-left font-normal">
                                            Field Name
                                        </FormLabel>
                                        <div className="col-span-2 relative">
                                            <FormControl>
                                                <Input
                                                    id="fieldName"
                                                    className="h-9 peer"
                                                    placeholder="Enter Field Name"
                                                    {...field}
                                                    onChange={(e) => {
                                                        handleAsyncFieldUpdate(e.target.value, 'fieldName');
                                                        field.onChange(e);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription
                                                className="absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300"
                                            >
                                                Enter the name of the field to be observed for changes or interactions.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`fields[${fieldIndex}].field.asynchronousField.fieldtype`}
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-2">
                                        <FormLabel htmlFor="fieldtype" className="text-left font-normal">
                                            Field Type
                                        </FormLabel>
                                        <div className="col-span-2">
                                            <FormControl>
                                                <SelectDropdown
                                                    options={DataTypeoptions}
                                                    className="h-9 peer"
                                                    onChange={(value) => {
                                                        handleAsyncFieldUpdate(value, 'fieldtype');
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                    placeholder="Select Field type"
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
                        </>

                    )}

                    {/* Dynamic Fields based on config */}
                    {fieldsConfig?.required && (
                        <FormField
                            control={control}
                            name={`fields[${fieldIndex}].field.required`}
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

                    {/* {fieldsConfig?.readOnly && ( */}
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
                    {/* )} */}
                    {fieldsConfig?.alphabetic && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.alphabetic`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="alphabetic" className="text-left font-normal">
                                        Alphabetic
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="alphabetic"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'alphabetic');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            Letters only (a-z, A-Z), without spaces or special characters.
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.alphanumeric && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.alphanumeric`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="alphanumeric" className="text-left font-normal">
                                        Alphanumeric
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="alphanumeric"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'alphanumeric');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            Combination of letters (a-z, A-Z) and numbers (0-9), without spaces or special characters.
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.positiveOnly && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.positiveOnly`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="positiveOnly" className="text-left font-normal">
                                        Positive only
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="positiveOnly"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'positiveOnly');
                                                    field.onChange(checked);
                                                }}
                                                disabled={negativeOnly}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            Accept Positiove numers Only                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.negativeOnly && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.negativeOnly`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="negativeOnly" className="text-left font-normal">
                                        Negative
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="negativeOnly"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'negativeOnly');
                                                    field.onChange(checked);
                                                }}
                                                disabled={positiveOnly}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            Accept Negative numers also                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.multiple && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.multiple`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="multiple" className="text-left font-normal">
                                        Multiple
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="multiple"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'multiple');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            Accept Positiove numers Only                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.placeholder && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.placeholder`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="placeholder" className="text-left font-normal">
                                        Placeholder
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <Input
                                                id="placeholder"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'placeholder');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Placeholder of the field
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.defaultValue && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.defaultValue`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="defaultValue" className="text-left font-normal">
                                        DefaultValue
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <Input
                                                id="defaultValue"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'defaultValue');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Default value for the field
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.pattern && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.pattern`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="pattern" className="text-left font-normal">
                                        Pattern
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <Input
                                                id="pattern"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'pattern');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Format  input according to the (Regex) Pattern
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.formula && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.formula`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="formula" className="text-left font-normal">
                                        formula
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <Input
                                                id="formula"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'formula');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Formula to calculate the value
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.defaultChoice && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.defaultChoice`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="defaultChoice" className="text-left font-normal">
                                        DefaultChoice
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <Input
                                                id="defaultChoice"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'defaultChoice');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Options for the Select field
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.decimalLimit && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.decimalLimit`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="decimalLimit" className="text-left font-normal">
                                        DecimalLimit
                                    </FormLabel>
                                    <div className="col-span-2">
                                        <FormControl>
                                            <Input
                                                id="decimalLimit"
                                                type='number'
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'decimalLimit');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription className="mt-1 absolute text-xs text-gray-500 opacity-0 peer-focus-within:opacity-100 transition-opacity duration-300">
                                            Decimal Limit for the Numeric value
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
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
                                                    const numericValue = parseFloat(e.target.value);
                                                    handleFieldUpdate(numericValue, 'min');
                                                    field.onChange(numericValue);
                                                    console.log(typeof numericValue, numericValue, "Numeric Value");
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
                                                    const numericValue = parseFloat(e.target.value);
                                                    handleFieldUpdate(numericValue, 'max');
                                                    field.onChange(numericValue);
                                                    console.log(typeof numericValue, numericValue, "Numeric Value");
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
                </div>
            </CardContent>
            {/* <CardFooter className="flex justify-end gap-3 p-4">
                <Button
                    type='button'
                    variant="outline"
                    onClick={() => control._reset()}
                >
                    Clear
                </Button>
                <Button
                    type='button'
                    onClick={() => control.handleSubmit(onFieldSubmit)}
                >
                    Update
                </Button>
            </CardFooter> */}
        </Card >
    );
};

export default FieldController;

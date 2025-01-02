import React, { useEffect, useRef } from 'react';
import { Control, useFieldArray, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Define the field structure
interface FieldData {
    name: string;
    field: {
        type: string;
        placeholder: string;
        dataTypeName?: string;
        min?: number;
        max?: number;
        negativeOnly?: boolean;
        readOnly?: boolean;
        asynchronousField?: {
            // Add async field properties as needed
        };
    };
}

// Define the form data structure
interface FormData {
    moduleName?: string;
    formName?: string;
    formLayout: string;
    formPurpose?: 'MASTER';
    fields: FieldData[];
    formDescription?: string;
}

// Define form edit data structure
interface FormEditData {
    fieldName: string;
    fields: FieldData[];
    position: string;
}

interface DynamicFieldProps {
    control: any;
    // control: Control<FormData> | Control<FormEditData>;
    layout: 'GRID_1' | 'GRID_2' | 'GRID_3' | string;
    onFieldFocus?: (index: number) => void;
    onFieldDelete: (index: number) => void;
    selectedFieldIndex: number | null;
    errors?: FieldErrors<FormData> | FieldErrors<FormEditData>;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
    control,
    layout,
    onFieldFocus,
    onFieldDelete,
    selectedFieldIndex,
    errors
}) => {
    const { fields, append } = useFieldArray({
        control: control as Control<FormData>,
        name: 'fields' as const
    });

    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const gridClass = {
        GRID_1: 'grid-cols-1',
        GRID_2: 'grid-cols-2',
        GRID_3: 'grid-cols-3',
    }[layout] || 'grid-cols-1';

    const handleFocus = (index: number) => {
        onFieldFocus?.(index);
    };

    useEffect(() => {
        if (selectedFieldIndex !== null && refs.current[selectedFieldIndex]) {
            refs.current[selectedFieldIndex]?.focus();
        }
    }, [selectedFieldIndex, fields]);

    // Function to check if a specific field has an error
    const hasFieldError = (index: number) => {
        return errors?.fields && Array.isArray(errors.fields) && errors.fields[index] !== undefined;
    };

    return (
        <div className="w-full">
            <div className={`grid gap-4 ${gridClass}`}>
                {fields.map((field, index) => {
                    const fieldData = field as unknown as FieldData;
                    const isSelected = selectedFieldIndex === index;
                    const hasError = hasFieldError(index);

                    return (
                        <div
                            key={field.id}
                            className={`relative group flex flex-col space-y-2`}
                            onClick={() => handleFocus(index)}
                        >
                            <FormItem className={hasError ? 'text-red-500' : ''}>
                                <FormLabel>{fieldData.name || `Field ${index + 1}`}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...(control.register as UseFormRegister<FormData | FormEditData>)(`fields.${index}.name` as const, {
                                            // Add ref to the registration options
                                            // shouldUseNativeValidation: true,
                                            onChange: (e) => {
                                                // Store the ref when the input is mounted
                                                refs.current[index] = e.target;
                                            }
                                        })}
                                        id={`fields.${index}.name`}
                                        type="text"
                                        placeholder={fieldData.field?.placeholder}
                                        className={` ${isSelected ? 'bg-primary/10' : ''}${hasError ? 'border-red-500 bg-red-50' : ''}
                    `}
                                        readOnly={true}
                                    />
                                    {/* <Input
                                        ref={(el) => (refs.current[index] = el)}
                                        id={`fields.${index}.name`}
                                        type="text"
                                        placeholder={fieldData.field?.placeholder}
                                        {...(control.register as UseFormRegister<FormData | FormEditData>)(`fields.${index}.name` as const)}
                                        className={` ${isSelected ? 'bg-primary/10' : ''} ${hasError ? 'border-red-500 bg-red-50' : ''}`}
                                        readOnly={true}
                                    /> */}
                                </FormControl>
                                {hasError && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors?.fields?.[index]?.name?.message}
                                    </div>
                                )}
                            </FormItem>

                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFieldDelete(index);
                                    }}
                                    className="absolute top-0 right-0 p-2 text-red-500 hidden group-hover:block"
                                >
                                    <Trash2 />
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
            <Button
                type="button"
                variant="ghost"
                onClick={() =>
                    append({
                        name: '',
                        field: {
                            type: '',
                            placeholder: '',
                        },
                    } as FieldData)
                }
                className="flex items-center space-x-2 mt-4"
            >
                <Plus />
                <span>Add new field</span>
            </Button>
        </div>
    );
};

export default DynamicField;
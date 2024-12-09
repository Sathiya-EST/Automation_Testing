
import React, { useEffect, useRef } from 'react';
import { Control, useFieldArray, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { FormSchema } from './CreateFormComp';
import { FormEditSchema } from '../preview';

interface DynamicFieldProps {
    control: Control<z.infer<typeof FormSchema>> | Control<z.infer<typeof FormEditSchema>>;
    layout: 'GRID_1' | 'GRID_2' | 'GRID_3' | string;
    onFieldFocus?: (index: number) => void;
    onFieldDelete: (index: number) => void;
    selectedFieldIndex: number | null;
    errors?: FieldErrors<z.infer<typeof FormSchema>>;
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
        control,
        name: 'fields',
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
        return errors?.fields && errors.fields[index] !== undefined;
    };

    return (
        <div className="w-full">
            <div className={`grid gap-4 ${gridClass}`}>
                {fields.map((field, index) => {
                    const { name, field: fieldDetails } = field;
                    const isSelected = selectedFieldIndex === index;
                    const hasError = hasFieldError(index);

                    return (
                        <div
                            key={field.id}
                            className={`relative group flex flex-col space-y-2`}
                            onClick={() => handleFocus(index)}
                        >
                            <FormItem className={hasError ? 'text-red-500' : ''}>
                                <FormLabel> {name || `Field ${index + 1}`}</FormLabel>
                                <FormControl>
                                    <Input
                                        id={`fields.${index}.name`}
                                        type="text"
                                        placeholder={fieldDetails?.placeholder}
                                        {...control.register(`fields.${index}.name`)}
                                        className={`
                                            ${isSelected ? 'bg-primary/10' : ''}
                                            ${hasError ? 'border-red-500 bg-red-50' : ''}
                                        `}
                                        readOnly={true}
                                    />
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
                    })
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
import React, { useEffect, useRef } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FieldGenerator from '@/components/shared/FieldGenerator';

interface DynamicFieldProps {
    control: Control<any>;
    layout: 'GRID_1' | 'GRID_2' | 'GRID_3' | string;
    onFieldFocus?: (index: number) => void;
    onFieldDelete: (index: number) => void;
    selectedFieldIndex: number | null;
}

interface Field {
    name: string;
    field: {
        dataTypeName: string;
        placeholder: string;
        value?: string;
    };
}

interface FormValues {
    fields: Field[];
}

const DynamicField: React.FC<DynamicFieldProps> = ({
    control,
    layout,
    onFieldFocus,
    onFieldDelete,
    selectedFieldIndex,
}) => {
    const { fields, append } = useFieldArray<FormValues>({
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

    const handleDelete = (index: number) => {
        onFieldDelete(index);
    };
    useEffect(() => {
        if (selectedFieldIndex !== null && refs.current[selectedFieldIndex]) {
            refs.current[selectedFieldIndex]?.focus();
        }
    }, [selectedFieldIndex, fields]);
    return (
        <div className="w-full">
            <div className={`grid gap-4 ${gridClass}`}>
                {/* <FieldGenerator fields={fields} /> */}
                {fields.map((field, index) => {
                    const { name, field: fieldDetails } = field;

                    const isSelected = selectedFieldIndex === index;
                    return (
                        <div
                            key={field.id}
                            className={`relative group flex flex-col space-y-2 `}
                            onClick={() => handleFocus(index)}
                        >
                            <FormItem>
                                <FormLabel>{name || `Field ${index + 1}`}</FormLabel>
                                <FormControl>
                                    <Input
                                        id={`fields.${index}.name`}
                                        type="text"
                                        placeholder={
                                            fieldDetails?.placeholder || `Enter ${name || 'field name'}`
                                        }
                                        {...control.register(`fields.${index}.field.value`)}

                                        className={`${isSelected ? 'bg-primary/10' : 'focus:none'}`}
                                        readOnly={true}

                                    />
                                </FormControl>
                            </FormItem>

                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleDelete(index)}
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
                            dataTypeName: '',
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

import Grid1Layout from '@/assets/Grid_1';
import Grid2Layout from '@/assets/Grid_2';
import Grid3Layout from '@/assets/Grid_3';
import Text from '@/components/shared/Text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LAYOUT } from '@/constants/app.constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DynamicField from './DynamicField';
import FieldController from './FieldController';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import FormUpload from '@/assets/FormUpload';
import { DataTypes, layoutValues } from '@/types/data';



export const FormSchema = z.object({
    moduleName: z.string(),
    formName: z.string().min(2, {
        message: "Form name must be at least 2 characters.",
    }),
    formDescription: z.string().min(10, {
        message: "Form Description must be at least 10 characters.",
    }).optional(),
    formLayout: z.enum(layoutValues, {
        required_error: "You need to select a Layout type.",
    }),
    formPurpose: z.literal("MASTER", {
        errorMap: () => ({ message: "Form purpose must be MASTER" }),
    }),
    fields: z.array(
        z.object({
            name: z.string().min(1, 'Field name is required'),
            field: z.object({
                dataTypeName: z.string().optional(),
                type: z.string(),
                min: z.number().int().optional(),
                max: z.number().int().optional(),
                negativeOnly: z.boolean().optional(),
                readOnly: z.boolean().optional(),
                pattern: z.string().optional(),
                formula: z.string().optional(),
                required: z.boolean().optional(),
                placeholder: z.string().optional(),
                defaultValue: z.string().optional(),
                alphabetic: z.boolean().optional(),
                alphanumeric: z.boolean().optional(),
                defaultChoice: z.array(z.string()).optional(),
                uniqueValue: z.boolean().optional(),
                decimalLimit: z.number().int().min(0).optional(),
                positiveOnly: z.boolean().optional(),
                multiple: z.boolean().optional(),
                asynchronousField: z.object({
                    formName: z.string(),
                    fieldName: z.string(),
                    fieldType: z.string(),
                }).optional(),
                // options: z.array(z.string()).optional(),
                compute: z.array(
                    z.object({
                        fromField: z.string(),
                        toField: z.string(),
                        toCustomValue: z.object({}).optional(),
                        condition: z.string(),
                        value: z.object({}).optional(),
                        elseValue: z.object({}).optional(),
                    })
                ).optional(),
            }).superRefine((data, ctx) => {
                if (data.negativeOnly) {
                    if (data.min !== undefined && data.max !== undefined && data.min > data.max) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['min'],
                            message: "Min value must be less than Max value when negativeOnly is true.",
                        });
                    }
                } else {
                    if (data.min !== undefined && data.min < 0) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['min'],
                            message: "Min value cannot be negative when negativeOnly is false.",
                        });
                    }
                    if (data.max !== undefined && data.max < 0) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['max'],
                            message: "Max value cannot be negative when negativeOnly is false.",
                        });
                    }
                    if (data.min !== undefined && data.max !== undefined && data.min > data.max) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['min'],
                            message: "Min value must be less than Max value.",
                        });
                    }
                }
            }),
        })
    ).min(1, 'At least one field is required.'),
});

export type FormType = z.infer<typeof FormSchema>;
interface CreateFormProps {
    moduleName: string
    dataType: DataTypes[]
    handleCreateForm: (data: FormType) => void
}
const CreateFormComp: React.FC<CreateFormProps> = ({ moduleName, dataType, handleCreateForm }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            moduleName: moduleName,
            formName: "",
            formDescription: "",
            formLayout: "GRID_1",
            formPurpose: "MASTER",
            fields: [
                {
                    name: "",
                    field: {
                        dataTypeName: "",

                    },
                },
            ],
        },
    });

    const [focusedField, setFocusedField] = useState<number | null>(0);
    const [isFormCreated, setIsFormCreated] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(LAYOUT.GRID_1);

    const handleLayoutClick = (value: string) => {
        setSelectedValue(value);
        form.setValue("formLayout", value);
    };

    const onSubmit = (data: FormType) => {
        handleCreateForm(data);
        setIsFormCreated(true);
    };
    const errors = form.formState.errors;
    console.log("errors", errors);
    const handleFieldFocus = (index: number) => {
        setFocusedField(index);
    };

    const handleFieldUpdate = (value: string | string[] | number | boolean, fieldName: string) => {
        const currentFields = form.getValues("fields");

        const updatedFields = currentFields.map((field) => {
            if (field.name === fieldName) {
                let updatedValue = value;

                if (fieldName === 'defaultChoice') {
                    const normalizedValue = Array.isArray(value)
                        ? value.map((v) => String(v))
                        : [String(value)];

                    updatedValue = Array.from(new Set(normalizedValue));
                }

                return {
                    ...field,
                    field: {
                        ...field.field,
                        [fieldName]: updatedValue
                    }
                };
            }
            return field;
        });

        form.setValue("fields", updatedFields);
    };



    const handleAsyncFieldUpdate = (value: string | number | boolean, fieldName: string) => {
        const currentFields = form.getValues("fields");

        const updatedFields = currentFields.map((field) =>
            field.field.asynchronousField && field.field.asynchronousField.hasOwnProperty(fieldName)
                ? {
                    ...field,
                    field: {
                        ...field.field,
                        asynchronousField: {
                            ...field.field.asynchronousField,
                            [fieldName]: value,
                        },
                    },
                }
                : field
        );

        form.setValue("fields", updatedFields);
    };
    const handleFieldDelete = (deletedIndex: number) => {
        const currentFields = form.getValues("fields");
        const updatedFields = currentFields.filter((_, index) => index !== deletedIndex);
        form.setValue("fields", updatedFields);
        if (focusedField === deletedIndex) {
            console.log('Condition passed')
            setFocusedField(null);
        }
        else if (focusedField !== null && focusedField > deletedIndex) {
            setFocusedField(focusedField - 1);
        }
    };

    return (
        <>
            <Dialog open={isFormCreated} onOpenChange={setIsFormCreated}>
                <Form {...form}>
                    {/* {JSON.stringify(dataType)} */}
                    <form className="space-x-4 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex gap-4">
                            <section className="flex-[4]">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            <Text className="font-semibold">{moduleName}</Text>
                                        </CardTitle>
                                        <div className="flex items-center justify-between">
                                            <Text className="font-semibold">Create New Table</Text>
                                            {/* <DialogTrigger asChild> */}
                                            <Button type='submit'>Generate</Button>
                                            {/* </DialogTrigger> */}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="moduleName"
                                            render={({ field }) => (
                                                <FormItem className="hidden">
                                                    <FormLabel>Module Name</FormLabel>
                                                    <FormControl>
                                                        <Input  {...field} value={moduleName} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="space-y-5">
                                            <FormField
                                                control={form.control}
                                                name="formName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Form Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter Form Name" autoFocus {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="formDescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Enter Form Description" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="formLayout"
                                                render={() => (
                                                    <FormItem className="flex items-center gap-4 h-auto">
                                                        <FormLabel className="flex-shrink-0">Choose Layout</FormLabel>
                                                        <div className="flex gap-4">
                                                            <div
                                                                className="cursor-pointer"
                                                                onClick={() => handleLayoutClick(LAYOUT.GRID_1)}
                                                                aria-label="Grid 1 Layout"
                                                            >
                                                                <Grid1Layout
                                                                    className={`${selectedValue === LAYOUT.GRID_1 ? 'stroke-primary' : 'stroke-gray-300'}`}
                                                                    fillColorclass={`${selectedValue === LAYOUT.GRID_1 ? 'fill-primary' : 'fill-gray-500'}`}
                                                                />
                                                            </div>
                                                            <div
                                                                className="cursor-pointer"
                                                                onClick={() => handleLayoutClick(LAYOUT.GRID_2)}
                                                                aria-label="Grid 2 Layout"
                                                            >
                                                                <Grid2Layout
                                                                    className={`${selectedValue === LAYOUT.GRID_2 ? 'stroke-primary' : 'stroke-gray-300'}`}
                                                                    fillColorclass={`${selectedValue === LAYOUT.GRID_2 ? 'fill-primary' : 'fill-gray-500'}`}
                                                                />
                                                            </div>
                                                            <div
                                                                className="cursor-pointer"
                                                                onClick={() => handleLayoutClick(LAYOUT.GRID_3)}
                                                                aria-label="Grid 3 Layout"
                                                            >
                                                                <Grid3Layout
                                                                    className={`${selectedValue === LAYOUT.GRID_3 ? 'stroke-primary' : 'stroke-gray-300'}`}
                                                                    fillColorclass={`${selectedValue === LAYOUT.GRID_3 ? 'fill-primary' : 'fill-gray-500'}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <DynamicField
                                                control={form.control}
                                                layout={selectedValue}
                                                onFieldFocus={handleFieldFocus}
                                                onFieldDelete={handleFieldDelete}
                                                selectedFieldIndex={focusedField}
                                                errors={form.formState.errors}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>
                            {focusedField !== null && (
                                <aside className="flex-[2]">
                                    <FieldController
                                        key={`field-controller-${focusedField}`}
                                        control={form.control}
                                        fieldIndex={focusedField}
                                        handleFieldUpdate={handleFieldUpdate}
                                        handleAsyncFieldUpdate={handleAsyncFieldUpdate}
                                        dataType={dataType}
                                    />
                                </aside>
                            )}

                        </div>
                    </form>
                </Form>
                <DialogContent className="sm:max-w-100 h-auto">
                    <FormUpload />
                    <DialogTitle className='w-full text-center text-xl'>Form Generated Successfully!</DialogTitle>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateFormComp;

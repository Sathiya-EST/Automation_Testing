import Grid1Layout from '@/assets/Grid_1';
import Grid2Layout from '@/assets/Grid_2';
import Grid3Layout from '@/assets/Grid_3';
import Text from '@/components/shared/Text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FILE_FIELD, LAYOUT, SELECT_FIELD, validDataTypes } from '@/constants/app.constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DynamicField from './DynamicField';
import FieldController from './FieldController';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import FormUpload from '@/assets/FormUpload';
import { DataTypes, layoutValues } from '@/types/data';
import { useTranslation } from 'react-i18next';
import ErrorAlert from '@/components/shared/ErrorAlert';


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
                dataTypeName: z.string().min(1, { message: 'Field type is required' }),
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
                    fieldType: z.string().optional(),
                }).optional(),
                // compute: z.array(
                //     z.object({
                //         fromField: z.string(),
                //         toField: z.string(),
                //         toCustomValue: z.object({}).optional(),
                //         condition: z.string(),
                //         value: z.object({}).optional(),
                //         elseValue: z.object({}).optional(),
                //     })
                // ).optional(),
            }).superRefine((data, ctx) => {
                if (data.dataTypeName && !validDataTypes.includes(data.dataTypeName)) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['dataTypeName'],
                        message: "This field type is not yet implemented. Please choose another field type.",
                    });
                }

                if (data.negativeOnly) {
                    if (data.min !== undefined && data.min >= 0) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['min'],
                            message: "Min value must be negative when negativeOnly is true.",
                        });
                    }
                    if (data.max !== undefined && data.max >= 0) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['max'],
                            message: "Max value must be negative when negativeOnly is true.",
                        });
                    }
                    if (data.min !== undefined && data.max !== undefined && data.min > data.max) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['min'],
                            message: "Min value must be less than Max value when negativeOnly is true.",
                        });
                    }
                    if (data.defaultValue && parseFloat(data.defaultValue) >= 0) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['defaultValue'],
                            message: "Default value must be negative when negativeOnly is true.",
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
                // Validate defaultChoice for ListBox and File Upload
                if ([SELECT_FIELD, FILE_FIELD].includes(data.dataTypeName)) {
                    if (!data.defaultChoice || data.defaultChoice.length === 0) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['defaultChoice'],
                            message: "Default Choice is required",
                        });
                    }
                }
            })
        })
    ).min(1, 'At least one field is required.'),
});

export type FormType = z.infer<typeof FormSchema>;
/**
 * Master Form Create Component
 * 
 * Manages dynamic form create functionality
 * Key Features:
 * - Form template create
 * - Validation through Zod schema
 */
interface CreateFormProps {
    moduleName: string
    dataType: DataTypes[]
    handleCreateForm: (data: FormType) => void
    isSuccess: boolean
    errorMessage: any
}

const CreateFormComp: React.FC<CreateFormProps> = ({ moduleName, dataType, handleCreateForm, isSuccess, errorMessage }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            moduleName: moduleName,
            formName: "",
            formDescription: "",
            formLayout: "GRID_1",
            formPurpose: "MASTER",
            fields: [{}],
        },
    });
    const { t } = useTranslation();
    const [focusedField, setFocusedField] = useState<number | null>(0);
    const [isFormCreated, setIsFormCreated] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(LAYOUT.GRID_1);
    const [isFormControllerOpen, setIsFormControllerOpen] = useState(false)

    const handleLayoutClick = (value: string) => {
        setSelectedValue(value);
        form.setValue("formLayout", value);
    };

    const onSubmit = async (data: FormType) => {
        try {
            handleCreateForm(data);
            setIsFormCreated(true);
        } catch (error: any) {
            console.error("Error creating form:", error);
        }
    };

    const errors = form.formState.errors;
    console.log("errors", errors);
    const handleFieldFocus = (index: number) => {
        setFocusedField(index);
        setIsFormControllerOpen(true)
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

    const handleDataTypeChange = useCallback((fieldIndex: number) => {
        const fields = form.getValues('fields');
        const fieldData = fields[fieldIndex];
        const fieldsToSetFalse = ['readOnly', 'required', 'uniqueValue', 'positiveOnly', 'multiple', 'negativeOnly', 'alphabetic', 'alphanumeric'];
        const keysToRemove = ['asynchronousField', 'decimalLimit', 'min', 'max', 'pattern', 'defaultChoice', 'defaultValue', 'placeholder'];

        const updatedField = {
            ...fieldData,
            field: {
                ...Object.fromEntries(
                    Object.entries(fieldData.field).filter(([key]) => !keysToRemove.includes(key))
                ),
                ...fieldsToSetFalse.reduce((acc, key) => {
                    acc[key] = false;
                    return acc;
                }, {} as Record<string, boolean>),
                dataTypeName: fieldData.field?.dataTypeName || ''
            },
        };
        form.resetField(`fields.${fieldIndex}`, {
            defaultValue: updatedField,
        });
        setFocusedField(null);
        setFocusedField(fieldIndex);
    }, [form]);

    return (
        <>
            <Dialog open={isFormCreated} onOpenChange={setIsFormCreated}>
                <Form {...form}>
                    <form className="space-x-4 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex gap-4">
                            <section className="flex-[4] space-y-2">
                                {errorMessage?.validationMessage &&
                                    Object.entries(errorMessage.validationMessage).map(([field, message]) => (
                                        <ErrorAlert key={field} message={typeof message === 'string' ? message : 'An unknown error occurred.'} />
                                    ))}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            <Text className="font-semibold">{moduleName}</Text>
                                        </CardTitle>
                                        <div className="flex items-center justify-between">
                                            <Text className="font-semibold">{t('master.form.create.title')}</Text>
                                            {/* <DialogTrigger asChild> */}
                                            <Button type='submit'>{t('common.generate')}</Button>
                                            {/* </DialogTrigger> */}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="moduleName"
                                            render={({ field }) => (
                                                <FormItem className="hidden">
                                                    <FormLabel>{t('master.form.create.moduleName.label')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t('master.form.create.formName.placeholder')} {...field} value={moduleName} />
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
                                                        <FormLabel>{t('master.form.create.formName.label')}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={t('master.form.create.formName.placeholder')} autoFocus {...field} />
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
                                                        <FormLabel>{t('master.form.create.formDescription.label')}</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder={t('master.form.create.formDescription.placeholder')} {...field} />
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
                                                        <FormLabel className="flex-shrink-0">{t('master.form.create.formLayout.label')}</FormLabel>
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
                                <aside className={`${isFormControllerOpen ? 'flex-[2]' : ''} `}>
                                    <FieldController
                                        key={`field-controller-${focusedField}`}
                                        control={form.control}
                                        fieldIndex={focusedField}
                                        handleFieldUpdate={handleFieldUpdate}
                                        handleAsyncFieldUpdate={handleAsyncFieldUpdate}
                                        dataType={dataType}
                                        onDataTypeChange={handleDataTypeChange}
                                        isOpen={isFormControllerOpen}
                                        onClose={() => setIsFormControllerOpen(false)}
                                    />
                                </aside>
                            )}

                        </div>
                    </form>
                </Form>
                {isSuccess &&
                    <DialogContent className="sm:max-w-100 h-auto">
                        <FormUpload />
                        <DialogTitle className='w-full text-center text-xl'>Form Generated Successfully!</DialogTitle>
                    </DialogContent>
                }
            </Dialog>
        </>
    );
};

export default CreateFormComp;

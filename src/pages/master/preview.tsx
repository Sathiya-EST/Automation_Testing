import { useMemo, useState, Suspense, lazy, useEffect, useCallback, useRef } from 'react';
import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { SelectOptions } from '@/types/data';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetDataTypesQuery, useGetFormPreviewQuery,  useUpdateFormMutation } from '@/store/services/master/form';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Text from '@/components/shared/Text';
import { Globe } from 'lucide-react';
import FieldController from './components/FieldController';
import DynamicField from './components/DynamicField';
import { zodResolver } from '@hookform/resolvers/zod';
import { BeforeAfterToggle } from '@/components/shared/PositionToggle';
import { z } from 'zod';
import { FILE_FIELD, POSITION, SELECT_FIELD, validDataTypes } from '@/constants/app.constants';
import { Separator } from '@/components/ui/separator';
import SelectDropdown from '@/components/shared/DropDown';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import Flex from '@/components/shared/Flex';

// Lazy load the FieldGenerator component
const FieldGenerator = lazy(() => import('@/components/shared/FieldGenerator'));

export const FormEditSchema = z.object({
    position: z.enum([POSITION.BEFORE, POSITION.AFTER]),
    fieldName: z.string(),
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
                defaultChoice: z.array(z.string().min(1)).optional().refine((val) => val?.every(item => item.trim() !== ''), {
                    message: "defaultChoice should not contain empty or whitespace-only strings",
                }).optional(),
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

export type FormEditType = z.infer<typeof FormEditSchema>;
/**
 * MasterFormPreview Component
 * 
 * Manages dynamic form preview and editing functionality
 * Key Features:
 * - Form template rendering
 * - Dynamic field addition/modification
 * - Validation through Zod schema
 */
const MasterFormPreview = () => {
    const location = useLocation();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { formName, selectedModule } = location.state || {};
    const { data: formTemplateData, refetch: refetchFormTemplate } = useGetFormPreviewQuery(formName);
    const { data: dataTypes = [] } = useGetDataTypesQuery();
    const [updateForm, { isLoading }] = useUpdateFormMutation();

    // Using React Hook Form's useForm hook
    const form = useForm<FormEditType>({
        resolver: zodResolver(FormEditSchema),
        defaultValues: {
            position: POSITION.AFTER,
            fieldName: '',
            fields: [{}],
        }
    });
    const [asyncError] = useState<string | null>(null);
    const [isUpdate, setIsUpdate] = useState(false)
    const [isFormControllerOpen, setIsFormControllerOpen] = useState(false)
    const [focusedField, setFocusedField] = useState<number | null>(null);
    const [formFieldNameOptions, setFormFieldNameOptions] = useState<SelectOptions[]>([])
    // Redirect if no module selected
    useMemo(() => {
        if (!formName) {
            navigate(UI_ROUTES.MASTER);
        }
    }, [formName, navigate]);

    // Breadcrumbs
    useBreadcrumb(
        useMemo(
            () => [
                { type: 'link', title: selectedModule, path: UI_ROUTES.MASTER, isActive: false },
                { type: 'page', title: formTemplateData?.displayName ?? "", isActive: true },
            ],
            [formTemplateData]
        )
    );


    const fieldControllerRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (
                fieldControllerRef.current &&
                !fieldControllerRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement)?.classList.contains("fieldController")
            ) {
                setIsFormControllerOpen(false);
            }
        },
        []
    );

    useEffect(() => {
        if (isFormControllerOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFormControllerOpen, handleClickOutside]);

    useEffect(() => {
        if (formTemplateData?.fields) {
            const options = formTemplateData.fields.map((field: any) => ({
                value: field.name,
                label: field.label,
            }));
            setFormFieldNameOptions(options);
        }
    }, [formTemplateData]);

    const handleFieldFocus = (index: number) => {
        setFocusedField(index);
        setIsFormControllerOpen(true)
    };

    const handleFieldDelete = (deletedIndex: number) => {
        const currentFields = form.getValues("fields");
        const updatedFields = currentFields.filter((_: any, index: number) => index !== deletedIndex);
        form.setValue("fields", updatedFields);
        if (focusedField === deletedIndex) {
            setFocusedField(null);
        }
        else if (focusedField !== null && focusedField > deletedIndex) {
            setFocusedField(focusedField - 1);
        }
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
    const errors = form.formState.errors;
    console.log("errors", errors);

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

    const onSubmit = async (data: any) => {
        try {
            await updateForm({ formName, data }).unwrap();
            toast({
                title: "Form Updated Successfully",
                variant: "success",
            });
            setIsFormControllerOpen(false)
            setIsUpdate(false)
            form.reset();
            await refetchFormTemplate();
        } catch (error: any) {
            console.error("Error updating the form:", error);
            const validationMessage = error?.data?.validationMessage;
            const errorMessage = validationMessage
                ? Object.values(validationMessage).join(", ")
                : error?.data?.message || "An unexpected error occurred.";

            toast({
                title: "Error updating the form",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };


    const handlePublish = () => {
        navigate(UI_ROUTES.MASTER_FORM_PUBLISH, {
            state: { moduleName: selectedModule, formName: formName },
        })
    }

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

    if (isLoading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Flex dir='column' className='lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-1 mt-1'>
                        <div className={`flex-1 lg:flex-[4] space-y-2 transform transition-transform duration-500 ease-in-out translate-x-0`}>

                            {isUpdate &&
                                <Card>
                                    <CardHeader className='max-h-5'>
                                        <CardTitle className='font-bold text-xl '>{t("master.form.update.title")}</CardTitle></CardHeader>
                                    <CardContent className='mt-5'>
                                        {/* <Separator className='my-4' /> */}
                                        <div className="flex flex-col sm:flex-row sm:space-x-6 sm:space-y-0">
                                            {/* Position */}
                                            <FormItem className="flex-1">
                                                <div className="flex flex-col space-y-2">
                                                    <FormLabel>{t("master.form.update.position.label")}</FormLabel>
                                                    <FormControl>
                                                        <Controller
                                                            name="position"
                                                            control={form.control}
                                                            render={({ field }) => (
                                                                <div className='mx-auto'>
                                                                    <BeforeAfterToggle
                                                                        value={field.value || "AFTER"}
                                                                        onChange={(value: "BEFORE" | "AFTER") => {
                                                                            field.onChange(value);
                                                                            if (value !== "BEFORE") {
                                                                                form.setValue("fieldName", "");
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>

                                            {/* Field Name */}
                                            <FormItem className="flex-1">
                                                <div className="flex flex-col space-y-2">
                                                    <FormLabel>{t("master.form.update.fieldName.label")}</FormLabel>
                                                    <FormControl>
                                                        <Controller
                                                            name="fieldName"
                                                            control={form.control}
                                                            render={({ field }) => (
                                                                <SelectDropdown
                                                                    options={formFieldNameOptions}
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        </div>

                                        <Separator className="my-4" />

                                        <DynamicField
                                            control={form.control}
                                            layout={formTemplateData?.formLayout || "GRID_1"}
                                            onFieldFocus={handleFieldFocus}
                                            onFieldDelete={handleFieldDelete}
                                            selectedFieldIndex={focusedField}
                                            errors={form.formState.errors}
                                        />
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            type='submit'
                                        >
                                            {t("master.form.update.updateBtn")}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            }
                            <Card >
                                <CardHeader>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <CardTitle>{formTemplateData?.displayName}</CardTitle>
                                            <Text>{formTemplateData?.formDescription}</Text>
                                        </div>
                                        <div className='space-x-2 flex-shrink-0'>
                                            {!isUpdate &&
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    className="border-[1px] border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                                    onClick={() => {
                                                        setIsUpdate(true)
                                                        setIsFormControllerOpen(true)
                                                    }}
                                                >
                                                    {t('master.form.update.updateBtn')}
                                                </Button>
                                            }
                                            <Button
                                                type='button'
                                                className='bg-green-500 hover:bg-green-600 transition-colors'
                                                onClick={handlePublish}
                                            >
                                                <Globe aria-hidden="true" /> {t('master.form.update.publishBtn')}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {formTemplateData && formTemplateData.fields && (
                                        <Suspense fallback={<div>{t('master.form.update.loadingForm')}</div>}>
                                            <FieldGenerator
                                                fields={formTemplateData.fields}
                                                control={form.control}
                                                layout={formTemplateData?.formLayout || 'GRID_1'}
                                                submit={false}
                                            />
                                        </Suspense>
                                    )}
                                    {asyncError && <div className="error-message">{asyncError}</div>}

                                </CardContent>
                            </Card>


                        </div>

                        {isUpdate && focusedField !== null && (
                            <aside className={`${isFormControllerOpen ? 'flex-[2]' : ''} `}>
                                <FieldController
                                    key={`field-controller-${focusedField}`}
                                    control={form.control}
                                    fieldIndex={focusedField}
                                    dataType={dataTypes}
                                    handleFieldUpdate={handleFieldUpdate}
                                    handleAsyncFieldUpdate={handleAsyncFieldUpdate}
                                    onDataTypeChange={handleDataTypeChange}
                                    isOpen={isFormControllerOpen}
                                    onClose={() => setIsFormControllerOpen(false)}
                                />
                            </aside>
                        )}
                    </Flex>
                </form>
            </Form >
        </>

    );
};

export default MasterFormPreview;

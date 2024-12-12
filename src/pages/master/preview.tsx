import { useMemo, useState, Suspense, lazy, useEffect } from 'react';
import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { BreadcrumbItemType, layoutValues, SelectOptions } from '@/types/data';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetDataTypesQuery, useGetFormPreviewQuery, useLazyGetFormAsyncDataQuery, useUpdateFormMutation } from '@/store/services/master/form';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Text from '@/components/shared/Text';
import { Globe } from 'lucide-react';
import FieldController from './components/FieldController';
import DynamicField from './components/DynamicField';
import { zodResolver } from '@hookform/resolvers/zod';
import { BeforeAfterToggle } from '@/components/shared/PositionToggle';
import { z } from 'zod';
import { POSITION } from '@/constants/app.constants';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/shared/Spinner';
import { Separator } from '@/components/ui/separator';
import SelectDropdown from '@/components/shared/DropDown';

// Lazy load the FieldGenerator component
const FieldGenerator = lazy(() => import('@/components/shared/FieldGenerator'));

export const FormEditSchema = z.object({
    position: z.enum([POSITION.BEFORE, POSITION.AFTER]),
    // fieldName: z.string().optional(),
    fieldName: z.string()
        .min(3, 'Field name must be at least 3 characters')
        .max(50, 'Field name cannot exceed 50 characters')
        .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Field name must be a valid identifier'),
    fields: z.array(
        z.object({
            name: z.string().min(1, 'Field name is required'),
            field: z.object({
                dataTypeName: z.string().optional(),
                // type: z.string(),
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
                    // fieldType: z.string(),
                }).optional(),
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
    const { formName, selectedModule } = location.state || {};
    const [asyncError, setAsyncError] = useState<string | null>(null);
    const [isUpdate, setIsUpdate] = useState(false)
    const [focusedField, setFocusedField] = useState<number | null>(0);
    const [formFieldNameOptions, setFormFieldNameOptions] = useState<SelectOptions[]>([])
    const { data: formTemplateData, error: formError } = useGetFormPreviewQuery(formName);
    const [triggerGetFormAsyncData] = useLazyGetFormAsyncDataQuery();
    const { data: dataTypes = [], isLoading: isDataTypesLoading } = useGetDataTypesQuery();
    const [updateForm, { isLoading, isError, error }] = useUpdateFormMutation();
    // Using React Hook Form's useForm hook
    const form = useForm<FormEditType>({
        resolver: zodResolver(FormEditSchema),
        defaultValues: {
            position: POSITION.AFTER,
            fieldName: '',
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
    const navigate = useNavigate();


    // Breadcrumbs configuration
    // Memoize expensive computations
    const memoizedBreadcrumbItems: BreadcrumbItemType[] = useMemo(() => [
        { type: 'link', title: selectedModule, path: UI_ROUTES.MASTER, isActive: false },
        { type: 'page', title: formTemplateData?.displayName ?? "", isActive: true },
    ], [selectedModule, formTemplateData?.displayName]);
    useBreadcrumb(memoizedBreadcrumbItems);

    useEffect(() => {
        if (formTemplateData?.fields) {
            const options = formTemplateData.fields.map((field: any) => ({
                value: field.name,
                label: field.label,
            }));
            setFormFieldNameOptions(options);
        }
    }, [formTemplateData]);
    // Handle async options fetch
    const handleFetchAsyncOptions = async (
        pageNo: number,
        pageSize: number,
        formName: string,
        fieldName: string,
        query: string
    ): Promise<{ options: { label: string; value: string }[]; totalPages: number }> => {
        try {
            const result = await triggerGetFormAsyncData({
                pageNo,
                pageSize,
                formName,
                fieldName,
                searchQuery: query,
            }).unwrap();

            if (result && result.transformedData) {
                const options = result.transformedData.map((item: any) => ({
                    label: item.label,
                    value: item.value,
                }));
                const totalPages = Math.ceil(result.totalRecords / pageSize);
                return { options, totalPages };
            }

            return { options: [], totalPages: 0 };
        } catch (error) {
            setAsyncError('Error fetching asynchronous data.');
            console.error(error);
            return { options: [], totalPages: 0 };
        }
    };
    const handleFieldFocus = (index: number) => {
        setFocusedField(index);
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

    // const handleFieldUpdate = (value: string | string[] | number | boolean, fieldName: string) => {
    //     const currentFields = form.getValues("fields");

    //     const updatedFields = currentFields.map((field) => {
    //         if (field.name === fieldName) {
    //             let updatedValue = value;

    //             if (fieldName === 'defaultChoice') {
    //                 const normalizedValue = Array.isArray(value)
    //                     ? value.map((v) => String(v))
    //                     : [String(value)];

    //                 updatedValue = Array.from(new Set(normalizedValue));
    //             }

    //             return {
    //                 ...field,
    //                 field: {
    //                     ...field.field,
    //                     [fieldName]: updatedValue
    //                 }
    //             };
    //         }
    //         return field;
    //     });

    //     form.setValue("fields", updatedFields);
    // };
    const handleFieldUpdate = (value: string | string[] | number | boolean, fieldName: string) => {
        const currentFields = form.getValues("fields");

        const updatedFields = currentFields.map((field) => {
            if (field.name === fieldName) {
                let updatedValue = value;
                if (fieldName === 'text') {
                    form.reset()
                    console.log("Running");
                    return null

                }
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
        // const currentFields = form.getValues("fields");

        // const updatedFields = currentFields.map((field) =>
        //     field.field.asynchronousField && field.field.asynchronousField.hasOwnProperty(fieldName)
        //         ? {
        //             ...field,
        //             field: {
        //                 ...field.field,
        //                 asynchronousField: {
        //                     ...field.field.asynchronousField,
        //                     [fieldName]: value,
        //                 },
        //             },
        //         }
        //         : field
        // );
        // console.log("updatedFields",updatedFields);

        // form.setValue("fields", updatedFields);
    };


    // Handle form submission
    const onSubmit = (data: any) => {
        console.log('Form Data Submitted:', data);
        updateForm({ formName, data }).unwrap();
    };

    // Error handling and loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (formError) {
        return <div>Error fetching form data: {formError?.message}</div>;
    }

    const handlePublish=()=>{
        navigate(UI_ROUTES.MASTER_FORM_PUBLISH)
    }
    return (
        <div>
            <Suspense fallback={<div>Loading Field Generator...</div>}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-4'>
                            <div className='flex-1 lg:flex-[4] space-y-2'>
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
                                                        onClick={() => setIsUpdate(true)}
                                                    >
                                                        Update
                                                    </Button>
                                                }
                                                <Button
                                                    type='button'
                                                    className='bg-green-500 hover:bg-green-600 transition-colors'
                                                    onClick={handlePublish}
                                                >
                                                    <Globe aria-hidden="true" /> Publish
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {formTemplateData && formTemplateData.fields && (
                                            <FieldGenerator
                                                fields={formTemplateData.fields}
                                                handleFetchAsyncOptions={handleFetchAsyncOptions}
                                                control={form.control}
                                                layout={formTemplateData?.formLayout || 'GRID_1'}
                                            />
                                        )}
                                        {asyncError && <div className="error-message">{asyncError}</div>}

                                    </CardContent>
                                </Card>
                                {isUpdate &&

                                    <Card>
                                        <CardHeader className='max-h-5'>
                                            <CardTitle className='font-bold text-xl '>Update Form</CardTitle></CardHeader>
                                        <CardContent className='mt-5'>
                                            {/* <Separator className='my-4' /> */}
                                            <div className="flex flex-col sm:flex-row sm:space-x-6 sm:space-y-0">
                                                {/* Position */}
                                                <FormItem className="flex-1">
                                                    <div className="flex flex-col space-y-2">
                                                        <FormLabel>Position</FormLabel>
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
                                                        <FormLabel>Field Name</FormLabel>
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
                                            // variant='outline'
                                            // className="border-[1px] border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                            // onClick={() => setIsUpdate(true)}
                                            >
                                                Update
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                }
                            </div>

                            {isUpdate && focusedField !== null && (
                                <div className='flex-1 lg:flex-[2]'>

                                    <FieldController
                                        key={`field-controller-${focusedField}`}
                                        control={form.control}
                                        fieldIndex={focusedField}
                                        dataType={dataTypes}
                                        handleFieldUpdate={handleFieldUpdate}
                                        handleAsyncFieldUpdate={handleAsyncFieldUpdate}
                                        setValue={form.setValue}
                                    />
                                </div>
                            )}

                        </div>
                    </form>
                </Form>
            </Suspense>
        </div>

    );
};

export default MasterFormPreview;

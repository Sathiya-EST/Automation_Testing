import Grid1Layout from '@/assets/Grid_1';
import Grid2Layout from '@/assets/Grid_2';
import Grid3Layout from '@/assets/Grid_3';
import Text from '@/components/shared/Text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import FieldList from '../field.json';
import FieldGenerator from '@/components/shared/FieldGenerator';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import FormUpload from '@/assets/FormUpload';

const layoutValues = Object.values(LAYOUT) as [string, ...string[]];

const FormSchema = z.object({
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
                dataTypeName: z.string(),
                type: z.string(),
                min: z.number().int().min(0).optional(),
                max: z.number().int().min(0).optional(),
                readOnly: z.boolean(),
                pattern: z.string().optional(),
                formula: z.string().optional(),
                required: z.boolean(),
                placeholder: z.string().optional(),
                defaultValue: z.string().optional(),
                alphabetic: z.boolean().optional(),
                alphanumeric: z.boolean().optional(),
                defaultChoice: z.array(z.string()).optional(),
                uniqueValue: z.boolean().optional(),
                decimalLimit: z.number().int().min(0).optional(),
                positiveOnly: z.boolean().optional(),
                negativeOnly: z.boolean().optional(),
                multiple: z.boolean().optional(),
                asynchronousField: z.object({
                    formName: z.string(),
                    fieldName: z.string(),
                    fieldType: z.string(),
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
            }),
        })
    ).min(1, 'At least one field is required.'),
});


const CreateFormComp = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            formName: "",
            formDescription: "",
            formLayout: "GRID_1",
            formPurpose: "MASTER",
            fields: [
                {
                    name: "",
                    field: {
                        dataTypeName: "",
                        type: "",
                        min: 0,
                        max: 0,
                        readOnly: false,
                        pattern: "",
                        formula: "",
                        required: false,
                        placeholder: "",
                        defaultValue: "",
                        alphabetic: false,
                        alphanumeric: false,
                        defaultChoice: [],
                        uniqueValue: false,
                        decimalLimit: 0,
                        positiveOnly: false,
                        negativeOnly: false,
                        multiple: false,
                        asynchronousField: {
                            formName: "",
                            fieldName: "",
                            fieldType: "",
                        },
                        compute: [],
                    },
                },
            ],
        },
    });
    const [isFormCreated, setIsFormCreated] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(LAYOUT.GRID_1);
    const [focusedField, setFocusedField] = useState<number | null>(null);

    const handleLayoutClick = (value: string) => {
        setSelectedValue(value);
        form.setValue("formLayout", value);
    };

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("data", data);
        setIsFormCreated(true)
    }

    const handleFieldFocus = (index: number) => {
        setFocusedField(index);
    };

    const handleFieldDelete = (deletedIndex: number) => {
        const currentFields = form.getValues("fields");
        const updatedFields = currentFields.filter((_, index) => index !== deletedIndex);
        form.setValue("fields", updatedFields);

        if (focusedField === deletedIndex) {
            setFocusedField(null);
        } else if (focusedField !== null && focusedField > deletedIndex) {
            setFocusedField(focusedField - 1);
        }
    };


    return (
        <>
            <Dialog open={isFormCreated} onOpenChange={setIsFormCreated}>

                <Form {...form}>
                    <form className="space-x-4 w-full" onSubmit={form.handleSubmit(onSubmit)}>

                        {/* <FieldGenerator fields={FieldList.fields} /> */}
                        <div className="flex gap-4">
                            <section className="flex-[4]">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <Text className="font-semibold">Create New Table</Text>
                                            <DialogTrigger asChild>
                                                <Button>Generate</Button>
                                            </DialogTrigger>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-5">

                                            <FormField
                                                control={form.control}
                                                name="formName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Form Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter Form Name" {...field} />
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
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>
                            {focusedField !== null && (
                                <>
                                    {focusedField >= 0 && (
                                        <aside className="flex-[2]">
                                            <FieldController
                                                key={`field-controller-${focusedField}`}
                                                control={form.control}
                                                fieldIndex={focusedField}
                                                handleSubmit={form.handleSubmit(onSubmit)}
                                            />

                                        </aside>
                                    )}
                                </>
                            )}
                        </div>
                    </form>
                </Form>
                <DialogContent className="sm:max-w-100 h-auto">
                    <FormUpload />
                    <Text className='w-full text-center text-xl'>Form Generated Successfully!</Text>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateFormComp;

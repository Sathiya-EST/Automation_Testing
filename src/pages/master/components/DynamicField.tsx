import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
    fields: z.array(
        z.object({
            fieldName: z.string().min(1, 'Field name is required'),
        })
    ),
});

type FormData = z.infer<typeof formSchema>;

const DynamicField: React.FC = () => {
    const { control, handleSubmit, register } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const { fields, append, remove } = useFieldArray<FormData>({
        control,
        name: 'fields',
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Responsive Form with Dynamic Fields</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-4">
                            <input
                                type="text"
                                placeholder={`Field ${index + 1}`}
                                className="input input-bordered w-full"
                                {...register(`fields.${index}.fieldName`)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => remove(index)}
                                className="p-2"
                            >
                                X
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ fieldName: '' })}
                        className="flex items-center space-x-2"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add new field</span>
                    </Button>
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default DynamicField;
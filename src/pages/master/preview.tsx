import FieldGenerator from '@/components/shared/FieldGenerator';
import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { BreadcrumbItemType } from '@/types/data';
import { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FieldList from './field.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MasterFormPreview = () => {
    const methods = useForm();
    const { handleSubmit } = methods;

    const breadcrumbItems: BreadcrumbItemType[] = useMemo(
        () => [
            { type: 'link', title: 'Module Name', path: UI_ROUTES.MASTER, isActive: false },
            { type: 'link', title: 'Form Name', path: UI_ROUTES.MASTER, isActive: false },
            { type: 'page', title: 'Preview', isActive: true },
        ],
        []
    );

    useBreadcrumb(breadcrumbItems);

    const onSubmit = (data: any) => {
        console.log('Form Submitted:', data);
    };

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="form-container">
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Name</CardTitle>
                        </CardHeader>
                        <CardContent>

                            <FieldGenerator fields={FieldList.fields} />
                            <Button type="submit" className='mt-2'>Submit</Button>
                        </CardContent>
                    </Card>
                </form>
            </FormProvider>
        </>
    );
};

export default MasterFormPreview;

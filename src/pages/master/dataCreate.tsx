import Flex from '@/components/shared/Flex';
import Text from '@/components/shared/Text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { UI_ROUTES } from '@/constants/routes';
import { useToast } from '@/hooks/use-toast';
import { useAddRecordMutation, useGetFormPreviewQuery } from '@/store/services/master/form';
import mapErrors from '@/utils/mapFormErrors';
import { Delete } from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import AsyncFieldAccordion from './components/ParentListAccordian';
import useBreadcrumb from '@/hooks/useBreadCrumb';

const FieldGenerator = lazy(() => import('@/components/shared/FieldGenerator'));


const DataCreate = () => {
  const location = useLocation();
  const [asyncFieldFormNames, setAsyncFieldFormNames] = useState<string[]>([]);
  const { formName, selectedModule } = location.state || {};
  const { data: formTemplateData } = useGetFormPreviewQuery(formName);
  const [addRecord] = useAddRecordMutation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {}
  })
  const { setError } = form;

  // Redirect if no module selected
  useMemo(() => {
    if (!formName && !selectedModule) {
      navigate(UI_ROUTES.MASTER_DATA);
    }
  }, [formName, navigate]);

  // Breadcrumbs
  useBreadcrumb(
    useMemo(
      () => [
        { type: 'link', title: formTemplateData?.moduleName ?? "", path: UI_ROUTES.MASTER_DATA, isActive: false },
        { type: 'page', title: formTemplateData?.displayName ?? "", isActive: true },
      ],
      [formTemplateData]
    )
  );

  useEffect(() => {
    if (formTemplateData) {
      const asyncFields = formTemplateData.fields.filter((field) =>
        field.field.dataTypeName === "Asynchronous List"
      );

      const formNames = asyncFields
        .map((asyncField) => asyncField.field.asynchronousField?.formName)
        .filter((formName): formName is string => formName !== undefined);

      setAsyncFieldFormNames(formNames);
    }
  }, [formTemplateData]);

  const onSubmit = async (data: any) => {
    try {
      const { default_id_pk, ...submitData } = data;
      await addRecord({
        formName,
        data: submitData,
      }).unwrap();
      toast({
        title: "Record Added Successfully",
        variant: "success",
      });
      navigate(UI_ROUTES.MASTER_DATA, {
        state: { formName, addSuccess: true }
      });

    } catch (error: any) {
      console.error('Add record failed:', error);
      if (error?.data?.validationMessage) {
        mapErrors(error.data.validationMessage, setError);
      }
    }
  };
  const handleClear = () => {
    form.reset();
  }
  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <Flex className='items-start'>
                <Flex dir='column'>
                  <Text variant='title'>{formTemplateData?.displayName}</Text>
                  <Text >{formTemplateData?.formDescription}</Text>
                </Flex>
                <Button type="button" className="flex items-center gap-2 bg-orange-100 border border-orange-600 text-orange-600 hover:bg-orange-200 focus:ring-2 focus:ring-orange-600" onClick={handleClear}>
                  <Delete className="h-6 w-6" />
                  Clear
                </Button>
              </Flex>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading Form...</div>}>
                {formTemplateData && formTemplateData.fields && (
                  <FieldGenerator
                    fields={formTemplateData.fields}
                    control={form.control}
                    layout={formTemplateData?.formLayout || 'GRID_2'}
                    formAction={'add'}
                  />
                )}
              </Suspense>
            </CardContent>
            <CardFooter className='flex space-x-4 xs:flex-col xs:space-y-4 xs:space-x-0'>
              <Button
                type="button"
                variant={'outline'}
                className="w-full md:w-[150px] text-primary border-primary hover:text-primary hover:border-primary"
                onClick={() => navigate(UI_ROUTES.MASTER_DATA, {
                  state: { formName }
                })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full md:w-[150px] bg-green-500 hover:bg-green-600"
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </form>
        {asyncFieldFormNames && <Card>
          <AsyncFieldAccordion
            asyncFieldFormNames={asyncFieldFormNames}
          />
        </Card>}


      </Form>
    </div>
  )
}

export default DataCreate
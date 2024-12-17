import Text from '@/components/shared/Text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { UI_ROUTES } from '@/constants/routes';
import { useToast } from '@/hooks/use-toast';
import { useAddRecordMutation, useGetFormPreviewQuery, useLazyGetFormAsyncDataQuery } from '@/store/services/master/form';
import mapErrors from '@/utils/mapFormErrors';
import { lazy, Suspense } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const FieldGenerator = lazy(() => import('@/components/shared/FieldGenerator'));


const DataCreate = () => {
  const location = useLocation();
  const { formName, selectedModule } = location.state || {};
  const { data: formTemplateData, error: formError } = useGetFormPreviewQuery(formName);
  const [triggerGetFormAsyncData] = useLazyGetFormAsyncDataQuery();
  const [addRecord] = useAddRecordMutation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm()
  const { setError } = form;
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
      // setAsyncError('Error fetching asynchronous data.');
      console.error(error);
      return { options: [], totalPages: 0 };
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle>{formTemplateData?.displayName}</CardTitle>
                  <Text>{formTemplateData?.formDescription}</Text>
                </div>

              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading Form...</div>}>
                {formTemplateData && formTemplateData.fields && (
                  <FieldGenerator
                    fields={formTemplateData.fields}
                    handleFetchAsyncOptions={handleFetchAsyncOptions}
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
      </Form>
    </div>
  )
}

export default DataCreate
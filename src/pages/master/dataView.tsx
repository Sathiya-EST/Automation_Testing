import Text from "@/components/shared/Text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { UI_ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { useDeleteRecordMutation, useGetFormPreviewQuery, useGetFormRecordQuery, useLazyGetFormAsyncDataQuery, useUpdateRecordMutation } from "@/store/services/master/form";
import { SquarePen, Trash2 } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import mapErrors from '../../utils/mapFormErrors';

const FieldGenerator = lazy(() => import('@/components/shared/FieldGenerator'));

const MasterDataCrud = () => {
    const location = useLocation();
    const { formName, selectedModule, formId } = location.state || {};
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const { data: formTemplateData, error: formError } = useGetFormPreviewQuery(formName);
    const { data: formRecordData, error: formRecordError } = useGetFormRecordQuery(
        { formName, formId },
        { skip: !formName || !formId }
    );
    const [triggerGetFormAsyncData] = useLazyGetFormAsyncDataQuery();
    const [updateRecord] = useUpdateRecordMutation();
    const [deleteRecord] = useDeleteRecordMutation();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleDelete = async () => {
        // Confirm deletion with the user
        const isConfirmed = confirmDeletion(formName);
        if (!isConfirmed) return;

        try {
            await deleteRecord({ formName, formIdpk: formId }).unwrap();

            handleSuccessfulDeletion();
            toast({
                title: "Record Deleted Successfully",
                variant: "success",
            });
        } catch (error: any) {
            console.error('Delete failed:', error);
            const errorMessage = error?.data?.validationMessage?.formName || 'Failed to delete record. Please try again.';

            toast({
                title: "Unable to Delete Record",
                variant: "destructive",
                description: errorMessage
            });
        }
    };

    /**
     * Display a confirmation dialog to the user.
     * @param {string} formName - The name of the form to include in the confirmation message.
     * @returns {boolean} - Whether the user confirmed the deletion.
     */
    const confirmDeletion = (_formName: string): boolean => {
        return window.confirm(`Are you sure you want to delete this record for ${formName}?`);
    };

    /**
     * Handle navigation after a successful deletion.
     */
    const handleSuccessfulDeletion = () => {
        navigate(UI_ROUTES.MASTER_DATA);
    };

    const form = useForm({
        defaultValues: formRecordData
    })
    const { setError } = form;
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
    useEffect(() => {
        form.reset(formRecordData)
    }, [formRecordData])
    const onSubmit = async (data: any) => {
        try {
            const { default_id_pk, ...submitData } = data;
            const response = await updateRecord({
                formName,
                formIdpk: formId,
                data: submitData,
            }).unwrap();

            navigate(UI_ROUTES.MASTER_DATA_CRUD, {
                state: { formName, formId, updateSuccess: true }
            });

        } catch (error: any) {
            console.error('Update failed:', error);
            if (error?.data?.validationMessage) {
                mapErrors(error.data.validationMessage, setError);
            }
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
                                        formAction={isUpdate ? 'update' : 'view'}
                                    />
                                )}
                            </Suspense>
                        </CardContent>
                        <CardFooter>
                            <div className="flex flex-row  space-x-4 ">
                                {!isUpdate && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full md:w-[150px] border-destructive text-destructive hover:border-destructive hover:text-destructive"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 />
                                            Delete
                                        </Button>
                                        <Button
                                            type="button"
                                            className="w-full md:w-[150px]"
                                            onClick={() => setIsUpdate(true)}
                                        >
                                            <SquarePen />
                                            Edit
                                        </Button>
                                    </>
                                )}

                                {isUpdate && (
                                    <>
                                        <Button
                                            type="button"
                                            variant={'outline'}
                                            className="w-full md:w-[150px] text-primary border-primary hover:text-primary hover:border-primary"
                                            onClick={() => { setIsUpdate(false); form.reset(formRecordData) }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="w-full md:w-[150px] bg-green-500 hover:bg-green-600"
                                        >
                                            Update
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div >
    )
}

export default MasterDataCrud
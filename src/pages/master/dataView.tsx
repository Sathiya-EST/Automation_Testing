import Text from "@/components/shared/Text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { UI_ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { useDeleteRecordMutation, useGetFormPreviewQuery, useGetFormRecordQuery, useUpdateRecordMutation } from "@/store/services/master/form";
import { SquarePen, Trash2 } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import mapErrors from '../../utils/mapFormErrors';
import useBreadcrumb from "@/hooks/useBreadCrumb";
import DeleteConfirmationPopup from "@/components/Modals/DeleteModal";
import AsyncFieldAccordion from "./components/ParentListAccordian";

const FieldGenerator = lazy(() => import('@/components/shared/FieldGenerator'));

const MasterDataCrud = () => {
    const location = useLocation();
    const { formName, selectedModule, formId } = location.state || {};
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const { data: formTemplateData } = useGetFormPreviewQuery(formName);
    const { data: formRecordData } = useGetFormRecordQuery(
        { formName, formId },
        { skip: !formName || !formId }
    );
    const [asyncFieldFormNames, setAsyncFieldFormNames] = useState<string[]>([]);

    const [updateRecord] = useUpdateRecordMutation();
    const [deleteRecord] = useDeleteRecordMutation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
    // Redirect if no module selected
    useMemo(() => {
        if (!formName && !selectedModule) {
            navigate(UI_ROUTES.MASTER);
        }
    }, [formName, navigate]);


    useBreadcrumb(
        useMemo(
            () => [
                { type: 'link', title: formTemplateData?.moduleName ?? "", path: UI_ROUTES.MASTER_DATA, isActive: false },
                { type: 'page', title: formTemplateData?.displayName ?? "hi", isActive: true },
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
    const handleDelete = async () => {
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
            if (!response) {
                console.log("Failed to update record");

            }
        } catch (error: any) {
            console.error('Update failed:', error);
            if (error?.data?.validationMessage) {
                mapErrors(error.data.validationMessage, setError);
            }
        }
    };

    return (
        <div className='space-y-4'>
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
                                            onClick={() => setDeletePopupOpen(true)}
                                        >
                                            <Trash2 />
                                            Delete
                                        </Button>
                                        <DeleteConfirmationPopup
                                            isOpen={isDeletePopupOpen}
                                            onClose={() => setDeletePopupOpen(false)}
                                            onDelete={handleDelete}
                                            title="Delete Item"
                                            description="Are you sure you want to delete this item? This action cannot be undone."
                                        />
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
                {asyncFieldFormNames && <Card>
                    <AsyncFieldAccordion
                        asyncFieldFormNames={asyncFieldFormNames}
                    />
                </Card>}
            </Form>
        </div >
    )
}

export default MasterDataCrud
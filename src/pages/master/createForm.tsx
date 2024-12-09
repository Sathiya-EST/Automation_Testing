import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { BreadcrumbItemType } from '@/types/data';
import { useMemo } from 'react'
import CreateFormComp, { FormType } from './components/CreateFormComp';
import { useLocation } from 'react-router-dom';
import { useCreateFormMutation, useGetDataTypesQuery } from '@/store/services/master/form';


const CreateForm = () => {
    const location = useLocation();
    const { selectedModule } = location.state || {};
    const updatedRoutes: BreadcrumbItemType[] = useMemo(() => [
        { type: 'link', title: 'Master', path: UI_ROUTES.MASTER, isActive: false },
        { type: 'page', title: 'Form', isActive: true },
    ], []);

    useBreadcrumb(updatedRoutes);
    const { data: dataTypes = [], isLoading: isDataTypesLoading } = useGetDataTypesQuery();
    const [createForm, { isLoading, isSuccess, isError, error }] = useCreateFormMutation();

    const handleCreateForm = async (data: FormType) => {
        try {
            const response = await createForm({ data }).unwrap();
            if (response) {
                console.log('Form created successfully:', response);
            }
        } catch (err) {
            console.error('Error creating form:', err);
        }
    }
    return (
        <>
            <CreateFormComp
                moduleName={selectedModule}
                dataType={dataTypes}
                handleCreateForm={handleCreateForm}
            />
            {isLoading && <p>Creating form...</p>}

            {/* Success/Error Feedback */}
            {isSuccess && <p>Form created successfully!</p>}
            {isError && <p>Error: {'Something went wrong'}</p>}
        </>
    )
}

export default CreateForm
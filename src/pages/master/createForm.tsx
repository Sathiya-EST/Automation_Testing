import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateFormMutation, useGetDataTypesQuery } from '@/store/services/master/form';
import CreateFormComp, { FormType } from './components/CreateFormComp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Spinner from '@/components/shared/Spinner';

interface LocationState {
    selectedModule: string;
}

const CreateForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedModule } = (location.state as LocationState) || {};

    // Redirect if no module selected
    useMemo(() => {
        if (!selectedModule) {
            navigate(UI_ROUTES.MASTER);
        }
    }, [selectedModule, navigate]);

    // Breadcrumbs configuration
    useBreadcrumb(
        useMemo(
            () => [
                {
                    type: "link",
                    title: selectedModule || 'Master',
                    path: UI_ROUTES.MASTER,
                    isActive: false
                },
                {
                    type: "page",
                    title: "Create Form",
                    isActive: true
                },
            ],
            [selectedModule]
        )
    );

    // Data fetching and mutation hooks
    const {
        data: dataTypes = [],
        isLoading: isDataTypesLoading,
        error: dataTypesError
    } = useGetDataTypesQuery();

    const [createForm, {
        isLoading: isFormCreating,
        isSuccess,
        isError,
        error: createFormError
    }] = useCreateFormMutation();

    // Form submission handler
    const handleCreateForm = async (formData: FormType) => {
        try {
            const enrichedData = {
                ...formData,
                moduleId: selectedModule,
                createdAt: new Date().toISOString()
            };

            const response = await createForm({ data: enrichedData }).unwrap();

            if (response) {
                // Redirect to the master page after successful creation
                setTimeout(() => {
                    navigate(UI_ROUTES.MASTER, {
                        state: { selectedModule },
                        replace: true
                    });
                }, 2000);
            }
        } catch (err) {
            console.error('Error creating form:', err);
            console.log(createFormError);

        }
    };

    // Loading state for initial data fetch
    if (isDataTypesLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    // Error state for data types fetch
    if (dataTypesError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Error loading data types. Please try refreshing the page.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            {/* Error Message */}
            {isError && (
                <Alert variant="destructive" className="bg-red-50 border-red-200  mt-2">
                    <AlertDescription>
                        {createFormError && 'Error creating form. Please try again.'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Form Component */}
            <CreateFormComp
                moduleName={selectedModule}
                dataType={dataTypes}
                handleCreateForm={handleCreateForm}
            // isSubmitting={isFormCreating}
            />

            {/* Loading State */}
            {isFormCreating && (
                <Alert>
                    <AlertDescription className="flex items-center gap-2">
                        <Spinner />
                        Creating form...
                    </AlertDescription>
                </Alert>
            )}

            {/* Success Message */}
            {isSuccess && (
                <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                        Form created successfully! Redirecting...
                    </AlertDescription>
                </Alert>
            )}


        </div>
    );
};

export default CreateForm;
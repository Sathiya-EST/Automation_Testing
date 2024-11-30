import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { BreadcrumbItemType } from '@/types/data';
import { useMemo } from 'react'
import CreateFormComp from './components/CreateFormComp';


const CreateForm = () => {


    const updatedRoutes: BreadcrumbItemType[] = useMemo(() => [
        { type: 'link', title: 'Master', path: UI_ROUTES.MASTER, isActive: false },
        { type: 'page', title: 'Form', isActive: true },
    ], []);

    useBreadcrumb(updatedRoutes);

    return (
        <>
            <CreateFormComp />
        </>
    )
}

export default CreateForm
import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { BreadcrumbItemType } from '@/types/data';
import React, { useMemo } from 'react'
import ResponsiveForm from './components/DynamicField';

type Props = {}

const CreateForm = (props: Props) => {


    const updatedRoutes: BreadcrumbItemType[] = useMemo(() => [
        { type: 'link', title: 'Master', path: UI_ROUTES.MASTER, isActive: false },
        { type: 'page', title: 'Form', isActive: true },
    ], []);

    useBreadcrumb(updatedRoutes);

    return (
        <div>
            <ResponsiveForm />
        </div>
    )
}

export default CreateForm
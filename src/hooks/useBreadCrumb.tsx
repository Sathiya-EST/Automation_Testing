import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumbs } from '@/store/slice/appSlice';
import { BreadcrumbItemType } from '@/types/data';
import { RootState } from '@/store';

const useBreadcrumb = (breadcrumbs: BreadcrumbItemType[]) => {

    const dispatch = useDispatch();
    const currentBreadcrumbs = useSelector((state: RootState) => state.app.items);
    useEffect(() => {
        if (JSON.stringify(currentBreadcrumbs) !== JSON.stringify(breadcrumbs)) {
            dispatch(setBreadcrumbs(breadcrumbs));
        }
    }, [dispatch, breadcrumbs, currentBreadcrumbs]);
};
export default useBreadcrumb; 

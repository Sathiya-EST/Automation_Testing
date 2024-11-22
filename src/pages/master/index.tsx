import AppLayout from "@/components/Applayout"
import useBreadcrumb from "@/hooks/useBreadCrumb";
import { RootState } from "@/store";
import { useGetLogQuery } from "@/store/services/master/master";
import { BreadcrumbItemType, User } from "@/types/data";
import { useMemo } from "react";
import { useSelector } from "react-redux";

type Props = {}

const Master = (props: Props) => {
    const breadcrumbs = useSelector((state: RootState) => state.app.items);
    const { data, error, isLoading } = useGetLogQuery({});
    console.log(data);

    const updatedItems: BreadcrumbItemType[] = useMemo(() => [
        { type: 'link', title: 'Home', path: '/', isActive: false },
        { type: 'page', title: 'About', isActive: true },
    ], []);

    const User: User = {
        userName: localStorage.getItem('userName') || '',
        userRole: localStorage.getItem('userRole') || ''
    }

    useBreadcrumb(updatedItems);
    return (
        <>
            <AppLayout
                breadcrumbItems={breadcrumbs}
                User={User} >
                <p>Children</p>
            </AppLayout>
        </>
    )
}

export default Master
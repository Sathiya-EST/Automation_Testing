import useBreadcrumb from "@/hooks/useBreadCrumb";
import { useGetLogQuery } from "@/store/services/master/master";
import { BreadcrumbItemType } from "@/types/data";
import { useMemo } from "react";
import ModuleList from "./components/moduleList";

type Props = {}

const Master = (props: Props) => {
    // const { data, error, isLoading } = useGetLogQuery({});
    // console.log(data);

    const updatedItems: BreadcrumbItemType[] = useMemo(() => [
        { type: 'link', title: 'Home', path: '/', isActive: false },
        { type: 'page', title: 'About', isActive: true },
    ], []);

    const jsonData = {
        totalRecords: 1,
        data: [
            {
                moduleIdPk: "a9fef88c-ceee-4a71-a57f-79877e12f2b4",
                moduleName: "Common",
                moduleDescription: "Common form are categorized",
                formList: [
                    {
                        formId: '1',
                        formName: 'form Name',
                    },
                    {
                        formId: '1',
                        formName: 'form Name 2',
                    },
                    {
                        formId: '1',
                        formName: 'form Name big Form Name',
                    },
                ]
            },
            {
                moduleIdPk: "a9fef88c-ceee-71-a57f-79877e12f2b4",
                moduleName: "Common",
                moduleDescription: "Common form are categorized",
            },
            {
                moduleIdPk: "a9fef88c-ceee-41-a57f-79877e12f2b4",
                moduleName: "Common",
                moduleDescription: "Common form are categorized",
            },
            {
                moduleIdPk: "a9fef8-ceee-4a71-a57f-79877e12f2b4",
                moduleName: "Common",
                moduleDescription: "Common form are categorized",
            },
            {
                moduleIdPk: "a9fef88c-ceee-4a71-a57f-777e12f2b4",
                moduleName: "Common",
                moduleDescription: "Common form are categorized",
            },
        ],
        validationMessage: null,
    };
    useBreadcrumb(updatedItems);
    return (
        <>
            <div className="w-[15%] bg-white dark:bg-gray-900">
                <ModuleList data={jsonData.data} />
            </div>
        </>
    )
}

export default Master
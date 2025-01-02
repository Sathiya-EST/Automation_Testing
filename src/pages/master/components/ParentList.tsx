import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetFormListColumnsQuery, useGetFormListDataQuery } from "@/store/services/master/form";
import AdvancedTable from "@/components/shared/Table";
import { GetReqParams } from "@/types/data";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FormTableProps {
    formName: string;
}

const ParentDataList: React.FC<FormTableProps> = ({ formName }) => {
    const [formReqParams, setFormReqParams] = useState<GetReqParams>({
        pageNo: 1,
        pageSize: 10,
        sort: [],
        filters: [],
    });
    const { data: formColumnData } = useGetFormListColumnsQuery({ formName });
    const { data: formRecords, isLoading: recordLoading } = useGetFormListDataQuery({
        reqParams: formReqParams,
        formName,
    });

    const updatedColumns = useMemo(() => {
        if (!formColumnData) return [];

        const columns = [...formColumnData.columnData];
        return columns;
    }, [formColumnData]);
    const onFormRequestParamsChange = (updatedParams: Partial<GetReqParams>) => {
        setFormReqParams((prevParams) => ({
            ...prevParams,
            ...updatedParams,
        }));
    };
    return (
        <AccordionItem key={formName} value={formName}>
            <AccordionTrigger className="text-sm no-underline hover:no-underline focus:no-underline">
                {formColumnData && formColumnData.data.moduleName + " - " + formColumnData.data.displayName}
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="p-4">
                        {updatedColumns && formRecords && <AdvancedTable
                            columns={updatedColumns ?? []}
                            data={formRecords.data}
                            totalCount={formRecords?.totalRecords || 0}
                            requestParams={formReqParams}
                            onRequestParamsChange={onFormRequestParamsChange}
                        />}
                        {recordLoading && <p>Loading...</p>}
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
    );
};

export default ParentDataList;

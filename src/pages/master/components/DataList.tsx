// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
// import FormTable from "./FormTable";
// import { Button } from "@/components/ui/button";
// import SearchInput from "@/components/shared/Search";
// import { Eye, Plus } from "lucide-react";
// import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination";
// import { useGetFormsQuery } from "@/store/services/master/form";
// import { skipToken } from "@reduxjs/toolkit/query";
// import AdvancedTable, { TableRequestParams } from "@/components/shared/Table";
// import { Badge } from "@/components/ui/badge";
// import { UI_ROUTES } from "@/constants/routes";

// interface MasterColumns {
//     displayName: string;
//     formDescription: string;
//     formName: string;
//     isPublished: boolean
// }

// const FormList: React.FC = () => {
//     const { moduleId } = useParams<{ moduleId: string }>();
//     const [forms, setForms] = useState<any[]>([]);
//     const context = useOutletContext<{ selectedModuleId: string }>();
//     const location = useLocation();
//     const navigate = useNavigate();

//     const [requestParams, setRequestParams] = useState<TableRequestParams>({
//         pageNo: 1,
//         pageSize: 10,
//         sort: [{ key: 'name', order: 'ASC' }],
//         filters: [],
//     });

//     useEffect(() => {
//         setForms([
//             { formId: 1, displayName: "Form A", formDescription: "Admin", module: "Module 1", isPublished: true },
//             { formId: 2, displayName: "Form B", formDescription: "User", module: "Module 1", isPublished: true },
//             { formId: 3, displayName: "Form C", formDescription: "Admin", module: "Module 1", isPublished: true },
//             { formId: 3, displayName: "Form C", formDescription: "Admin", module: "Module 1", isPublished: true },
//             { formId: 3, displayName: "Form C", formDescription: "Admin", module: "Module 1", isPublished: true },
//             { formId: 3, displayName: "Form C", formDescription: "Admin", module: "Module 1", isPublished: true },
//             { formId: 3, displayName: "Form C", formDescription: "Admin", module: "Module 1", isPublished: true },
//             { formId: 3, displayName: "Form C", formDescription: "Admin", module: "Module 1", isPublished: true },
//             { formId: 3, displayName: "Form C", formDescription: "Admin", module: "Module 1", isPublished: true },
//         ]);
//     }, []);

//     const handleView = (formName: string) => {
//         navigate(UI_ROUTES.MASTER_FORM_PREVIEW, { state: { formName } });

//     };
//     const handleCreate = () => {
//         navigate(UI_ROUTES.MASTER_FORM_CREATE, { state: { moduleId } });
//     };

//     const { data, isLoading, error } = useGetFormsQuery(
//         moduleId
//             ? {
//                 pageNo: 1,
//                 pageSize: 10,
//                 sort: [{ key: 'createdOn', order: 'ASC' }],
//                 filters: [
//                     {
//                         key: 'moduleName',
//                         operator: 'EQUAL',
//                         field_type: 'STRING',
//                         value: moduleId,
//                     },
//                 ],
//             }
//             : skipToken
//     );

//     useEffect(() => {
//         if (data && !isLoading && !error) {
//             console.log(data);
//             setForms(data.data);
//         }
//     }, [data, isLoading, error]);
//     console.log(data?.totalRecords);



//     const columns = [

//         {
//             accessorKey: 'displayName',
//             header: 'Form Name',
//             initiallyVisible: true
//         },
//         {
//             accessorKey: 'formDescription',
//             header: 'Description',
//             maxSize: 500,
//             size: 400,
//             initiallyVisible: false
//         },
//         {
//             accessorKey: 'createdBy',
//             header: 'Created By',
//         },
//         {
//             accessorKey: 'isPublished',
//             header: 'Status',
//             cell: (info: any) => (
//                 <Badge className={`text-xs text-white ${info.getValue() ? 'bg-green-400 text-green-900 hover:bg-green-600' : 'bg-red-400 text-red-900 hover:bg-red-600'}`}>
//                     {info.getValue() ? 'Published' : 'unPublished'}
//                 </Badge>
//             ),
//             initiallyVisible: true

//         },
//         {
//             accessorKey: 'action',
//             header: 'Action',
//             cell: (info: any) => {
//                 const formName = info.row.original.formName;
//                 return (
//                     <Button
//                         variant="default"
//                         className="text-white text-xs h-[32px] rounded flex items-center justify-center px-4 py-1 border-none"
//                         onClick={() => handleView(formName)}
//                     >
//                         <Eye className="mr-2" />
//                         View
//                     </Button>
//                 );
//             },
//             initiallyVisible: true

//         }

//     ];

//     return (
//         <div className="p-4 space-y-6 bg-card">
//             <p>{moduleId}</p>
//             <div className="flex items-center space-x-4">
//                 <SearchInput
//                     onSearch={(query: string) => console.log("Search:", query)}
//                     className="flex-1"
//                 />
//                 <Button variant="default" className="rounded text-white" onClick={handleCreate}>
//                     <Plus size={18} strokeWidth={3} />
//                     Create Form
//                 </Button>
//             </div>

//             {forms &&
//                 <AdvancedTable<MasterColumns>
//                     columns={columns}
//                     data={forms || []}
//                     totalCount={data?.totalRecords || 5}
//                     requestParams={requestParams}
//                     onRequestParamsChange={() => { }}
//                 />
//             }
//         </div>
//     );
// };

// export default FormList;



const FormList = () => {
    return (
        <div>FormList</div>
    )
}

export default FormList
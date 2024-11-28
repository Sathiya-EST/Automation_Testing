import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Eye, ArrowDown, ArrowUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TableSettingPopover from "./TableSettings";
import { Badge } from "@/components/ui/badge";

interface FormData {
    formIdPk: string;
    formName: string;
    displayName: string;
    moduleName: string;
    formDescription: string | null;
    formLayout: string;
    fields: any[] | null;
    createRow: boolean;
    deleteRow: boolean;
    updateRow: boolean;
    isPublished: boolean;
}


interface FormTableProps {
    formData: FormData[];
    handleView: (formName: string) => void;
}

const FormTable: React.FC<FormTableProps> = ({ formData, handleView }) => {
    const [sortBy, setSortBy] = useState<"formName" | "createdBy" | "module" | "status">("formName");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (column: "formName" | "createdBy" | "module" | "status") => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    const sortedFormData = [...formData].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <Table className="text-xs table-auto">
            <TableHeader className="bg-primary/10 text-primary text-sm">
                <TableRow>
                    <TableHead
                        onClick={() => handleSort("formName")}
                        className="cursor-pointer"
                    >
                        <div className="flex">

                            Form Name
                            {sortBy === "formName" && (
                                sortDirection === "asc" ? <ArrowUp className="w-4 h-4 ml-2" /> : <ArrowDown className="w-4 h-4 ml-2" />
                            )}
                        </div>
                    </TableHead>
                    <TableHead
                        onClick={() => handleSort("createdBy")}
                        className="cursor-pointer"
                    >
                        <div className="flex">
                            Description
                            {sortBy === "createdBy" && (
                                sortDirection === "asc" ? <ArrowUp className="w-4 h-4 ml-2" /> : <ArrowDown className="w-4 h-4 ml-2" />
                            )}
                        </div>
                    </TableHead>
                    {/* <TableHead
                        onClick={() => handleSort("module")}
                        className="cursor-pointer"
                    >
                        <div className="flex">
                            Module
                            {sortBy === "module" && (
                                sortDirection === "asc" ? <ArrowUp className="w-4 h-4 ml-2" /> : <ArrowDown className="w-4 h-4 ml-2" />
                            )}
                        </div>
                    </TableHead> */}
                    <TableHead
                        onClick={() => handleSort("status")}
                        className="cursor-pointer"
                    >
                        <div className="flex">
                            Status
                            {sortBy === "status" && (
                                sortDirection === "asc" ? <ArrowUp className="w-4 h-4 ml-2" /> : <ArrowDown className="w-4 h-4 ml-2" />
                            )}
                        </div>
                    </TableHead>
                    <TableHead className="flex justify-between items-center">
                        <span>Action</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="flex items-center justify-center p-1">
                                    <EllipsisVertical className="w-5 h-5 text-primary" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent side="left" className="w-auto">
                                {/* <TableSettingPopover /> */}
                            </PopoverContent>
                        </Popover>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedFormData.map((form, index) => (
                    <TableRow
                        key={form.formName}
                        className={`${index % 2 === 0
                            ? "bg-white dark:bg-muted"
                            : "bg-primary/5 dark:bg-primary/5"
                            }`}
                    >
                        <TableCell>{form.displayName}</TableCell>
                        <TableCell>{form.formDescription}</TableCell>
                        {/* <TableCell>{form.module}</TableCell> */}
                        <TableCell>
                            <Badge className={`text-xs text-white ${form.isPublished ? 'bg-green-400 text-green-900 hover:bg-green-600' : 'bg-red-400 text-red-900 hover:bg-red-600'}`}>
                                {form.isPublished ? 'Published' : 'unPublished'}
                            </Badge>
                            <span
                                // className={`w-3 h-3 rounded-full inline-block ${form.isPublished === "Published"
                                //     ? "bg-green-500"
                                //     : form.status === "Unpublished"
                                //         ? "bg-red-500"
                                //         : "bg-gray-500"
                                //     }`}
                                className={`w-3 h-3 rounded-full inline-block ${form.isPublished}? "bg-green-500" : "bg-red-500"}`}
                            ></span>
                            {/* <span className="ml-2">{form.isPublished ? 'Published' : 'unPublished'}</span> */}
                        </TableCell>

                        <TableCell>
                            <Button
                                variant="default"
                                className="text-white text-xs h-[32px] rounded flex items-center justify-center px-4 py-1 border-none"
                                onClick={() => handleView(form.formName)}
                            >
                                <Eye className="mr-2" />
                                View
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                {/* <TableRow>
                    <TableCell colSpan={4} className="text-right font-semibold">Total</TableCell>
                    <TableCell>
                        <span className="text-gray-900 font-medium">$2,500.00</span>
                    </TableCell>
                </TableRow> */}
            </TableFooter>
        </Table>
    );
};

export default FormTable;

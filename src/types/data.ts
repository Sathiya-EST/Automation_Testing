import { LAYOUT } from "@/constants/app.constants";

export type User = {
    userName: string | null,
    userRole: string | null
}

export type BreadcrumbItemType =
    | {
        type: "link";
        title: string;
        path: string;
        isActive?: false;
    }
    | {
        type: "dropdown";
        title: string;
        dropdownItems: string[];
        isActive?: false;
    }
    | {
        type: "page";
        title: string;
        isActive: true;
    };

type FieldType = 'STRING' | 'INTEGER' | 'DOUBLE' | 'BOOLEAN' | 'VARCHAR' | 'DATE' | 'DATETIME' | 'asynchronouslist' | 'upload' | 'computetexttotext';

type DataType = 'text' | 'numerical' | 'number' | 'checkbox' | 'select' | 'date' | 'datetime' | 'asynchronouslist' | 'upload';
export interface Field {
    name: string;
    category: string;
    generalType: FieldType;
    dataType: DataType;
    min: boolean;
    max: boolean;
    pattern: boolean | null;
    formula: boolean | null;
    required: boolean;
    placeholder: boolean;
    defaultValue: boolean;
    defaultChoice: boolean;
    alphabetic: boolean;
    alphanumeric: boolean | null;
    uniqueValue: boolean;
    decimalLimit: boolean;
    description: string;
    positiveOnly: boolean;
    negativeOnly: boolean;
    multiFileUpload: boolean;
    readOnly?: boolean;
    multiple?: boolean;
}

type FilterConfig = {
    key: string;
    operator: string;
    field_type: string;
    value: any;
};

export type TableRequestParams = {
    pageNo: number;
    pageSize: number;
    sort: { key: string; order: string }[];
    filters: FilterConfig[];
};

export interface DataTypes {
    name: string;
    category: string;
    generalType: FieldType
    dataType: DataType
    min: boolean;
    max: boolean;
    pattern: boolean | null;
    required: boolean;
    placeholder: boolean;
    defaultValue: boolean;
    alphabetic: boolean;
    alphanumeric: boolean | null;
    uniqueValue: boolean;
    decimalLimit: boolean;
    description: string;
    positiveOnly: boolean;
    negativeOnly: boolean;
    multiFileUpload: boolean;
}

export type DataTypesResponse = DataTypes[]

export interface FormFieldType {
    name: string;
    label: string;
    layout: "GRID_1" | "GRID_2" | "GRID_3";
    field: {
        dataTypeName: string;
        type?: string;
        min?: number;
        max?: number;
        readOnly?: boolean;
        pattern?: string;
        formula?: string;
        required?: boolean;
        placeholder?: string;
        defaultValue?: string;
        alphabetic?: boolean;
        alphanumeric?: boolean;
        defaultChoice?: string[];
        uniqueValue?: boolean;
        decimalLimit?: number;
        positiveOnly?: boolean;
        negativeOnly?: boolean;
        multiple?: boolean;
        asynchronousField?: {
            formName?: string;
            fieldName?: string;
            fieldType?: string;
        };
        compute?: string[];
    };
}
export interface FormFieldsType {
    formName: string;
    displayName: string;
    moduleName: string;
    formDescription: string;
    // formPurpose?: "MASTER" | "PROCESS";
    formLayout: string;
    fields: FormFieldType[];
}
// Layout options
export const layoutValues = Object.values(LAYOUT) as [string, ...string[]];

export interface SelectOptions {
    value: string;
    label: string;
}
type AccessDetails = {
    fullAccess: boolean;
    specificAccess?: {
        DEPARTMENT: string[];
        ROLE: string[];
        USER: string[];
    };
};
export interface publishDataType {
    isPublished: boolean;
    deleteAccess: AccessDetails;
    updateAccess: AccessDetails;
    createAccess: AccessDetails;
    viewAccess: AccessDetails;
}

export interface ResponseType {
    data: any[];
    totalRecords: number;
}

interface SortOption {
    key: string;
    order: 'ASC' | 'DESC';
}

interface Filter {
    key: string;
    operator: 'EQUAL' | 'LIKE';
    value: string | boolean;
    field_type: 'BOOLEAN' | 'STRING';
}

export interface GetReqParams {
    pageNo: number;
    pageSize: number;
    sort: SortOption[];
    filters: Filter[];
}

type ColumnField = {
    dataTypeName: string;
    type: string;
    placeholder: string | null;
    required: boolean | null;
    readOnly: boolean | null;
    min: number | null;
    max: number | null;
    pattern?: string | null;
    defaultValue?: any;
    alphabetic?: boolean | null;
    alphanumeric?: boolean | null;
    defaultChoice?: any;
    uniqueValue?: boolean | null;
    decimalLimit?: number | null;
    positiveOnly?: boolean | null;
    negativeOnly?: boolean | null;
    multiple?: boolean | null;
    asynchronousField?: boolean | null;
};

export type Column = {
    name: string;
    label: string;
    field: ColumnField;
};

export interface FormViewData {
    // columnData: never[];
    formIdPk: string;
    formName: string;
    moduleName: string;
    formDescription: string;
    formLayout: "GRID_1" | "GRID_2" | "GRID_3";
    displayName: string;
    fields: Column[];
    createRow: any;
    deleteRow: any;
    updateRow: any;
    cancelRow: any;
    isPublished: any;
};

export interface ColumnData {
    accessorKey: string;
    header: string;
    isId: boolean;
}

export interface FileUploadData {
    fileName: string;
    fileExtension: string;
    file: string;
}
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
    readOnly?: boolean;
}    
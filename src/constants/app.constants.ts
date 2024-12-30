export const APP_MODULES = {
    MASTER: 'MASTER',
    PROCESS: 'PROCESS'
} as const
export enum LAYOUT {
    GRID_1 = 'GRID_1',
    GRID_2 = 'GRID_2',
    GRID_3 = 'GRID_3'
}
export enum POSITION {
    BEFORE = 'BEFORE',
    AFTER = 'AFTER',
}
export const enum ROLES {
    USER = "USER",
    DEVELOPER = "DEVELOPER",
    VIEWER = "viewer"
}

export type AppModulesType = (typeof APP_MODULES)[keyof typeof APP_MODULES];

export const validDataTypes = [
    'Asynchronous List',
    'Date Time',
    'Date',
    'List Box',
    'Check Box / Boolean',
    'Decimal Number',
    'Whole Number',
    'Text Input',
    'File Upload'
];

export const SELECT_FIELD = 'List Box';
export const FILE_FIELD = 'File Upload';
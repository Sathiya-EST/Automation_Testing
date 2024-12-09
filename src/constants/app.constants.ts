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


export type AppModulesType = (typeof APP_MODULES)[keyof typeof APP_MODULES];

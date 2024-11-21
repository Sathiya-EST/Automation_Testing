export const APP_MODULES = {
    MASTER: 'MASTER',
    PROCESS: 'PROCESS'
} as const

export type AppModulesType = (typeof APP_MODULES)[keyof typeof APP_MODULES];

const MASTER = '/master';
const PROCESS = '/process';

export const UI_ROUTES = {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    CHANGE_PASSWORD: '/change-password',
    APP_SETTINGS: '/settings',
    ACCESS_DENIED: '/access-denied',
    PAGE_NOT_FOUND: '404',
    MASTER: MASTER,
    MASTER_FORM: `${MASTER}/form`,
    MASTER_FORM_CREATE: `${MASTER}/create`,
    MASTER_FORM_PREVIEW: `${MASTER}/preview`,
    MASTER_FORM_PUBLISH: `${MASTER}/publish`,
    MASTER_FORM_ACCESS: `${MASTER}/access`,
    MASTER_DATA: `${MASTER}/data`,
    MASTER_DATA_CREATE: `${MASTER}/data/create`,
    PROCESS: PROCESS,
    MASTER_DATA_CRUD: `${MASTER}/data/crud`
};

export const AUTH_API_BASE_URL = import.meta.env.VITE_CREATOR_AUTH_SERVER
export const USER_AUTH_API_BASE_URL = import.meta.env.VITE_USER_AUTH_SERVER
export const MASTER_API_BASE_URL = import.meta.env.VITE_MASTER_SERVER
export const APPLICATION_URL = import.meta.env.VITE_APPLICATION_URL

export const USER_API = {
    LOGIN: `${USER_AUTH_API_BASE_URL}/token`,
    LOGIN_CREATOR: `${AUTH_API_BASE_URL}/token`,
    REFRESH_TOKEN: `${AUTH_API_BASE_URL}/token`,
    LOGOUT: `${AUTH_API_BASE_URL}/revoke`,
    FORGOT_PASSWORD: '',
    RESET_PASSWORD: '',
}
export const MASTER_API = {
    // Module API Path

    GET_MODULES: `${MASTER_API_BASE_URL}/module/list`,
    LOG: `${MASTER_API_BASE_URL}/log`,
    CREATE_MODULE: `${MASTER_API_BASE_URL}/module`,
    // Forms List
    GET_FORMS_BY_MODULE: `${MASTER_API_BASE_URL}/form/template/get`,
    EXPORT_AS_EXCEL: `${MASTER_API_BASE_URL}/form/excel`,
    DOWNLOAD_CSV: `${MASTER_API_BASE_URL}/form/bulk/insert/file`,
    BULK_INSERT: `${MASTER_API_BASE_URL}/form/bulk/insert`,
    DWLD_ERR_REPORT: `${MASTER_API_BASE_URL}/form/bulk/insert/download`,
    //Form
    GET_DATA_TYPES: `${MASTER_API_BASE_URL}/form/datatype`,
    CREATE_FORM: `${MASTER_API_BASE_URL}/form/template`,
    PREVIEW_FORM: `${MASTER_API_BASE_URL}/form/template/view`,
    GET_ASYNCDATA: `${MASTER_API_BASE_URL}/form/get`,
    UPDATE_FORM: `${MASTER_API_BASE_URL}/form/template/add/fields`,
    PUBLISH_FORM: `${MASTER_API_BASE_URL}/form/template/publish`,
    GET_ROLES: `${MASTER_API_BASE_URL}/form/get`,

    //Form Data 
    GET_FORM_RECORD_LIST: `${MASTER_API_BASE_URL}/form/get`,
    GET_FORMDATA_COLUMNS: `${MASTER_API_BASE_URL}/form/template/view`,
    GET_FORM_RECORD_VIEW: `${MASTER_API_BASE_URL}/form/view`,
    ADD_RECORD: `${MASTER_API_BASE_URL}/form`,
    UPDATE_RECORD: `${MASTER_API_BASE_URL}/form`,
    DELETE_RECORD: `${MASTER_API_BASE_URL}/form/delete`
}


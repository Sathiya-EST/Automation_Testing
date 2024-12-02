export const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_SERVER
export const MASTER_API_BASE_URL = import.meta.env.VITE_MASTER_SERVER
export const APPLICATION_URL = import.meta.env.VITE_APPLICATION_URL

export const USER_API = {
    LOGIN: `${AUTH_API_BASE_URL}/token`,
    LOGIN_CREATOR: `${AUTH_API_BASE_URL}/token`,
    REFRESH_TOKEN: `${AUTH_API_BASE_URL}/token`,
    LOGOUT: `${AUTH_API_BASE_URL}/revoke`,
    FORGOT_PASSWORD: '',
    RESET_PASSWORD: '',
}
export const MASTER_API = {
    GET_MODULES: `${MASTER_API_BASE_URL}/module/list`,
    GET_FORMS_BY_MODULE: `${MASTER_API_BASE_URL}/form/template/get`,
    LOG: `${MASTER_API_BASE_URL}/log`
}


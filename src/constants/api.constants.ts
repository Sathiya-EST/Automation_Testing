export const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_SERVER
export const MASTER_API_BASE_URL = import.meta.env.VITE_MASTER_SERVER
export const PC_API_BASE_URL = import.meta.env.VITE_PC_SERVER

export const USER_API = {
    LOGIN: `${AUTH_API_BASE_URL}/token`,
    LOGIN_CREATOR: `${AUTH_API_BASE_URL}/token`,
    REFRESH_TOKEN: `${AUTH_API_BASE_URL}/token`,
    LOGOUT: `${AUTH_API_BASE_URL}/revoke`,
    FORGOT_PASSWORD: '',
    RESET_PASSWORD: '',
}
export const MASTER_API = {
    GET_MODULES: `${MASTER_API_BASE_URL}/auth`,
    GET_FORMS_BY_MODULE: (id: string) => `${MASTER_API_BASE_URL}/products/${id}`,
    LOG: `${MASTER_API_BASE_URL}/log`
}

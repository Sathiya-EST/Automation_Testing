import { getDataFromLocalStorage, getToken, removeTokens, storeToken } from '@/utils/securels';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isExpired: boolean;
    userName: string | null;
    userRole: string | null;
}

const initialState: AuthState = {
    accessToken: getToken('accessToken'),
    refreshToken: getToken('refreshToken'),
    isExpired: false,
    userName: getDataFromLocalStorage('userName'),
    userRole: getDataFromLocalStorage('userRole'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (
            state,
            action: PayloadAction<{
                accessToken: string;
                refreshToken: string;
                userName: string | null;
                userRole: string | null;
            }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isExpired = false;
            state.userName = action.payload.userName;
            state.userRole = action.payload.userRole;
            localStorage.setItem("userName", action.payload.userName || '')
            localStorage.setItem("userRole", action.payload.userRole || '')
            storeToken(state.accessToken, state.refreshToken);
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.isExpired = false;
            state.userName = null;
            state.userRole = null;
            removeTokens();
        },
        setIsExpired: (state, action: PayloadAction<boolean>) => {
            state.isExpired = action.payload;
        },
    },
});

export const { setTokens, clearTokens, setIsExpired } = authSlice.actions;
export default authSlice.reducer;

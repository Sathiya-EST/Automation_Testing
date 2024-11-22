import { getToken, removeTokens, storeToken } from '@/utils/securels';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    accessToken: getToken('accessToken'),
    refreshToken: getToken('refreshToken'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<AuthState>) => {
            if (action.payload.accessToken && action.payload.refreshToken) {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;

                storeToken(state.accessToken, state.refreshToken);
            }
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            removeTokens()
        },
    },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;

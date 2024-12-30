import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormStatus {
    moduleName: string | null;
    // status: 'published' | 'unPublished'|'all';
}

interface FormData {
    formName: string | null;
    moduleName: string;
}

interface MasterState {
    form: FormStatus | null;
    data: FormData | null;
}

const initialState: MasterState = {
    form: sessionStorage.getItem('masterFormState')
        ? JSON.parse(sessionStorage.getItem('masterFormState')!)
        : null,
    data: sessionStorage.getItem('masterDataState')
        ? JSON.parse(sessionStorage.getItem('masterDataState')!)
        : null,
};

const masterSlice = createSlice({
    name: 'master',
    initialState,
    reducers: {
        updateMasterForm: (state, action: PayloadAction<FormStatus>) => {
            state.form = action.payload;
            sessionStorage.setItem('masterFormState', JSON.stringify(state.form));
        },
        updateMasterData: (state, action: PayloadAction<FormData>) => {
            state.data = action.payload;
            sessionStorage.setItem('masterDataState', JSON.stringify(state.data));
        },
        clearMasterState: (state) => {
            state.form = null;
            state.data = null;
            sessionStorage.removeItem('masterFormState');
            sessionStorage.removeItem('masterDataState');
        },
    },
});

export const { updateMasterForm, updateMasterData, clearMasterState } = masterSlice.actions;

export default masterSlice.reducer;

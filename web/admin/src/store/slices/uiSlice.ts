import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
    collapsed: boolean;
}

const initialState: UiState = {
    collapsed: false,
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleCollapse: (state) => {
            state.collapsed = !state.collapsed;
        },
    },
});

export const { toggleCollapse } = uiSlice.actions;
export default uiSlice.reducer;
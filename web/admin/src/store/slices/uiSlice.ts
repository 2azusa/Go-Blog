import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
  // 侧边栏是否折叠
  collapsed: boolean;
}

const initialState: UiState = {
  collapsed: false,
};

export const uiSlice = createSlice({
  // name 用于在 Redux DevTools 中标识 slice
  name: 'ui',
  initialState,
  reducers: {
    toggleCollapse: (state) => {
      // Redux Toolkit 内部使用 Immer，允许我们直接修改 state
      state.collapsed = !state.collapsed;
    },
  },
});

// createSlice 会为每个 reducer 自动生成对应的 action creators
export const { toggleCollapse } = uiSlice.actions;

export default uiSlice.reducer;
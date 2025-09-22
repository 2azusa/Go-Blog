// 从 @reduxjs/toolkit 导入 createSlice 函数，用于创建 Redux slice
import { createSlice } from '@reduxjs/toolkit';

// 定义 UI state 的接口
export interface UiState {
    // 侧边栏是否折叠
    collapsed: boolean;
}

// 定义 UI slice 的初始 state
const initialState: UiState = {
    collapsed: false,
};

// 使用 createSlice 创建一个名为 'ui' 的 slice
export const uiSlice = createSlice({
    // slice 的名称，用于在 Redux DevTools 中标识和生成 action types
    name: 'ui',
    // slice 的初始 state
    initialState,
    // reducers 是一个对象，包含了处理 state 更新的函数
    reducers: {
        // toggleCollapse 是一个 reducer 函数，用于切换 collapsed 状态
        toggleCollapse: (state) => {
            // Redux Toolkit 内部使用 Immer，允许我们直接修改 state
            state.collapsed = !state.collapsed;
        },
    },
});

// createSlice 会为每个 reducer 函数自动生成对应的 action creator
// 解构并导出 toggleCollapse action creator
export const { toggleCollapse } = uiSlice.actions;

// 导出 slice 生成的 reducer，它将被用于配置 store
export default uiSlice.reducer;
// 从 @reduxjs/toolkit 导入 configureStore 函数，用于创建和配置 Redux store
import { configureStore } from '@reduxjs/toolkit';
// 从 uiSlice 文件导入 uiReducer
import uiReducer from './slices/uiSlice';

// 使用 configureStore 创建 Redux store
export const store = configureStore({
    // reducer 是一个对象，它将 state 的各个 slice 映射到它们各自的 reducer 函数
    reducer: {
        // 'ui' slice 的 state 将由 uiReducer 管理
        ui: uiReducer,
    },
});

// 从 store 实例中推断出 RootState 类型，它代表了整个应用的 state 结构
export type RootState = ReturnType<typeof store.getState>;
// 从 store 中推断出 AppDispatch 类型，这是 store 的 dispatch 方法的类型
export type AppDispatch = typeof store.dispatch;
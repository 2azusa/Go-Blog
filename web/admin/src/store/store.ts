import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  // 将 state 的各个 slice 映射到它们各自的 reducer 函数
  reducer: {
      ui: uiReducer,
  },
});

// 从 store 实例中推断出 RootState 类型，代表整个应用的 state 结构
export type RootState = ReturnType<typeof store.getState>;

// 推断出 AppDispatch 类型，即 store 的 dispatch 方法的类型
export type AppDispatch = typeof store.dispatch;
import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. 路由: 导入 React Router 的 Provider 和我们的路由配置
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // 对应 './router'

// 2. UI 库: 导入 MUI 的 ThemeProvider 和全局样式重置
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme'; // 对应 './plugins/vuetify'

// 3. 状态管理: 导入 Redux 的 Provider 和我们的 store
import { Provider } from 'react-redux';
import { store } from './utils/store'; // 对应 './store'

// 4. HTTP 客户端: 只需导入一次以执行其全局配置
import './services/api'; // 对应 './plugins/http'

// 启动 React 应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 用 Provider 组件包裹整个应用 */}
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline 类似于 normalize.css，用于重置浏览器默认样式 */}
        <CssBaseline />
        {/* RouterProvider 负责整个应用的路由渲染 */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
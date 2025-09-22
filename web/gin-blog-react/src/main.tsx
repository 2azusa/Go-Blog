import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 导入 RouterProvider 以提供路由功能
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
// 导入我们创建的路由配置
import { router } from './router/router'; // 导入我们新创建的路由实例

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)

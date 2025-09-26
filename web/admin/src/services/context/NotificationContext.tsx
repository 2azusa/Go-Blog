import React, { useState, createContext, useEffect } from 'react';
import type { ReactNode } from 'react'; // <-- 'ReactNode' 作为类型导入
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material'; // <-- 'AlertColor' 作为类型导入

// --- Part 1: The Bridge ---
// 创建一个简单的事件发射器，用于在非 React 文件 (如 api.ts) 和 React 组件之间通信
interface NotificationEvent {
  message: string;
  severity: AlertColor;
}
let listener: ((event: NotificationEvent) => void) | null = null;

export const notificationService = {
  subscribe(callback: (event: NotificationEvent) => void) {
    listener = callback;
  },
  show(message: string, severity: AlertColor = 'info') {
    if (listener) {
      listener({ message, severity });
    }
  },
};

// --- Part 2: The React Context and Provider ---
// 移除了未使用的 useContext，这里只是创建 Context
const NotificationContext = createContext({});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  // 使用 useEffect 替代 useState 来订阅，这更符合 React 的生命周期管理
  useEffect(() => {
    notificationService.subscribe(({ message, severity }) => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    });
    // 可选：在组件卸载时取消订阅，以防止内存泄漏
    return () => {
      listener = null;
    };
  }, []); // 空依赖数组确保只在挂载时运行一次

  // 修正 4: 将未使用的 'event' 参数重命名为 '_event'
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{}}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// 可选的 hook，如果组件内部也想触发通知 (无需改动)
export const useNotification = () => {
  return notificationService;
};
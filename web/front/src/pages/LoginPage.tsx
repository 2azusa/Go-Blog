import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 导入 react-hook-form 和 yup
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// 导入 MUI 组件
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';

// 1. 定义表单数据的 TypeScript 类型
// FIX: 移除了 password 字段的 '?'，使其成为必填项，与 yup schema 保持一致
interface IFormData {
  username: string;
  password: string; // <-- 这里是唯一的改动
}

// 2. 使用 yup 创建验证 schema (无需改动)
const schema = yup.object().shape({
  username: yup
    .string()
    .required('用户名不能为空')
    .min(4, '用户名长度必须在4-12之间')
    .max(12, '用户名长度必须在4-12之间'),
  password: yup
    .string()
    .required('密码不能为空')
    .min(6, '密码长度必须在6-20之间')
    .max(20, '密码长度必须在6-20之间'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  // 3. 初始化 react-hook-form
  const {
    register,          // 用于将输入框注册到 hook form
    handleSubmit,      // 包装我们的提交函数，并处理验证
    formState: { errors, isSubmitting }, // 包含表单状态，如错误信息和提交状态
    reset,             // 用于重置表单
  } = useForm<IFormData>({
    resolver: yupResolver(schema), // 将 yup schema 与 hook form 连接
  });

  // 4. 定义提交逻辑，替代 login 方法
  const onSubmit = async (data: IFormData) => {
    setApiError(null); // 重置 API 错误
    try {
      const { data: result } = await axios.post('api/login', data);
      if (result.code !== 200) {
        // 假设 API 在失败时返回一个 message
        setApiError(result.message || '登录失败，请重试');
        return;
      }
      window.sessionStorage.setItem('token', result.token);
      navigate('/home');
    } catch (error) {
      setApiError('网络错误或服务器无法响应');
      console.error("Login failed:", error);
    }
  };

  // 5. 定义重置逻辑
  const handleReset = () => {
    reset({ username: '', password: '' });
    setApiError(null);
  };
  
  // 6. 渲染 JSX 和样式
  return (
    <Box // 模拟背景
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper // 模拟 loginBox
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          欢迎登录
        </Typography>

        {/* 将 handleSubmit 绑定到 form 的 onSubmit 事件 */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          
          <TextField
            // 使用 register 连接 input
            {...register('username')}
            label="用户名"
            required
            fullWidth
            margin="normal"
            // 显示 yup 提供的验证错误
            error={!!errors.username}
            helperText={errors.username?.message}
            autoFocus
          />

          <TextField
            {...register('password')}
            label="密码"
            type="password"
            required
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleReset}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting} // 在提交过程中禁用按钮
            >
              {isSubmitting ? '登录中...' : '登录'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.ts';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, TextField, Button, Typography, Paper, Alert, Link } from '@mui/material';

interface IFormData {
  username: string;
  password: string;
  confirmPassword?: string;
  email?: string; 
}

interface IApiResponse {
  status: number;
  message: string;
  token?: string;
}

const loginSchema = yup.object().shape({
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

const registerSchema = yup.object().shape({
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
  confirmPassword: yup
    .string()
    .required('请再次输入密码')
    .oneOf([yup.ref('password')], '两次输入的密码不一致'),
  email: yup
    .string()
    .email('请输入有效的邮箱地址')
    .required('邮箱不能为空'),
});


const LoginPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormData>({
    resolver: yupResolver(isLoginMode ? loginSchema : registerSchema),
  });

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    reset();
    setApiError(null);
    setApiSuccess(null);
  };

  const onSubmit = async (data: IFormData) => {
    setApiError(null);
    setApiSuccess(null);

    if (isLoginMode) {
      // --- 登录逻辑 ---
      try {
        const { data: result } = await api.post<IApiResponse>('/login', {
          username: data.username,
          password: data.password,
        });
        
        if (result.status !== 200) {
          setApiError(result.message || '登录失败，请重试');
          return;
        }
        if (result.token) {
          window.sessionStorage.setItem('token', result.token);
          navigate('/'); // 登录成功后跳转到主页
        } else {
          setApiError('登录成功但未收到 Token');
        }
      } catch (error: any) {
        const specificMessage = error.response?.data?.message;
        if (specificMessage) {
          setApiError(specificMessage);
        }
        console.error("Login failed:", error);
      }
    } else {
      // --- 注册逻辑 ---
      try {
        const { data: result } = await api.post<IApiResponse>('/register', {
            username: data.username,
            password: data.password,
            email: data.email,
        });
        if (result.status !== 200) {
          setApiError(result.message || '注册失败，请重试');
          return;
        }
        setApiSuccess('注册成功！请检查您的邮箱以激活账户。');
        reset();
      } catch (error: any) {
        const specificMessage = error.response?.data?.message;
        if (specificMessage) {
          setApiError(specificMessage);
        }
        console.error("Registration failed:", error);
      }
    }
  };
  
  const handleReset = () => {
    reset();
    setApiError(null);
    setApiSuccess(null);
  };
  
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {isLoginMode ? '欢迎登录' : '创建新账户'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          {apiSuccess && <Alert severity="success" sx={{ mb: 2 }}>{apiSuccess}</Alert>}
          
          <TextField
            {...register('username')}
            label="用户名"
            required
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
            autoFocus
          />
          {!isLoginMode && (
            <TextField
              {...register('email')}
              label="邮箱"
              type="email"
              required
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
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
          {!isLoginMode && (
              <TextField
                  {...register('confirmPassword')}
                  label="确认密码"
                  type="password"
                  required
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
              />
          )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleReset}
            >
              重置
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '处理中...' : (isLoginMode ? '登录' : '注册')}
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component="button" variant="body2" onClick={toggleMode} sx={{ cursor: 'pointer' }}>
              {isLoginMode ? '还没有账户？点击注册' : '已有账户？返回登录'}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
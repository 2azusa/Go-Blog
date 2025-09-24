import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.ts';

// 导入 react-hook-form 和 yup
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// 导入 MUI 组件
import { Box, TextField, Button, Typography, Paper, Alert, Link } from '@mui/material';

// 修改: IFormData 现在包含登录和注册所需的所有字段
interface IFormData {
  username: string;
  password: string;
  confirmPassword?: string; // 登录时可选
  email?: string;           // 登录时可选
}

interface IApiResponse {
  code: number;
  message: string;
  token?: string;
}

// 修改: 将原始 schema 重命名为 loginSchema
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

// 新增: 为注册功能专门创建一个 schema
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
    .oneOf([yup.ref('password')], '两次输入的密码不一致'), // 确保该字段的值与密码字段一致
  email: yup
    .string()
    .email('请输入有效的邮箱地址')
    .required('邮箱不能为空'),
});


const LoginPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null); // 新增: 用于显示成功消息的 state
  const [isLoginMode, setIsLoginMode] = useState(true); // 新增: 用于在登录/注册模式间切换的 state

  // 修改: resolver 现在会根据当前模式条件性地使用正确的 schema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormData>({
    resolver: yupResolver(isLoginMode ? loginSchema : registerSchema),
  });

  // 新增: 切换表单模式的函数
  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    reset(); // 切换模式时重置表单字段和错误
    setApiError(null);
    setApiSuccess(null);
  };

  // 修改: onSubmit 函数现在同时处理登录和注册逻辑
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
        if (result.code !== 200) {
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
        if (result.code !== 200) {
          setApiError(result.message || '注册失败，请重试');
          return;
        }
        // 根据您的后端逻辑，注册会发送一封激活邮件
        setApiSuccess('注册成功！请检查您的邮箱以激活账户。');
        reset(); // 注册成功后清空表单
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
        {/* 修改: 标题根据模式动态改变 */}
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {isLoginMode ? '欢迎登录' : '创建新账户'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          {/* 新增: 显示成功消息 */}
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

          {/* 新增: 为注册模式条件性地渲染邮箱输入框 */}
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

          {/* 新增: 为注册模式条件性地渲染确认密码输入框 */}
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
              color="inherit" // 从 'error' 改为 'inherit'，外观更中性
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
              {/* 修改: 按钮文本根据模式和提交状态动态改变 */}
              {isSubmitting ? '处理中...' : (isLoginMode ? '登录' : '注册')}
            </Button>
          </Box>

          {/* 新增: 用于在登录和注册模式间切换的链接 */}
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

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api.ts';

// // 导入 react-hook-form 和 yup
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// // 导入 MUI 组件
// import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';

// // 1. 定义表单数据的 TypeScript 类型
// // FIX: 移除了 password 字段的 '?'，使其成为必填项，与 yup schema 保持一致
// interface IFormData {
//   username: string;
//   password: string;
// }

// interface IApiResponse {
//   code: number;
//   message: string;
//   token?: string; // token 在失败时可能不存在，设为可选
// }

// // 2. 使用 yup 创建验证 schema (无需改动)
// const schema = yup.object().shape({
//   username: yup
//     .string()
//     .required('用户名不能为空')
//     .min(4, '用户名长度必须在4-12之间')
//     .max(12, '用户名长度必须在4-12之间'),
//   password: yup
//     .string()
//     .required('密码不能为空')
//     .min(6, '密码长度必须在6-20之间')
//     .max(20, '密码长度必须在6-20之间'),
// });

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [apiError, setApiError] = useState<string | null>(null);

//   // 3. 初始化 react-hook-form
//   const {
//     register,          // 用于将输入框注册到 hook form
//     handleSubmit,      // 包装我们的提交函数，并处理验证
//     formState: { errors, isSubmitting }, // 包含表单状态，如错误信息和提交状态
//     reset,             // 用于重置表单
//   } = useForm<IFormData>({
//     resolver: yupResolver(schema), // 将 yup schema 与 hook form 连接
//   });

//   // 4. 定义提交逻辑，替代 login 方法
//   const onSubmit = async (data: IFormData) => {
//     setApiError(null); // 重置 API 错误
//     try {
//       const { data: result } = await api.post<IApiResponse>('/login', data);
//       if (result.code !== 200) {
//         // 假设 API 在失败时返回一个 message
//         setApiError(result.message || '登录失败，请重试');
//         return;
//       }
//       // 登陆成功，存储token
//       if (result.token) {
//         window.sessionStorage.setItem('token', result.token);
//         navigate('/home');
//       } else {
//         setApiError('登录成功但未收到 Token');
//       }
//     } catch (error: any) {
//       // 网络层面的错误（如 500, 404）会被 api.ts 的拦截器捕获并显示全局通知
//       // 我们也可以选择在这里显示一个更具体的表单内错误
//       const specificMessage = error.response?.data?.message;
//       if (specificMessage) {
//         setApiError(specificMessage);
//       }
//       // 全局的 Snackbar 错误提示已经由 api.ts 处理了，这里无需额外操作
//       console.error("Login failed:", error);
//     }
//   };

//   // 5. 定义重置逻辑
//   const handleReset = () => {
//     reset({ username: '', password: '' });
//     setApiError(null);
//   };
  
//   // 6. 渲染 JSX 和样式
//   return (
//     <Box // 模拟背景
//       sx={{
//         height: '100vh',
//         width: '100%',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f5f5f5',
//       }}
//     >
//       <Paper // 模拟 loginBox
//         elevation={3}
//         sx={{
//           padding: 4,
//           width: 400,
//           borderRadius: 2,
//         }}
//       >
//         <Typography variant="h5" component="h1" align="center" gutterBottom>
//           欢迎登录
//         </Typography>

//         {/* 将 handleSubmit 绑定到 form 的 onSubmit 事件 */}
//         <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
//           {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          
//           <TextField
//             // 使用 register 连接 input
//             {...register('username')}
//             label="用户名"
//             required
//             fullWidth
//             margin="normal"
//             // 显示 yup 提供的验证错误
//             error={!!errors.username}
//             helperText={errors.username?.message}
//             autoFocus
//           />

//           <TextField
//             {...register('password')}
//             label="密码"
//             type="password"
//             required
//             fullWidth
//             margin="normal"
//             error={!!errors.password}
//             helperText={errors.password?.message}
//           />

//           <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//             <Button
//               variant="outlined"
//               color="error"
//               onClick={handleReset}
//             >
//               取消
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={isSubmitting} // 在提交过程中禁用按钮
//             >
//               {isSubmitting ? '登录中...' : '登录'}
//             </Button>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default LoginPage;
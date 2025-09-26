import { useState, useEffect, useCallback, useRef } from 'react'; // [修改] 引入 useRef
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { profileApi } from '../services/api';
import type { IReqUpdateProfile, IProfile } from '../utils/types';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  TextField,
  Button,
  Snackbar,
  Divider,
  Stack,
  Avatar, // [新增] 引入 Avatar 用于预览
} from '@mui/material';

// 验证规则保持不变
const validationSchema = yup.object().shape({
    name: yup.string().required('昵称不能为空'),
    desc: yup.string().default(''),
    qq_chat: yup.string().default(''),
    wechat: yup.string().default(''),
    weibo: yup.string().default(''),
    email: yup.string().email('请输入有效的邮箱地址').default(''),
    img: yup.string().url('请输入有效的URL').default(''),
    avatar: yup.string().url('请输入有效的URL').default(''),
});

const ProfilePage = () => {
  // --- State Management ---
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // [新增] 用于文件上传的状态
  const [uploading, setUploading] = useState<{ type: 'avatar' | 'img' | null, status: boolean }>({ type: null, status: false });

  const {
    control,
    handleSubmit,
    reset,
    setValue, // [修改] 从 useForm 中获取 setValue 方法
    watch,    // [修改] 引入 watch 实时监控表单值以更新预览
    formState: { isSubmitting, errors },
  } = useForm<IReqUpdateProfile>({
    resolver: yupResolver(validationSchema),
  });

  // [新增] 创建对隐藏文件输入框的引用
  const fileInputRef = useRef<HTMLInputElement>(null);
  // [新增] 存储当前要上传的图片类型 ('avatar' 或 'img')
  const uploadTargetRef = useRef<'avatar' | 'img' | null>(null);

  // --- Data Fetching (保持不变) ---
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const { data: response } = await profileApi.getProfile();
      if (response.status === 200 && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || '获取个人资料失败');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.message || '加载数据时发生错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  // [新增] 实时监控 avatar 和 img 字段的值
  const avatarUrl = watch('avatar');
  const backgroundUrl = watch('img');

  // --- Event Handlers ---
  const handleEnterEditMode = () => {
    if (profile) {
      reset(profile);
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setApiError(null);
  };
  
  // [新增] 处理上传按钮点击事件
  const handleUploadClick = (target: 'avatar' | 'img') => {
    uploadTargetRef.current = target; // 记录上传目标
    fileInputRef.current?.click(); // 触发隐藏的文件输入框
  };

  // [新增] 处理文件选择事件
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const target = uploadTargetRef.current;
    if (!file || !target) return;

    setUploading({ type: target, status: true });
    setApiError(null);
    try {
      const { data: response } = await profileApi.uploadFile(file);
      if (response.status === 200 && response.url) {
        // 使用 setValue 更新表单字段值
        setValue(target, response.url, { shouldValidate: true });
        setSuccessMessage(`${target === 'avatar' ? '头像' : '背景图'}上传成功！`);
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || '文件上传失败');
    } finally {
      setUploading({ type: null, status: false });
      // 重置文件输入框，以便可以再次上传同一个文件
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSubmit: SubmitHandler<IReqUpdateProfile> = async (formData) => {
    // ... (此函数保持不变)
    setApiError(null);
    setSuccessMessage(null);
    try {
      const { data: response } = await profileApi.updateProfile(formData);
      if (response.status === 200) {
        setProfile(formData as IProfile);
        setIsEditMode(false);
        setSuccessMessage('个人资料更新成功！');
      } else {
        throw new Error(response.message || '更新失败，请重试');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || '更新操作失败');
    }
  };

  const handleCloseSnackbar = () => setSuccessMessage(null);

  // --- Render Helpers (保持不变) ---
  const renderProfileDetail = (label: string, value: string | undefined) => (
    <Box sx={{ display: 'flex', py: 1.5, alignItems: 'center' }}>
      <Typography variant="subtitle1" sx={{ width: 120, color: 'text.secondary' }}>
        {label}:
      </Typography>
      {label === '头像URL' && value ? (
        <Avatar src={value} sx={{ width: 40, height: 40 }}/>
      ) : (
        <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>{value || '未设置'}</Typography>
      )}
    </Box>
  );

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* [新增] 隐藏的文件输入框 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />

      <Paper elevation={3} sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h5" component="h1" gutterBottom>个人资料设置</Typography>
        <Divider sx={{ my: 2 }} />

        {isEditMode ? (
          // --- EDIT MODE ---
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
            {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Controller name="name" control={control} render={({ field }) => <TextField {...field} label="昵称" required fullWidth error={!!errors.name} helperText={errors.name?.message}/>}/>
                  <Controller name="email" control={control} render={({ field }) => <TextField {...field} label="邮箱" type="email" fullWidth error={!!errors.email} helperText={errors.email?.message}/>}/>
              </Box>
              <Controller name="desc" control={control} render={({ field }) => <TextField {...field} label="个人简介" fullWidth multiline rows={3} error={!!errors.desc} helperText={errors.desc?.message}/>}/>
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Controller name="qq_chat" control={control} render={({ field }) => <TextField {...field} label="QQ" fullWidth />}/>
                  <Controller name="wechat" control={control} render={({ field }) => <TextField {...field} label="微信" fullWidth />}/>
                  <Controller name="weibo" control={control} render={({ field }) => <TextField {...field} label="微博" fullWidth />}/>
              </Box>

              {/* [修改] 头像上传字段 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={avatarUrl} sx={{ width: 56, height: 56 }}/>
                  <Controller name="avatar" control={control} render={({ field }) => <TextField {...field} label="头像URL" fullWidth error={!!errors.avatar} helperText={errors.avatar?.message} sx={{ flexGrow: 1 }}/>}/>
                  <Button variant="outlined" onClick={() => handleUploadClick('avatar')} disabled={uploading.status}>
                    {uploading.type === 'avatar' && uploading.status ? <CircularProgress size={24}/> : '上传头像'}
                  </Button>
              </Box>

              {/* [修改] 背景图上传字段 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Controller name="img" control={control} render={({ field }) => <TextField {...field} label="背景图URL" fullWidth error={!!errors.img} helperText={errors.img?.message} sx={{ flexGrow: 1 }}/>}/>
                  <Button variant="outlined" onClick={() => handleUploadClick('img')} disabled={uploading.status}>
                    {uploading.type === 'img' && uploading.status ? <CircularProgress size={24}/> : '上传背景'}
                  </Button>
              </Box>
              {backgroundUrl && <Box component="img" src={backgroundUrl} sx={{ width: '100%', height: 'auto', maxHeight: 150, objectFit: 'cover', borderRadius: 1, mt: 1 }}/>}

            </Stack>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" color="inherit" onClick={handleCancelEdit}>取消</Button>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>{isSubmitting ? '保存中...' : '保存更改'}</Button>
            </Box>
          </Box>
        ) : (
          // --- DISPLAY MODE (保持不变) ---
          <Box>
            {/* ... */}
          </Box>
        )}
      </Paper>

      {/* Snackbar (保持不变) */}
      <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
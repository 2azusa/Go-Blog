import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersApi } from '../services/api';
import { 
  Box, Typography, Paper, CircularProgress, Alert, List, ListItem, 
  ListItemText, Divider, Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { IUser, IArticle, IReqEditUser } from '../utils/types';
import UserEditModal from '../layout/UserEditModal';

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getUserInfo(parseInt(id, 10));
        const result = response.data;

        if (result && result.status === 200) {
          setUser(result.data);
        } else {
          setError(result.message || '获取用户详情失败');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '网络错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [id]);

  const handleSaveUser = async (updatedUser: IUser) => {
    try {
      const postData: IReqEditUser = {
        id: updatedUser.ID,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      };

      const response = await usersApi.updateUser(postData);
      
      if (response.data && response.data.status === 200) {
        setUser(response.data.data); 
      } else {
        setError(response.data.message || '更新用户失败');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '更新请求发生网络错误';
      setError(errorMessage);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    try {
      await usersApi.deleteUser(user.ID);
      navigate('/userlist');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '删除用户失败';
      setError(errorMessage);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  if (!user) return <Typography sx={{ m: 3, textAlign: 'center' }}>未找到该用户</Typography>;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
        <Paper elevation={3} sx={{ p: 3, wordBreak: 'break-word' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom>用户详情</Typography>
            <Box>
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsModalOpen(true)} sx={{ mr: 1 }}>修改信息</Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setIsConfirmOpen(true)}>删除用户</Button>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ mb: 1 }}><strong>ID:</strong> {user.ID}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><strong>用户名:</strong> {user.username}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><strong>邮箱:</strong> {user.email}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><strong>角色:</strong> {user.role === 1 ? '管理员' : '普通用户'}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><strong>状态:</strong> {user.status}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><strong>注册时间:</strong> {formatDate(user.CreatedAt)}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><strong>最后更新:</strong> {formatDate(user.UpdatedAt)}</Typography>
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="h6" gutterBottom>该用户的文章列表:</Typography>
            {user.articles && user.articles.length > 0 ? (
              <List>{user.articles.map((article: IArticle) => (<ListItem key={article.ID} divider><ListItemText primary={article.title} secondary={`创建于: ${formatDate(article.CreatedAt)}`} /></ListItem>))}</List>
            ) : (<Typography>该用户暂无文章</Typography>)}
          </Box>
        </Paper>
      </Box>
      <UserEditModal open={isModalOpen} user={user} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent><DialogContentText>你确定要永久删除用户 "{user.username}" 吗？此操作不可撤销。</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)}>取消</Button>
          <Button onClick={handleDeleteUser} color="error" autoFocus>确认删除</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetailPage;
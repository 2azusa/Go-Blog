import { useState, useEffect } from 'react'; // --- 步骤 1: 导入 useRef ---
import { Link as RouterLink } from 'react-router-dom';
import { usersApi } from '../services/api'; 
import { 
  Box, Typography, Paper, List, ListItemText, Alert, CircularProgress, 
  TablePagination, Divider, ListItemButton, TextField, Button, InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import type { IUser, IReqFindUser, IReqAddUser } from '../utils/types';
import UserAddModal from '../layout/UserAddModal';
import type { INewUser } from '../layout/UserAddModal';

const UserListPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


 useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestData: IReqFindUser = {
          idorname: submittedSearch,
          pagenum: page + 1,
          pagesize: rowsPerPage,
        };
        
        const response = await usersApi.getUsers(requestData);
        const result = response.data; // result 的类型现在是 IApiResponse<IUser[]>

        if (result && result.status === 200) {
          // --- FIXED: 直接从 result.data 获取用户数组 ---
          setUsers(result.data || []);
          // --- FIXED: 直接从 result.total 获取总数 ---
          setTotalUsers(result.total || 0);
        } else {
          setError(result.message || '获取用户列表失败');
          setUsers([]);
          setTotalUsers(0);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '网络错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage, submittedSearch]);

  const handleSearch = () => {
    setPage(0);
    setSubmittedSearch(searchTerm);
  };

  const handleAddUser = async (newUser: INewUser) => {
    if (!newUser.password) {
      setError('密码不能为空，请重新输入。');
      return; 
    }
    try {
      const postData: IReqAddUser = {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
        role: newUser.role,
      };
      
      await usersApi.addUser(postData);
      
      setIsAddModalOpen(false);
      // 刷新列表
      setSubmittedSearch('');
      setSearchTerm('');
      setPage(0);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '添加用户失败';
      setError(errorMessage);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderContent = () => {
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    if (!users.length) return <Typography sx={{ mt: 2, textAlign: 'center' }}>暂无用户数据</Typography>;
    
    return (
      <List sx={{ p: 0 }}>
        {users.map((user) => (
          <ListItemButton key={user.ID} component={RouterLink} to={`/userdetail/${user.ID}`} divider>
            <ListItemText primary={user.username} secondary={`ID: ${user.ID} | 邮箱: ${user.email}`} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  return (
    <>
      <Box sx={{ p: 3, maxWidth: 900, margin: 'auto' }}>
        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom>用户管理</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <TextField 
                label="按ID或用户名搜索" 
                variant="outlined" 
                size="small" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
                InputProps={{ 
                  endAdornment: (<InputAdornment position="end"><SearchIcon /></InputAdornment>), 
                }} 
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddModalOpen(true)}>添加用户</Button>
            </Box>
            <Divider />
            {renderContent()}
          </Box>
          <TablePagination 
            rowsPerPageOptions={[5, 10, 15, 25]} 
            component="div" 
            count={totalUsers} 
            rowsPerPage={rowsPerPage} 
            page={page} 
            onPageChange={handleChangePage} 
            onRowsPerPageChange={handleChangeRowsPerPage} 
            labelRowsPerPage="每页行数:" 
          />
        </Paper>
      </Box>
      <UserAddModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddUser} />
    </>
  );
};

export default UserListPage;
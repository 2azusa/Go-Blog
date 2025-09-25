import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Alert, 
  CircularProgress,
  TablePagination
} from '@mui/material';

interface IUser {
  ID: number;
  username: string;
  role: number;
}

interface IUserApiResponse {
  status: number,
  data: IUser[];
  total: number;
  message: string;
}

const UserListPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0); // 当前页码
  const [rowsPerPage, setRowsPerPage] = useState(10); // 每页显示的数量
  const [totalUsers, setTotalUsers] = useState(0); // 用户总数

  useEffect(() => {
    const fetchUsers = async () => {

      try {
        const requestData = {
          IdOrName: "",
          pageNum: page + 1,
          pageSize: rowsPerPage,
        };

        const response = await api.post<IUserApiResponse>('/users', requestData);
        const result = response.data;

        if (result && result.status === 200) {
          setUsers(result.data || []);
          setTotalUsers(result.total);
          setError(null);
        } else {
          setError(result.message || '获取用户列表失败');
          setUsers([]);
          setTotalUsers(0);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '发生未知网络错误';
        setError(errorMessage);
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage]); // 当页面变化时，重新获取数据

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4}}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }
    if (users.length === 0) {
      return <Typography sx={{ mt: 2, textAlign: 'center' }}>暂无用户数据</Typography>
    }
    
    return (
            <List>
        {users.map((user) => (
          <ListItem key={user.ID} divider>
            <ListItemText 
              primary={`用户名: ${user.username}`} 
              secondary={`ID: ${user.ID} - 角色代码: ${user.role}`} 
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            用户列表
          </Typography>
          {renderContent()}
        </Box>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]} // 设置每页可选数量
          component="div"
          count={totalUsers} // 总记录数
          rowsPerPage={rowsPerPage} // 当前每页数量
          page={page} // 当前页码
          onPageChange={handleChangePage} // 页码改变事件
          onRowsPerPageChange={handleChangeRowsPerPage} // 每页数量改变事件
          labelRowsPerPage="每页行数:"
        />
      </Paper>
    </Box>
  );
};

export default UserListPage;
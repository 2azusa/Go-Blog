

// import { useState, useEffect } from 'react';
// import api from '../services/api';
// import { Box, Typography, Paper, List, ListItem, ListItemText, Alert, CircularProgress } from '@mui/material';

// interface IUser {
//   ID: number;
//   username: string;
//   role: number;
// }

// // --- 修改 1: 移除 'code' 属性，并将 'status' 设为必需 ---
// interface IUserApiResponse {
//   status: number; // <--- 修改点
//   data: IUser[];
//   total: number;
//   message: string;
// }

// const UserListPage = () => {
//   const [users, setUsers] = useState<IUser[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = window.sessionStorage.getItem('token');
//       if (!token) {
//         setError('您尚未登录，无法获取用户数据。');
//         setLoading(false);
//         return;
//       }
      
//       try {
//         setLoading(true);
//         const response = await api.get<IUserApiResponse>('/users');
//         const result = response.data;

//         // --- 修改 2: 简化判断逻辑，直接使用 'status' ---
//         if (result && result.status === 200) { // <--- 修改点：更简洁、更严格
//           setUsers(result.data);
//           setError(null);
//         } else {
//           setError(result.message || '获取用户列表失败');
//         }

//       } catch (err: any) {
//         const errorMessage = err.response?.data?.message || err.message || '发生未知网络错误';
//         setError(errorMessage);
//         console.error("Failed to fetch users:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // --- Render Logic 部分无需修改，保持原样 ---
//   const renderContent = () => {
//     if (loading) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//           <CircularProgress />
//         </Box>
//       );
//     }

//     if (error) {
//       return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
//     }

//     if (users.length === 0) {
//       return <Typography sx={{ mt: 2 }}>暂无用户数据。</Typography>;
//     }
    
//     return (
//       <List>
//         {users.map((user) => (
//           <ListItem key={user.ID} divider>
//             <ListItemText 
//               primary={`用户名: ${user.username}`} 
//               secondary={`ID: ${user.ID} - 角色代码: ${user.role}`} 
//             />
//           </ListItem>
//         ))}
//       </List>
//     );
//   };
  
//   return (
//     <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h5" component="h1" gutterBottom>
//           用户列表
//         </Typography>
//         {renderContent()}
//       </Paper>
//     </Box>
//   );
// };

// export default UserListPage;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Avatar, Container, Button, Box } from '@mui/material';
import axios from 'axios'; 

interface Category {
    id: number,
    name: string,
}
interface ProfileInfo {
    avatar: string
}

const TopBar = () => {
  // 1. 状态管理: 使用 useState 替代 data
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);

  // 2. 路由导航: 使用 useNavigate 替代 this.$router
  const navigate = useNavigate();

  // 3. API 请求和生命周期: 使用 useEffect 替代 created
  useEffect(() => {
    // 将 async 函数定义在 useEffect 内部
    const fetchCategoryList = async () => {
      try {
        const { data: result } = await axios.get('/api/category'); // 假设 API 前缀为 /api
        if (result.status === 200) {
          setCategoryList(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const { data: result } = await axios.get('/api/profile');
        if (result.status === 200) {
          setProfileInfo(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchCategoryList();
    fetchProfile();
  }, []); // 空依赖数组 [] 意味着这个 effect 只在组件首次挂载时运行一次

  // 4. 方法: 直接在组件内部定义函数
  const handleLogout = () => {
    window.sessionStorage.clear();
    navigate('/login');
  };

  const handleRefresh = () => {
    // $router.go(0) 等同于页面刷新
    window.location.reload(); 
    // 或者使用 navigate(0)，在 React Router v6.4+ 中可用
  }

  // 5. 渲染: 使用 JSX 和 MUI 组件
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.dark' }}>
      <Toolbar>
        <Avatar
          sx={{ marginX: 6, cursor: 'pointer' }}
          src={profileInfo?.avatar}
          onClick={handleRefresh}
        />
        <Container sx={{ display: 'flex', alignItems: 'center', py: 0 }}>
          <Button color="inherit" onClick={() => navigate('/home')}>
            首页
          </Button>
          {/* 使用 .map() 替代 v-for */}
          {categoryList.map((item) => (
            <Button
              key={item.id}
              color="inherit"
              onClick={() => navigate(`/home/${item.id}`)}
            >
              {item.name}
            </Button>
          ))}
        </Container>
        
        {/* 使用 Box 来辅助布局，将退出按钮推到右侧 */}
        <Box sx={{ flexGrow: 1 }} /> 

        <Button color="error" variant="contained" onClick={handleLogout}>
          退出
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
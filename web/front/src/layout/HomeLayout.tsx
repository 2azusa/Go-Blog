import { Outlet } from 'react-router-dom';
// FIX: 从导入中移除了 Grid
import { Box, Container, Paper, CssBaseline } from '@mui/material';

import ProfileCard from './Nav/Nav'; 
import TopBar from './TopBar/TopBar';
import Footer from './Footer/Footer';

const HomeLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      <TopBar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          backgroundColor: 'grey.100',
        }}
      >
        <Container maxWidth="xl">
          {/* 
            FIX: 这里是关键的修改！
            我们用一个 <Box> 替代了 <Grid container>。
            - display: 'flex' 启动了 Flexbox 布局。
            - flexDirection: 在手机上是 'column' (垂直堆叠)，在电脑上是 'row' (水平排列)。
            - gap: 2 完美替代了 spacing={2}，用于创建间距。
          */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2 
            }}
          >

            {/* 
              FIX: 用 <Box> 替代左侧的 <Grid item>
              - width: 在手机上是 100%，在电脑上是 25% (等同于 3/12 列)。
            */}
            <Box sx={{ width: { xs: '100%', md: '25%' } }}> 
              <ProfileCard />
            </Box>

            {/* 
              FIX: 用 <Box> 替代右侧的 <Grid item>
              - width: 在手机上是 100%，在电脑上是 75% (等同于 9/12 列)。
            */}
            <Box sx={{ width: { xs: '100%', md: '75%' } }}>
              <Paper
                sx={{
                  minHeight: '80vh',
                  p: 3,
                  borderRadius: 2,
                }}
              >
                <Outlet />
              </Paper>
            </Box>
            
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomeLayout;
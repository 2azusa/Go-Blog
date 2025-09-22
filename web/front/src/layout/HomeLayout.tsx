import { Outlet } from 'react-router-dom';

import { Box, Container, Grid, Paper, CssBaseline } from '@mui/material';

import Nav from './Nav/Nav';
import Header from './TopBar/TopBar';
import Footer from './Footer/Footer';


const HomeLayout = () => {
  return (
    // 使用 Box 作为根容器，并设置 flex 布局使其充满整个页面
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* CssBaseline 用于重置和统一浏览器默认样式 */}
      <CssBaseline />
      
      {/* 顶部栏 */}
      <TopBar />

      {/* 主内容区域，对应 <v-main> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // 让 main 区域占据所有剩余的垂直空间
          py: 3, // 添加一些垂直内边距 (padding-top/bottom)
          backgroundColor: 'grey.100', // 对应 'grey lighten-3'
        }}
      >
        <Container maxWidth="xl"> {/* 使用 Container 限制最大宽度并居中 */}
          {/* 栅格系统，对应 <v-row> */}
          <Grid container spacing={2}> {/* spacing={2} 添加列之间的间距 */}

            {/* 左侧导航栏，对应 <v-col cols="3"> */}
            <Grid item xs={12} md={3}> {/* 在中等屏幕(md)及以上占3列，在小屏幕(xs)上占满12列 */}
              <SideNav />
              {/* 在这里还可以添加 ProfileCard 等其他侧边栏组件 */}
              {/* <ProfileCard /> */}
            </Grid>

            {/* 右侧内容区，对应 <v-col cols="9"> */}
            <Grid item xs={12} md={9}>
              {/* 使用 Paper 组件模拟 <v-sheet> 的外观 */}
              <Paper
                sx={{
                  minHeight: '80vh',
                  p: 3, // 添加内边距
                  borderRadius: 'lg', // 对应 rounded="lg"
                }}
              >
                {/* 
                  这里是关键！
                  <Outlet /> 会渲染当前路由匹配到的子组件，
                  例如 ArticleListPage 或 ArticleDetailPage。
                  它完美替代了 <router-view>。
                */}
                <Outlet />
              </Paper>
            </Grid>
            
          </Grid>
        </Container>
      </Box>

      {/* 页脚 */}
      <Footer />
    </Box>
  );
};
export default HomeLayout;
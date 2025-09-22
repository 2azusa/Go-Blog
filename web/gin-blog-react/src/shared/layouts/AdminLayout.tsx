import React from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { toggleCollapse } from '../../store/slices/uiSlice';

import Nav from '../components/Nav/Nav';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';


const { Content } = Layout;

const AdminLayout: React.FC = () => {
  const collapsed = useSelector((state: RootState) => state.ui.collapsed);
  const dispatch = useDispatch();

  const handleToggleCollapse = () => {
    dispatch(toggleCollapse());
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Nav /> {/* 侧边栏导航 */}
      <Layout className="site-layout">
        <Layout.Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggleCollapse}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Header /> {/* 顶部内容，包含退出按钮 */}
        </Layout.Header>
        <Content style={{ margin: '24px 16px', overflow: 'initial' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet /> {/* 渲染嵌套路由的内容 */}
          </div>
        </Content>
        <Footer /> {/* 底部页脚 */}
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../utils/store';
import { toggleCollapse } from '../utils/store/slices/uiSlice';

import Navigate from './Navigate/Navigate';
import Footer from './Footer/Footer';
import Header from './Header/Header';

const { Content, Header: AntHeader, Footer: AntFooter } = Layout;

const AdminLayout: React.FC = () => {
    const collapsed = useSelector((state: RootState) => state.ui.collapsed);
    const dispatch = useDispatch();

    const handleToggleCollapse = () => {
        dispatch(toggleCollapse());
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navigate collapsed={collapsed} onToggleCollapse={handleToggleCollapse} />
            <Layout>
                <AntHeader style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'flex-end', // 保持右侧内容靠右对齐
                    alignItems: 'center',
                    position: 'relative', // 1. 将 Header 设置为相对定位，作为标题定位的基准
                }}>
                    {/* 2. 添加居中标题 */}
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}>
                        Blog Admin
                    </div>

                    {/* 右侧的用户信息部分 */}
                    <Header />
                </AntHeader>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#fff',
                    }}
                >
                    <Outlet />
                </Content>

                <AntFooter style={{ padding: 0, background: '#fff' }}>
                    <Footer />
                </AntFooter>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
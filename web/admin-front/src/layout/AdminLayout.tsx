import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import Navigate from '../layout/Navitage/Navigate';
import Footer from '../layout/Footer/Footer';
import Header from '../layout/Header/Header';

const { Content, Header: AntHeader, Footer: AntFooter } = Layout;

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();

    interface MenuClickEventArgs {
        key: string;
    }

    // 菜单点击处理函数
    const handleMenuClick = (e: MenuClickEventArgs) => {
        navigate(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navigate collapsed={collapsed} onMenuClick={handleMenuClick} />
            <Layout>
                <AntHeader style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                        style: { fontSize: '18px', cursor: 'pointer' }
                    })}

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
                    {/* 子路由内容在这里渲染 */}
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
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import styled from '@emotion/styled';
import {
    ProjectOutlined,
    DashboardOutlined,
    SnippetsOutlined,
    BookOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

// 为 Logo 增加点击样式
const Logo = styled.div`
    color: #fff;
    text-align: center;
    line-height: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
    cursor: pointer; /* 添加鼠标指针样式，提示用户可以点击 */
    transition: background 0.3s;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

// 扩展 props 接口，接收一个 onToggleCollapse 函数
interface NavigateProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

const Navigate: React.FC<NavigateProps> = ({ collapsed, onToggleCollapse }) => {
    const location = useLocation();

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            {/* 将 onToggleCollapse 函数绑定到 Logo 的 onClick 事件 */}
            <Logo onClick={onToggleCollapse}>
                <ProjectOutlined />
                {!collapsed && <span>&nbsp;Azusa's Blog</span>}
            </Logo>
            
            <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
                <Menu.Item key="/" icon={<DashboardOutlined />}>
                    <Link to="/">仪表盘</Link>
                </Menu.Item>
                <Menu.Item key="/articlelist" icon={<SnippetsOutlined />}>
                    <Link to="/articlelist">文章管理</Link>
                </Menu.Item>
                <Menu.Item key="/catelist" icon={<BookOutlined />}>
                    <Link to="/catelist">分类管理</Link>
                </Menu.Item>
                <Menu.Item key="/userlist" icon={<UserOutlined />}>
                    <Link to="/userlist">用户列表</Link>
                </Menu.Item>
                <Menu.Item key="/profile" icon={<SettingOutlined />}>
                    <Link to="/profile">个人中心</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Navigate;
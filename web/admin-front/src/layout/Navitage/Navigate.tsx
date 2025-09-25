/** @jsxImportSource @emotion/react */
import React from 'react';
import { Layout, Menu } from 'antd';
import { css } from '@emotion/react';
import {
    ProjectOutlined,
    DashboardOutlined,
    FileOutlined,
    FormOutlined,
    SnippetsOutlined,
    BookOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;
const logoStyles = css`
    color: #fff;
    text-align: center;
    line-height: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
`;

// 定义 Antd 菜单点击事件参数的类型
interface MenuClickEventArgs {
    key: string;
}

// 定义组件的 Props 类型
interface NavigateProps {
    collapsed: boolean;
    onMenuClick: (e: MenuClickEventArgs) => void;
}

const Navigate: React.FC<NavigateProps> = ({ collapsed, onMenuClick }) => {
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div css={logoStyles}>
                <ProjectOutlined />
                {!collapsed && <span>&nbsp;My Blog</span>}
            </div>
            
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['/']} onClick={onMenuClick}>
                <Menu.Item key="/" icon={<DashboardOutlined />}>
                    仪表盘
                </Menu.Item>
                <SubMenu key="/article" icon={<FileOutlined />} title="文章管理">
                    <Menu.Item key="/addart" icon={<FormOutlined />}>
                        写文章
                    </Menu.Item>
                    <Menu.Item key="/artlist" icon={<SnippetsOutlined />}>
                        文章列表
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="/catelist"icon={<BookOutlined />}>
                    分类管理
                </Menu.Item>
                <Menu.Item key="/userlist" icon={<UserOutlined />}>
                    用户列表
                </Menu.Item>
                <Menu.Item key="/profile" icon={<SettingOutlined />}>
                    个人中心
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Navigate;
import React, { useState, useEffect } from 'react';
// 【修正】从 antd 导入组件和必要的类型
import { Layout, Menu, type MenuProps } from 'antd';
import {
  ProjectOutlined,
  DashboardOutlined,
  FileOutlined,
  FormOutlined,
  SnippetsOutlined,
  BookOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
// 【修正】使用了正确的相对路径和 'import type'
import type { RootState } from '../../../store';

import styles from './Nav.module.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

// 【修正】为 Menu onClick 事件的参数定义一个类型别名
type MenuItemClickEvent = Parameters<Required<MenuProps>['onClick']>[0];

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useSelector((state: RootState) => state.ui.collapsed);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean); // e.g., ['admin', 'artlist']

    // 默认打开的 SubMenu key
    if (path.startsWith('/admin/art')) {
      setOpenKeys(['article-management']);
    } else {
      setOpenKeys([]);
    }

    // 设置选中的 MenuItem key
    if (pathSegments.length > 1) {
      // 适用于 /admin/artlist, /admin/addart, /admin/catelist 等
      setSelectedKeys([pathSegments[pathSegments.length - 1]]);
    } else if (path === '/admin') {
      // 仪表盘
      setSelectedKeys(['dashboard']);
    } else {
      setSelectedKeys([]);
    }
  }, [location.pathname]);

  // 【修正】为 handleMenuClick 的参数 'e' 添加了正确的类型
  const handleMenuClick = (e: MenuItemClickEvent) => {
    // 导航逻辑可以简化，直接使用 key 作为路径的一部分
    const pathMap: { [key: string]: string } = {
      'dashboard': '/admin',
      'addart': '/admin/addart',
      'artlist': '/admin/artlist',
      'category-list': '/admin/catelist',
      'user-list': '/admin/userlist',
    };
    if (pathMap[e.key]) {
      navigate(pathMap[e.key]);
    }
  };

  const onOpenChange = (keys: string[]) => {
    // 保持只有一个 SubMenu 展开
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (['article-management'].indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className={styles.logo}>
        <ProjectOutlined /> {!collapsed && <span>&nbsp;My Blog</span>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={handleMenuClick}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          仪表盘
        </Menu.Item>
        <SubMenu key="article-management" icon={<FileOutlined />} title="文章管理">
          <Menu.Item key="addart" icon={<FormOutlined />}>
            写文章
          </Menu.Item>
          <Menu.Item key="artlist" icon={<SnippetsOutlined />}>
            文章列表
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="category-list" icon={<BookOutlined />}>
          分类列表
        </Menu.Item>
        <Menu.Item key="user-list" icon={<UserOutlined />}>
          用户列表
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Nav;
import React from 'react';
import { Button, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { toggleCollapse } from '../../../store/slices/uiSlice';
import type { RootState } from '../../../store';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { collapsed } = useSelector((state: RootState) => state.ui);

    function loginOut() {
        sessionStorage.clear(); // 清除所有 sessionStorage 数据
        navigate('/'); // 导航到登陆页
    }

    const handleToggle = () => {
        dispatch(toggleCollapse());
    };

    return (
        <AntHeader style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
                type="text"
                icon={React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                onClick={handleToggle}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <Button type="primary" danger style={{ marginRight: '24px' }} onClick={loginOut}>
                退出
            </Button>
        </AntHeader>
    );
};

export default Header;
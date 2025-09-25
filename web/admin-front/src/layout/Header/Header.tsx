import React from 'react';
import { Button } from 'antd'; // 从 antd 导入 Button 组件
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate hook

const Header: React.FC = () => {
    // const {collapsed, setCollapsed} = useState(false);
    const navigate = useNavigate();
    
    const loginOut = () => {
        window.sessionStorage.clear();

        navigate('/login');
    }

    return (
        <div>
            <Button type="primary" danger className="beaderBtn" onClick={loginOut}>
                退出
            </Button>
        </div>
    );
};

export default Header;
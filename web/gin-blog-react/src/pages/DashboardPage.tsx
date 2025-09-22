import React from 'react';
import { Card } from 'antd'; // 引入 Card 组件，保持页面风格一致

// import styles from './Dashboard.module.css'; // 导入样式模块 (如果需要)

const DashboardPage: React.FC = () => {
  return (
    <Card>
      <h3>欢迎来到GINBLOG后台管理页面</h3>
    </Card>
  );
};

export default DashboardPage;

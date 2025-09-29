import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { usersApi } from '../api/api';
import {
  Card,
  List,
  Alert,
  Pagination,
  Divider,
  Input,
  Button,
  Space,
  Empty
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import type { IUser, IReqFindUser, IReqAddUser } from '../types/types';
import UserAddModal from '../components/UserAddModal';
import type { INewUser } from '../components/UserAddModal';

const { Search } = Input;

const UserListPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- 关键改动: Antd 分页从 1 开始 ---
  const [page, setPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestData: IReqFindUser = {
          idorname: searchTerm,
          // --- API 请求也使用从 1 开始的页码 ---
          pagenum: page, 
          pagesize: pageSize,
        };
        
        const response = await usersApi.getUsers(requestData);
        const result = response.data;

        if (result && result.status === 200) {
          setUsers(result.data || []);
          setTotalUsers(result.total || 0);
        } else {
          setError(result.message || '获取用户列表失败');
          setUsers([]);
          setTotalUsers(0);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '网络错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize, searchTerm]); // 触发条件变为 searchTerm

  // Input.Search 的 onSearch 事件处理函数
  const handleSearch = (value: string) => {
    setPage(1); // 搜索时重置到第一页
    setSearchTerm(value);
  };

  const handleAddUser = async (newUser: INewUser) => {
    // ... (handleAddUser 逻辑基本不变)
    if (!newUser.password) {
      setError('密码不能为空，请重新输入。');
      return; 
    }
    try {
      const postData: IReqAddUser = {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
        role: newUser.role,
      };
      
      await usersApi.addUser(postData);
      
      setIsAddModalOpen(false);
      // 刷新列表
      setSearchTerm(''); // 触发 useEffect 重新加载
      setPage(1);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '添加用户失败';
      setError(errorMessage);
    }
  };

  // Pagination 的 onChange 事件处理函数
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const renderContent = () => {
    if (error) return <Alert message={error} type="error" showIcon style={{ marginTop: 16 }} />;
    // antd 的 List 组件自带 loading 状态
    if (!loading && !users.length) return <Empty description="暂无用户数据" />;
    
    return (
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              // 将标题包裹在 Link 中以实现跳转
              title={<RouterLink to={`/userdetail/${user.ID}`}>{user.username}</RouterLink>}
              description={`ID: ${user.ID} | 邮箱: ${user.email}`}
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <>
      <div style={{ padding: 24, maxWidth: 900, margin: 'auto' }}>
        <Card title="用户管理">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Search
                placeholder="按ID或用户名搜索"
                onSearch={handleSearch}
                style={{ width: 250 }}
                enterButton
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                添加用户
              </Button>
            </Space>
            
            <Divider />

            {/* Spin 组件可以包裹加载中的区域，但 List 自带 loading 属性更方便 */}
            {renderContent()}

            <Pagination
              style={{ marginTop: 20, textAlign: 'right' }}
              current={page}
              pageSize={pageSize}
              total={totalUsers}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
              pageSizeOptions={[5, 10, 15, 25]}
            />
          </Space>
        </Card>
      </div>
      <UserAddModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddUser} />
    </>
  );
};

export default UserListPage;
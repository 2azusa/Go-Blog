import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { usersApi } from '../../api/api';
import {
  Card,
  List,
  Alert,
  Pagination,
  Divider,
  Input,
  Button,
  Space,
  Empty,
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import type { IReqUser, IRspUser, IReqPagination } from '../../types/types';
import UserAddModal from '../../components/UserAddModal';

const { Search } = Input;

const UserListPage = () => {
  const [users, setUsers] = useState<IRspUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 1. 将数据获取逻辑封装到一个 useCallback 函数中
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const requestData: IReqPagination = {
        query: searchTerm,
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
  }, [page, pageSize, searchTerm]); // 依赖项与之前 useEffect 相同

  // 2. useEffect 现在只负责调用这个函数
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // 依赖项变为 fetchUsers 函数本身

  // Input.Search 的 onSearch 事件处理函数
  const handleSearch = (value: string) => {
    setPage(1); // 搜索时重置到第一页
    setSearchTerm(value);
  };

  const handleAddUser = async (newUser: IReqUser) => {
    // ... (handleAddUser 逻辑基本不变)
    if (!newUser.password) {
      setError('密码不能为空，请重新输入。');
      return; 
    }
    try {
      const postData: IReqUser = {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
        role: newUser.role,
      };
      
      await usersApi.addUser(postData);
      
      message.success('用户添加成功！');
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '添加用户失败';
      message.error(errorMessage);
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
              title={<RouterLink to={`/userdetail/${user.id}`}>{user.username}</RouterLink>}
              description={`ID: ${user.id} | 邮箱: ${user.email}`}
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
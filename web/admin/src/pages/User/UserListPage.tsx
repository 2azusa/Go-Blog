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
import type { IReqUser, IRspUser, IReqPagination } from '../../api/types';

// 引入我们创建的通用组件
import EntityFormModal from '../../components/EntityFormModal';
import UserFormFields from '../../components/UserFormFields';

const { Search } = Input;

const UserListPage = () => {
  const [users, setUsers] = useState<IRspUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (value: string) => {
    setPage(1);
    setSearchTerm(value);
  };

  const handleAddUser = async (newUser: IReqUser) => {
    setSaving(true);
    try {
      await usersApi.addUser(newUser);
      message.success('用户添加成功！');
      setIsAddModalOpen(false);
      fetchUsers(); // 刷新列表
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '添加用户失败';
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const renderContent = () => {
    if (error) return <Alert message={error} type="error" showIcon style={{ marginTop: 16 }} />;
    if (!loading && !users.length) return <Empty description="暂无用户数据" />;
    
    return (
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
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
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Search
                placeholder="按ID或用户名搜索"
                onSearch={handleSearch}
                style={{ width: 250 }}
                enterButton
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                添加用户
              </Button>
            </div>
            
            <Divider />

            {renderContent()}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalUsers}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
                pageSizeOptions={[5, 10, 15, 25]}
              />
            </div>
          </Space>
        </Card>
      </div>

      <EntityFormModal<IReqUser>
        open={isAddModalOpen}
        title="添加新用户"
        loading={saving}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddUser}
      >
        <UserFormFields mode="add" />
      </EntityFormModal>
    </>
  );
};

export default UserListPage;
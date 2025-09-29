import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersApi } from '../api/api';
import {
  Card,
  Spin,
  Alert,
  Result,
  Button,
  Divider,
  Descriptions,
  List,
  Typography,
  Space,
  Modal,
  Empty
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import type { IUser, IArticle, IReqEditUser } from '../types/types';
import UserEditModal from '../components/UserEditModal'; 
const { Title } = Typography;

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- 关键改动: 不再需要 isConfirmOpen state ---

  useEffect(() => {
    // ... fetchUserInfo 逻辑完全不变
    const fetchUserInfo = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getUserInfo(parseInt(id, 10));
        const result = response.data;
        if (result && result.status === 200) {
          setUser(result.data);
        } else {
          setError(result.message || '获取用户详情失败');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '网络错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [id]);

  // ... handleSaveUser 逻辑不变
  const handleSaveUser = async (updatedUser: IUser) => {
    try {
      const postData: IReqEditUser = {
        id: updatedUser.ID,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      };
      const response = await usersApi.updateUser(updatedUser.ID, postData);
      if (response.data && response.data.status === 200) {
        setUser(response.data.data);
      } else {
        setError(response.data.message || '更新用户失败');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '更新请求发生网络错误';
      setError(errorMessage);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    try {
      await usersApi.deleteUser(user.ID);
      navigate('/userlist');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '删除用户失败';
      setError(errorMessage);
      // 可以在这里加一个 antd 的 message.error(errorMessage) 提示
    }
  };

  // --- 使用 Modal.confirm 替代 Dialog ---
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: '确认删除',
      content: `你确定要永久删除用户 "${user?.username}" 吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        return handleDeleteUser();
      },
    });
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  if (error) return <Alert message={error} type="error" showIcon style={{ margin: 24 }} />;
  if (!loading && !user) return <Result status="404" title="未找到该用户" subTitle="抱歉，我们找不到您要查找的用户信息。" />;

  return (
    <>
      <div style={{ padding: 24, maxWidth: 800, margin: 'auto' }}>
        <Spin spinning={loading}>
          <Card
            title="用户详情"
            extra={
              <Space>
                <Button type="primary" icon={<EditOutlined />} onClick={() => setIsModalOpen(true)}>
                  修改信息
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>
                  删除用户
                </Button>
              </Space>
            }
          >
            {user && (
              <>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="ID">{user.ID}</Descriptions.Item>
                  <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
                  <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
                  <Descriptions.Item label="角色">{user.role === 1 ? '管理员' : '普通用户'}</Descriptions.Item>
                  <Descriptions.Item label="状态">{user.status}</Descriptions.Item>
                  <Descriptions.Item label="注册时间">{formatDate(user.CreatedAt)}</Descriptions.Item>
                  <Descriptions.Item label="最后更新">{formatDate(user.UpdatedAt)}</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={5}>该用户的文章列表:</Title>
                {user.articles && user.articles.length > 0 ? (
                  <List
                    bordered
                    dataSource={user.articles}
                    renderItem={(article: IArticle) => (
                      <List.Item>
                        <List.Item.Meta
                          title={article.title}
                          description={`创建于: ${formatDate(article.CreatedAt)}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="该用户暂无文章" />
                )}
              </>
            )}
          </Card>
        </Spin>
      </div>
      <UserEditModal open={isModalOpen} user={user} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />
    </>
  );
};

export default UserDetailPage;
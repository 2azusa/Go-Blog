import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersApi } from '../../api/api';
import {
  Card,
  Spin,
  Alert,
  Result,
  Button,
  Divider,
  Descriptions,
  Typography,
  Space,
  Modal,
  message
} from 'antd';

const { Title } = Typography;
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { IReqUser, IRspUser } from '../../types/types';
import EntityFormModal from '../../components/EntityFormModal';
import UserFormFields from '../../components/UserFormFields';

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<IRspUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async (userId: number) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getUserInfo(userId);
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
    }
    if (id) {
      fetchUserInfo(Number(id));
    }
  }, [id]);

  const handleSaveUser = async (updatedUser: IReqUser) => {
    if (!id) return;

    try {
      const postData: IReqUser = {
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      };
      const response = await usersApi.updateUser(Number(id), postData);

      if (response.data && response.data.status === 200) {
        message.success('用户信息更新成功！');
        setIsModalOpen(false);
        const fetchUpdateUser = async (userId: number) => {
          try {
            const res = await usersApi.getUserInfo(userId);
            if (res.data && res.data.status === 200) {
              setUser(res.data.data);
            }
          } catch(e) {
            setError('刷新用户信息失败');
          }
        }
        fetchUpdateUser(Number(id));
      } else {
        setError(response.data.message || '更新用户失败');
      } 
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '更新请求发生网络错误';
      setError(errorMessage);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!user) return;
    try {
      await usersApi.deleteUser(userId);
      message.success('用户已成功删除');
      navigate('/userlist'); // 跳转到用户列表页
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '删除用户失败';
      setError(errorMessage);
      message.error(errorMessage);
    }
  };

  // --- 使用 Modal.confirm 替代 Dialog ---
  const showDeleteConfirm = () => {
    if (!user || !id) return;
    Modal.confirm({
      title: '确认删除',
      content: `你确定要永久删除用户 "${user?.username}" 吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        return handleDeleteUser(Number(id));
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
                  <Descriptions.Item label="ID">{id}</Descriptions.Item>
                  <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
                  <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
                  <Descriptions.Item label="角色">{user.role === 1 ? '管理员' : '普通用户'}</Descriptions.Item>
                  {/* <Descriptions.Item label="状态">{user.status}</Descriptions.Item> */}
                  <Descriptions.Item label="注册时间">{formatDate(user.createdAt)}</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={5}>该用户的文章列表:</Title>
                {/* {user.articles && user.articles.length > 0 ? (
                  <List
                    bordered
                    dataSource={user.articles}
                    renderItem={(article: IRspArticle) => (
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
                )} */}
              </>
            )}
          </Card>
        </Spin>
      </div>
      <EntityFormModal<IReqUser>
        open={isModalOpen}
        title="编辑用户信息"
        loading={saving}
        initialValues={user}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      >
        <UserFormFields mode="edit" />
      </EntityFormModal>
    </>
  );
};

export default UserDetailPage;
import { useState, useEffect } from 'react';
import {
  Card,
  Spin,
  Alert,
  Button,
  Descriptions,
  message,
  Image,
  Empty
} from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { profileApi } from '../../api/api';
import type { IReqProfile, IRspProfile } from '../../api/types';

// 引入我们创建的通用组件
import EntityFormModal from '../../components/EntityFormModal';
import ProfileFormFields from '../../components/ProfileFormFields';

const ProfilePage = () => {
  const [profile, setProfile] = useState<IRspProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await profileApi.getProfile();
        const result = response.data;
        if (result && result.status === 200) {
          setProfile(result.data);
        } else {
          setError(result.message || '获取个人资料失败');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '网络错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (values: IReqProfile) => {
    setSaving(true);
    try {
      await profileApi.updateProfile(values);
      message.success('个人资料更新成功！');
      setIsModalOpen(false);
      setProfile(prevProfile => (prevProfile ? { ...prevProfile, ...values } : null));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '更新失败';
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (error) {
      return <Alert message={error} type="error" showIcon style={{ margin: 24 }} />;
    }
    if (!profile) {
      return <Empty description="暂无个人资料信息" />;
    }
    return (
      <Descriptions bordered column={1}>
        <Descriptions.Item label="昵称">{profile.name}</Descriptions.Item>
        <Descriptions.Item label="个人简介">{profile.desc}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{profile.email}</Descriptions.Item>
        <Descriptions.Item label="QQ">{profile.qqchat || '未填写'}</Descriptions.Item>
        <Descriptions.Item label="微信">{profile.wechat || '未填写'}</Descriptions.Item>
        <Descriptions.Item label="微博">{profile.weibo || '未填写'}</Descriptions.Item>
        <Descriptions.Item label="头像">
          {profile.avatar ? <Image width={100} src={profile.avatar} alt="Avatar" /> : '未设置'}
        </Descriptions.Item>
        <Descriptions.Item label="背景图">
          {profile.img ? <Image width={200} src={profile.img} alt="Background" /> : '未设置'}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <>
      <div style={{ padding: 24, maxWidth: 900, margin: 'auto' }}>
        <Spin spinning={loading}>
          <Card
            title="个人资料设置"
            extra={
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsModalOpen(true)}
                disabled={!profile}
              >
                编辑资料
              </Button>
            }
          >
            {renderContent()}
          </Card>
        </Spin>
      </div>

      <EntityFormModal<IReqProfile>
        open={isModalOpen}
        title="编辑个人资料"
        loading={saving}
        initialValues={profile}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      >
        <ProfileFormFields />
      </EntityFormModal>
    </>
  );
};

export default ProfilePage;
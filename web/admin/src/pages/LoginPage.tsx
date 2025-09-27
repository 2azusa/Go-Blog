// src/pages/LoginPage.tsx

import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authApi } from '../services/api';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import type { IReqLogin } from '../utils/types';

// The form data interface remains the same
interface IFormData {
  username: string;
  password: string;
}

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IFormData>(); // Ant Design's form hook
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // For button loading state

  const onFinish = async (formData: IFormData) => {
    setApiError(null);
    setLoading(true);

    try {
      const postData: IReqLogin = {
        username: formData.username,
        password: formData.password,
      };
      const { data: result } = await authApi.login(postData);

      if (result.status !== 200) {
        setApiError(result.message || '登录失败，请重试');
        return;
      }

      if (result.token) {
        window.sessionStorage.setItem('token', result.token);
        navigate('/'); // Login success, navigate to homepage
      } else {
        setApiError('登录成功但未收到 Token');
      }
    } catch (error: any) {
      const specificMessage = error.response?.data?.message || '登录失败，请检查您的用户名和密码';
      setApiError(specificMessage);
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  const handleReset = () => {
    form.resetFields();
    setApiError(null);
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          欢迎登录
        </Title>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          {apiError && <Alert message={apiError} type="error" showIcon style={{ marginBottom: 24 }} />}
          
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 4, message: '用户名长度必须在4-12之间' },
              { max: 12, message: '用户名长度必须在4-12之间' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码长度必须在6-20之间' },
              { max: 20, message: '密码长度必须在6-20之间' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  登录
                </Button>
              </Space>
            </div>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <RouterLink to="/register">还没有账户？点击注册</RouterLink>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
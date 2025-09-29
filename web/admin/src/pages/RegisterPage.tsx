// src/pages/RegisterPage.tsx

import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { authApi } from '../api/api';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import type { IReqRegister } from '../types/types';

// Form data interface for registration
interface IFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm<IFormData>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (formData: IFormData) => {
    setApiError(null);
    setApiSuccess(null);
    setLoading(true);

    try {
      const postData: IReqRegister = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      };
      const { data: result } = await authApi.register(postData);

      if (result.status !== 200) {
        setApiError(result.message || '注册失败，请重试');
        return;
      }
      setApiSuccess('注册成功！您可以返回登录页面了。');
      form.resetFields();
    } catch (error: any) {
      const specificMessage = error.response?.data?.message || '注册失败，用户名或邮箱可能已被占用';
      setApiError(specificMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setApiError(null);
    setApiSuccess(null);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', padding: '20px 0' }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          创建新账户
        </Title>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
        >
          {apiError && <Alert message={apiError} type="error" showIcon style={{ marginBottom: 24 }} />}
          {apiSuccess && <Alert message={apiSuccess} type="success" showIcon style={{ marginBottom: 24 }} />}
          
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
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
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

          <Form.Item
            name="confirmPassword"
            dependencies={['password']} // 声明依赖于 'password' 字段
            rules={[
              { required: true, message: '请再次输入密码!' },
              // 自定义校验逻辑
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve(); // 校验通过
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!')); // 校验失败
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  注册
                </Button>
              </Space>
            </div>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <RouterLink to="/login">已有账户？返回登录</RouterLink>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
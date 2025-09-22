import React from 'react';
import { Form, Input, Button, message, type FormProps } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../../../api/request'; // <-- IMPORTANT: Adjust this relative path if needed
import { AxiosError } from 'axios';

// Move the CSS module into this folder as well and update the import path
import styles from './Login.module.css';

interface LoginFormValues {
  username: string;
  password: string;
}

interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  token?: string;
  data?: T;
}

// Rename the component and use a named export
export const LoginForm: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();

  const passwordLabel = '密    码';

  const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    try {
      const { username, password } = values;
      const response = await request.post<ApiResponse>('/login', { username, password });

      if (response.data.code !== 200) {
        message.error(response.data.message || '登录失败');
      } else {
        message.success('登录成功');
        sessionStorage.setItem('token', response.data.token!);
        navigate('/admin');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || '请求失败';
      message.error(errorMessage);
    }
  };

  const onFinishFailed: FormProps<LoginFormValues>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('请输入有效的数据');
  };

  const resetForm = () => {
    form.resetFields();
  };

  // The entire JSX is moved from the original Login component
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <Form
          form={form}
          name="login"
          className={styles.loginForm}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 12, message: '用户名必须在3-12个字符之间' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入用户名"
            />
          </Form.Item>

          <Form.Item
            label={passwordLabel}
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码必须在6-20个字符之间' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入密码"
              onPressEnter={form.submit}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 19 }} className={styles.loginBtn}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              登录
            </Button>
            <Button onClick={resetForm}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
/** @jsxImportSource @emotion/react */
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 1. 使用 Emotion 定义所有样式
const containerStyle = css`
    height: 100%,
    background-color: #282c34;
    display: flex;
    justify-content: center;
    align-items: cneter;
`;

const loginBoxStyles = css`
    width: 400px;
    height: 300px;
    background-coloe: #fff;
    border-radius: 9px
    position: relative;
`
const loginFormStyles = css`
    width: 100%;
    position: absolute;
    bottom: 10%;
    padding: 0 20px;
    box-sizing: border-box;
`;

const loginBtnItemStyles = css`
    margin-bottom: 0 !important;
    .ant0form-item-control-iput-content {
        display: flex;
        justify-content: flex-end;
    }
`;

interface LoginFormValues {
    username: string;
    password: string;
}

// 2. 将 data 中的静态配置作为常量
const labelCol = { span: 4 };
const wrapperCol = { span: 19 };
const passwordLabel = '密\u00A0\u00A0\u00A0\u00A0码'; 

const LoginPage: React.FC = () => {
    // 3. 使用 antd 的 Form Hook， 处理表单状态和实例
    const [form] = Form.useForm();
    // 4. 使用 React Router 的 Hook 进行路由跳转
    const nvaigate = useNavigate();
    // 5. 定义验证规则
    const rules = {
        username: [
            { required: true, message: '请输入用户名' },
            { min: 3, max: 12, message: '用户名长度为3-12位'},
        ],
        password: [
            { required: true, message: '请输入密码' },
            { min: 6, max: 20, message: '密码长度为6-20位' },
        ],
    };

    // 重置表单字段
    const resetForm = () => {
        form.resetFields();
    };

    // 6.使用 antd Form 的 onFinisb 事件处理登陆，在验证登陆后触发
    const handleLogin = async (values: LoginFormValues) => {
        try {
            const { data: result } = await axios.post('login', values);
            if (result.code != 200) {
                return message.error(result.message);
            }
            message.success('登陆成功');
            window.sessionStorage.setItem('token', result.data.token);
            nvaigate('/index');
        } catch(error) {
            message.error('登陆失败');
            console.error('Login Error: ', error);
        }
    };

    return (
        <div css={containerStyle}>
            <div css={loginBoxStyles}>
                <Form
                    css={loginFormStyles}
                    form={form} // 关联 form 实例
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    onFinish={handleLogin} // 验证后执行
                >
                    <Form.Item name="username" label="用户名" rules={rules.username}>
                        <Input
                            placeholder="请输入用户名"
                            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        />
                    </Form.Item>
                    <Form.Item name="password" label={passwordLabel} rules={rules.password}>
                        <Input.Password
                            placeholder="请输入密码"
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)'}} />}
                            onPressEnter={() => form.submit()} // 支持回车登陆
                        />
                    </Form.Item>
                    <Form.Item css={loginBtnItemStyles} wrapperCol={{ offset: labelCol.span, span: wrapperCol.span}}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                            登陆
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

export default LoginPage;
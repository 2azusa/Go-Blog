import { Form, Input, Select } from 'antd';

const { Option } = Select;

// 添加一个 mode 属性，用于区分“添加”和“编辑”模式
interface UserFormFieldsProps {
  mode: 'add' | 'edit';
}

const UserFormFields = ({ mode }: UserFormFieldsProps) => (
  <>
    <Form.Item
      name="username"
      label="用户名"
      rules={[{ required: true, message: '请输入用户名!' }]}
    >
      <Input />
    </Form.Item>

    {/* 仅在“添加”模式下显示密码输入框 */}
    {mode === 'add' && (
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password />
      </Form.Item>
    )}

    <Form.Item
      name="email"
      label="邮箱"
      rules={[
        { required: true, message: '请输入邮箱!' },
        { type: 'email', message: '请输入有效的邮箱地址!' }
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="role"
      label="角色"
      // 为新用户设置默认角色
      initialValue={2}
      rules={[{ required: true, message: '请选择一个角色!' }]}
    >
      <Select>
        <Option value={1}>管理员</Option>
        <Option value={2}>普通用户</Option>
      </Select>
    </Form.Item>
  </>
);

export default UserFormFields;
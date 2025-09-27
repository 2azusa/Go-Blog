import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';

import type { IUser } from '../utils/types'; // 假设 IUser 类型定义在这里

const { Option } = Select;

interface UserEditModalProps {
  open: boolean;
  user: IUser | null;
  onClose: () => void;
  onSave: (user: IUser) => void;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const UserEditModal = ({ open, user, onClose, onSave }: UserEditModalProps) => {
  // 1. 初始化 Ant Design 表单实例
  const [form] = useForm<IUser>();

  // 2. 使用 useEffect 来监听外部 user prop 的变化，并更新表单
  useEffect(() => {
    if (open && user) {
      // 当弹窗打开且有用户信息时，用该用户信息填充表单
      form.setFieldsValue(user);
    }
  }, [open, user, form]);

  // 3. 处理点击“保存”按钮的逻辑
  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        // 确保提交的是一个完整的 IUser 对象
        // values 只包含表单中的字段，需要和原始 user 对象（尤其是 id）合并
        if (user) {
          onSave({ ...user, ...values });
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    // 4. 使用 Ant Design 的 Modal
    <Modal
      open={open}
      title="编辑用户信息"
      okText="保存"
      cancelText="取消"
      onCancel={onClose}
      onOk={handleOk}
      // 添加 destroyOnClose 可以在关闭时销毁内部组件，避免状态残留
      destroyOnClose 
    >
      {/* 5. 使用 Ant Design 的 Form */}
      <Form
        form={form}
        {...formItemLayout}
        name="userEditForm"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>

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
          rules={[{ required: true, message: '请选择一个角色!' }]}
        >
          <Select>
            <Option value={1}>管理员</Option>
            <Option value={2}>普通用户</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
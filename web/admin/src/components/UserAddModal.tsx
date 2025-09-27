import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

// antd 的 Form 组件有自己的 hooks
import { useForm } from 'antd/es/form/Form';

const { Option } = Select;

export interface INewUser {
  username: string;
  password?: string;
  email: string;
  role: number;
}

interface UserAddModalProps {
  open: boolean;
  onClose: () => void;
  // onSave 回调现在可以接收 antd Form 格式化的值
  onSave: (values: INewUser) => void;
}

// antd 的 Form.Item 有很好的布局功能
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const UserAddModal = ({ open, onClose, onSave }: UserAddModalProps) => {
  // 1. 使用 antd 的 useForm hook
  const [form] = useForm<INewUser>();

  // 2. 在弹窗打开时，重置表单字段
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  // 3. 表单提交成功后的回调
  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onSave(values); // 直接将表单收集到的数据传递出去
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    // 4. 使用 antd 的 Modal 组件
    <Modal
      open={open}
      title="添加新用户"
      okText="保存"
      cancelText="取消"
      onCancel={onClose}
      onOk={handleOk} // Modal 的 onOk 事件会触发 handleOk
    >
      {/* 5. 使用 antd 的 Form 组件 */}
      <Form
        form={form}
        {...formItemLayout}
        initialValues={{ role: 2 }} // 设置表单初始值
        name="userAddForm"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
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

export default UserAddModal;
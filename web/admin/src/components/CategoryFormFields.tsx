import { Form, Input } from 'antd';

const CategoryFormFields = () => (
  <Form.Item
    name="name"
    label="分类名称"
    rules={[{ required: true, message: '分类名称不能为空!' }]}
  >
    <Input placeholder="请输入分类名称" />
  </Form.Item>
);

export default CategoryFormFields;
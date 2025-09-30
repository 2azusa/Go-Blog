import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Modal, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';

// 定义组件的 props 接口
interface EntityFormModalProps<T> {
  // 控制模态框是否可见
  open: boolean;
  // 模态框的标题
  title: string;
  // “保存”按钮的加载状态
  loading?: boolean;
  // 表单的初始值 (用于编辑场景)
  initialValues?: T | null;
  // 关闭模态框时的回调函数
  onClose: () => void;
  // 点击“保存”并校验成功后的回调函数
  onSave: (values: T) => void;
  // 子元素，即具体的表单项 <Form.Item>
  children: ReactNode;
}

// 使用泛型 <T> 来确保表单数据的类型安全
const EntityFormModal = <T extends object>({
  open,
  title,
  loading = false,
  initialValues,
  onClose,
  onSave,
  children,
}: EntityFormModalProps<T>) => {
  // 1. 获取 antd 的 form 实例
  const [form] = useForm<T>();

  // 2. 使用 useEffect 监听模态框的打开和关闭
  useEffect(() => {
    if (open) {
      // 如果是编辑模式 (提供了 initialValues)，则填充表单
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        // 否则 (添加模式)，重置表单
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  // 3. 处理点击“保存”按钮的逻辑
  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        // 校验成功后，调用父组件传入的 onSave 方法
        onSave(values as T);
      })
      .catch(info => {
        console.log('表单校验失败:', info);
      });
  };

  return (
    <Modal
      open={open}
      title={title}
      okText="保存"
      cancelText="取消"
      onCancel={onClose}
      onOk={handleOk}
      // 将外部的 loading 状态绑定到“保存”按钮上
      confirmLoading={loading}
      // 关闭时销毁 Modal 里的子元素，可有效避免状态残留问题
      destroyOnClose
      // 强制渲染 Form，以配合 destroyOnClose 正常工作
      forceRender
    >
      <Form form={form} layout="vertical" name="entity_form">
        {/* 在这里渲染从外部传入的表单项 */}
        {children}
      </Form>
    </Modal>
  );
};

export default EntityFormModal;
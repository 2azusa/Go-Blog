import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { categoryApi } from '../../api/api';
import {
  Card,
  List,
  Alert,
  Pagination,
  Divider,
  Button,
  Space,
  Empty,
  Modal,
  Form,
  Input
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { IRspCategory, IReqPagination } from '../../types/types';

// --- 步骤 1: 迁移 CategoryAddModal 组件 ---
interface ICategoryAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newCategoryName: string) => void;
  loading: boolean;
}

const CategoryAddModal: React.FC<ICategoryAddModalProps> = ({ open, onClose, onSave, loading }) => {
  const [form] = Form.useForm();

  // 当弹窗关闭时，清空表单，避免下次打开时残留数据
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onSave(values.name);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={open}
      title="添加新分类"
      okText="保存"
      cancelText="取消"
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading} // 将外部 loading 状态绑定到确认按钮
      destroyOnHidden// 关闭时销毁 Modal 里的子元素
    >
      <Form form={form} layout="vertical" name="categoryAddForm">
        <Form.Item
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '分类名称不能为空!' }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// --- 步骤 2: 迁移 CateListPage 页面 ---
const CateListPage = () => {
  const [categories, setCategories] = useState<IRspCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false); // 用于添加分类时的 loading 状态
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // antd 分页从 1 开始
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);
  
  // 用于触发数据刷新的状态
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestData: IReqPagination  = {
          pagenum: page, // 直接使用 state 中的 page
          pagesize: pageSize,
        };
        const response = await categoryApi.getCategories(requestData);
        const result = response.data;

        if (result && result.status === 200) {
          setCategories(result.data || []);
          setTotalCategories(result.total || 0);
        } else {
          setError(result.message || '获取分类列表失败');
          setCategories([]);
          setTotalCategories(0);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '网络错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, pageSize, refreshTrigger]);

  const handleAddCategory = async (newCategoryName: string) => {
    setSaving(true);
    try {
      await categoryApi.addCategory({ name: newCategoryName });
      setIsAddModalOpen(false);
      // 如果当前不在第一页，添加成功后最好跳回第一页查看最新项
      if (page !== 1) {
        setPage(1);
      } else {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '添加分类失败';
      // 可以在 Modal 内部显示错误，或者在页面顶部显示
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };
  
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const renderContent = () => {
    if (error) return <Alert message={error} type="error" showIcon style={{ marginTop: 16 }} />;
    if (!loading && !categories.length) return <Empty description="暂无分类数据" />;

    return (
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={categories}
        renderItem={(category) => (
          <List.Item>
            <List.Item.Meta
              title={<RouterLink to={`/catedetail/${category.id}`}>{category.name}</RouterLink>}
              description={`ID: ${category.id}`}
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <>
      <div style={{ padding: 24, maxWidth: 900, margin: 'auto' }}>
        <Card
          title="分类管理"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
              添加分类
            </Button>
          }
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Divider style={{ margin: 0 }} />
            {renderContent()}
            <Pagination
              style={{ marginTop: 20, textAlign: 'right' }}
              current={page}
              pageSize={pageSize}
              total={totalCategories}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
              pageSizeOptions={[5, 10, 15, 25]}
            />
          </Space>
        </Card>
      </div>
      <CategoryAddModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddCategory}
        loading={saving}
      />
    </>
  );
};

export default CateListPage;
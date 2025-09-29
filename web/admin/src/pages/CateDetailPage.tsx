// src/pages/CateDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryApi } from '../api/api';
import {
  Card,
  Spin,
  Alert,
  Result,
  Button,
  Divider,
  Descriptions,
  List,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  Empty
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ICategory, IRspFindArticle } from '../types/types';

const { Title } = Typography;

// --- 步骤 1: 迁移 CategoryEditModal 组件 ---
interface ICategoryEditModalProps {
  open: boolean;
  category: ICategory | null;
  onClose: () => void;
  onSave: (newName: string) => void;
}

const CategoryEditModal: React.FC<ICategoryEditModalProps> = ({ open, category, onClose, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // 当弹窗打开且有分类数据时，设置表单的初始值
    if (open && category) {
      form.setFieldsValue({ name: category.name });
    }
  }, [open, category, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onSave(values.name);
        onClose(); // 保存成功后关闭弹窗
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={open}
      title="编辑分类"
      okText="保存"
      cancelText="取消"
      onCancel={onClose}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="categoryEditForm">
        <Form.Item
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '分类名称不能为空!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// --- 步骤 2: 迁移 CateDetailPage 页面 ---
const CateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<ICategory | null>(null);
  const [articles, setArticles] = useState<IRspFindArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // 删除确认弹窗的状态不再需要

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      // ... API 请求逻辑不变 ...
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const categoryId = parseInt(id, 10);
        const [categoryResponse, articlesResponse] = await Promise.all([
          categoryApi.findCategoryById(categoryId),
          categoryApi.getArticlesByCategory(categoryId)
        ]);
        
        if (categoryResponse.data && categoryResponse.data.status === 200) {
          setCategory(categoryResponse.data.data);
        } else {
          throw new Error(categoryResponse.data.message || '获取分类详情失败');
        }

        if (articlesResponse.data && articlesResponse.data.status === 200) {
          setArticles(articlesResponse.data.data.articles || []);
        } else {
          setError('获取文章列表失败: ' + (articlesResponse.data.message || '未知错误'));
          setArticles([]);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '网络错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryDetails();
  }, [id]); 

  const handleSaveCategory = async (newName: string) => {
    // ... 保存逻辑不变 ...
    if (!category) return;
    try {
      const response = await categoryApi.editCategory(category.id, { name: newName });
      if (response.data && response.data.status === 200) {
        setCategory(response.data.data);
      } else {
        setError(response.data.message || '更新分类失败');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '更新请求发生网络错误';
      setError(errorMessage);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteCategory = async () => {
    // ... 删除逻辑不变 ...
    if (!category) return;
    try {
      await categoryApi.deleteCategory(category.id);
      navigate('/catelist');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '删除分类失败';
      setError(errorMessage);
    }
  };

  // 使用 Modal.confirm 替代删除确认 Dialog
  const showDeleteConfirm = () => {
    if (!category) return;
    Modal.confirm({
      title: '确认删除',
      content: `你确定要永久删除分类 "${category.name}" 吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        return handleDeleteCategory();
      },
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  // 优先处理错误和未找到的情况
  if (error && !category && !loading) return <Alert message={error} type="error" showIcon style={{ margin: 24 }} />;
  if (!category && !loading) return <Result status="404" title="未找到该分类" subTitle="抱歉，我们找不到您要查找的分类信息。" />;

  return (
    <>
      <div style={{ padding: 24, maxWidth: 800, margin: 'auto' }}>
        <Spin spinning={loading}>
          <Card
            title="分类详情"
            extra={
              <Space>
                <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditModalOpen(true)}>编辑</Button>
                <Button danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>删除</Button>
              </Space>
            }
          >
            {category && (
              <>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="ID">{category.id}</Descriptions.Item>
                  <Descriptions.Item label="分类名称">{category.name}</Descriptions.Item>
                </Descriptions>
                
                <Divider />
                
                <Title level={5}>该分类下的文章:</Title>
                {articles.length > 0 ? (
                  <List
                    bordered
                    dataSource={articles}
                    renderItem={(article: IRspFindArticle) => (
                      <List.Item>
                        <List.Item.Meta
                          title={article.title}
                          description={`创建于: ${formatDate(article.CreatedAt)}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="该分类下暂无文章" />
                )}
              </>
            )}
          </Card>
        </Spin>
      </div>
      
      <CategoryEditModal 
        open={isEditModalOpen} 
        category={category} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleSaveCategory} 
      />
    </>
  );
};

export default CateDetailPage;
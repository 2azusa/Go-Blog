// src/pages/CateDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryApi } from '../../api/api';
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
import type { IReqCategory, IReqPagination, IRspArticle, IRspCategory } from '../../types/types';

const { Title } = Typography;
const { Search } = Input;

// --- CategoryEditModal 组件 (无改动) ---
interface ICategoryEditModalProps {
  open: boolean;
  // 修正: category 的类型应为 IRspCategory，因为它包含了 id
  category: IRspCategory | null;
  onClose: () => void;
  onSave: (newName: string) => void;
}

const CategoryEditModal: React.FC<ICategoryEditModalProps> = ({ open, category, onClose, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && category) {
      form.setFieldsValue({ name: category.name });
    }
  }, [open, category, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onSave(values.name);
        onClose();
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


// --- CateDetailPage 页面 (已更新) ---
const CateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 修正: category 的类型应为 IRspCategory
  const [category, setCategory] = useState<IRspCategory | null>(null);
  const [articles, setArticles] = useState<IRspArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 新增: 用于文章标题搜索的状态
  const [submittedSearch, setSubmittedSearch] = useState('');

  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const categoryId = parseInt(id, 10);
        
        // 定义包含标题搜索和分页的请求参数
        const requestParams: IReqPagination = {
          title: submittedSearch, // 新增: 搜索标题
          pagenum: page,
          pagesize: pageSize,
        };

        const [categoryResponse, articlesResponse] = await Promise.all([
          categoryApi.findCategoryById(categoryId),
          categoryApi.getArticlesByCategory(categoryId, requestParams)
        ]);
        
        if (categoryResponse.data && categoryResponse.data.status === 200) {
          setCategory(categoryResponse.data.data);
        } else {
          throw new Error(categoryResponse.data.message || '获取分类详情失败');
        }

        if (articlesResponse.data && articlesResponse.data.status === 200) {
          setArticles(articlesResponse.data.data || []);
          setTotalArticles(articlesResponse.data.total || 0);
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
  }, [id, page, pageSize, submittedSearch]); // 依赖项中加入 submittedSearch

  // 修正: 编辑分类的保存逻辑
  const handleSaveCategory = async (newName: string) => {
    if (!category) return;
    try {
      // 构造请求数据，符合 IReqCategory 接口
      const requestData: IReqCategory = { name: newName };
      const response = await categoryApi.editCategory(category.id, requestData);
      
      // API 成功响应但 data 为 null
      if (response.data && response.data.status === 200) {
        // 手动更新前端状态以立即显示更改
        setCategory(prevCategory => 
          prevCategory ? { ...prevCategory, name: newName } : null
        );
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
  
  // 删除分类逻辑 (已确认无误)
  const handleDeleteCategory = async () => {
    if (!category) return;
    try {
      await categoryApi.deleteCategory(category.id);
      navigate('/catelist'); // 成功后跳转
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '删除分类失败';
      setError(errorMessage);
    }
  };

  const showDeleteConfirm = () => {
    if (!category) return;
    Modal.confirm({
      title: '确认删除',
      content: `你确定要永久删除分类 "${category.name}" 吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleDeleteCategory(),
    });
  };

  // 新增: 处理文章标题搜索
  const handleArticleSearch = (value: string) => {
    setPage(1); // 搜索时重置到第一页
    setSubmittedSearch(value);
  };
  
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
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
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Title level={5} style={{ margin: 0 }}>该分类下的文章:</Title>
                   {/* 新增: 文章标题搜索框 */}
                  <Search
                    placeholder="搜索文章标题"
                    onSearch={handleArticleSearch}
                    style={{ width: 240 }}
                    enterButton
                  />
                </div>

                {articles.length > 0 ? (
                  <List
                    bordered
                    dataSource={articles}
                    renderItem={(article: IRspArticle) => (
                      <List.Item>
                        <List.Item.Meta
                          title={article.title}
                          description={`创建于: ${formatDate(article.createdAt)}`}
                        />
                      </List.Item>
                    )}
                    pagination={{
                      current: page,
                      pageSize: pageSize,
                      total: totalArticles,
                      onChange: handlePageChange,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total) => `共 ${total} 条`,
                      pageSizeOptions: ['5', '10', '20'],
                    }}
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
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
  Input,
  Empty
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { IReqCategory, IReqPagination, IRspArticle, IRspCategory } from '../../types/types';

// 引入新的可复用组件
import EntityFormModal from '../../components/EntityFormModal'; 
import CategoryFormFields from '../../components/CategoryFormFields';

const { Title } = Typography;
const { Search } = Input;

const CategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<IRspCategory | null>(null);
  const [articles, setArticles] = useState<IRspArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false); // 用于编辑保存时的loading状态

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const categoryId = parseInt(id, 10);
        
        const requestParams: IReqPagination = {
          title: submittedSearch,
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
  }, [id, page, pageSize, submittedSearch]);

  const handleSaveCategory = async (values: IReqCategory) => {
    if (!category) return;
    setSaving(true);
    try {
      const response = await categoryApi.editCategory(category.id, values);
      if (response.data && response.data.status === 200) {
        setCategory(prev => prev ? { ...prev, name: values.name } : null);
        setIsEditModalOpen(false);
      } else {
        setError(response.data.message || '更新分类失败');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '更新请求发生网络错误';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteCategory = async () => {
    if (!category) return;
    try {
      await categoryApi.deleteCategory(category.id);
      navigate('/categorylist');
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

  const handleArticleSearch = (value: string) => {
    setPage(1);
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
      
      <EntityFormModal<IReqCategory>
        open={isEditModalOpen}
        title="编辑分类"
        loading={saving}
        initialValues={category}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCategory}
      >
        <CategoryFormFields />
      </EntityFormModal>
    </>
  );
};

export default CategoryDetailPage;
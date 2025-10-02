import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { categoryApi } from '../../api/api';
import {
  Card,
  List,
  Alert,
  Pagination,
  Divider,
  Button,
  Empty,
  message // 引入 message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { IRspCategory, IReqPagination, IReqCategory } from '../../api/types';

// 引入我们创建的通用组件
import EntityFormModal from '../../components/EntityFormModal';
import CategoryFormFields from '../../components/CategoryFormFields';

const CategoryListPage = () => {
  const [categories, setCategories] = useState<IRspCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);
  
  // 使用 useCallback 封装数据获取逻辑
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const requestData: IReqPagination  = {
        pagenum: page,
        pagesize: pageSize,
      };
      const { data: result } = await categoryApi.getCategories(requestData);
      if (result && result.status === 200) {
        setCategories(result.data || []);
        setTotalCategories(result.total || 0);
      } else {
        setError(result.message || '获取分类列表失败');
        setCategories([]);
        setTotalCategories(0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '发生未知网络错误');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]); // 依赖项

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // useEffect 只负责调用

  // EntityFormModal 的 onSave 会传递一个对象，所以参数需要调整
  const handleAddCategory = async (values: IReqCategory) => {
    setSaving(true);
    try {
      await categoryApi.addCategory({ name: values.name });
      message.success('分类添加成功！');
      setIsAddModalOpen(false);
      // 添加成功后，刷新列表
      if (page !== 1) {
        setPage(1); // 如果不在第一页，跳回第一页
      } else {
        fetchCategories(); // 如果在第一页，直接刷新
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '添加分类失败';
      message.error(errorMessage); // 使用 message 提示错误
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
              title={<RouterLink to={`/categorydetail/${category.id}`}>{category.name}</RouterLink>}
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
          <Divider style={{ marginTop: 0, marginBottom: '1px' }} />
          {renderContent()}
          
          {/* 使用 Flexbox 将分页组件推到右侧 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalCategories}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
              pageSizeOptions={[5, 10, 15, 25]}
            />
          </div>
        </Card>
      </div>

      {/* 使用通用的 EntityFormModal 组件 */}
      <EntityFormModal<IReqCategory>
        open={isAddModalOpen}
        title="添加新分类"
        loading={saving}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCategory}
      >
        <CategoryFormFields />
      </EntityFormModal>
    </>
  );
};

export default CategoryListPage;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesApi } from '../api/api';
import type { IRspFindArticle, IReqFindArticle } from '../types/types';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Alert,
  Empty
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

const { Search } = Input;

const ArticleListPage = () => {
  const [articles, setArticles] = useState<IRspFindArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 用于提交给 API 的搜索词
  const [submittedSearch, setSubmittedSearch] = useState('');

  // antd 分页状态，从 1 开始
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestData: IReqFindArticle = {
          title: submittedSearch,
          pagenum: page,
          pagesize: pageSize,
        };
        
        const { data: result } = await articlesApi.getArticles(requestData);

        if (result && result.status === 200) {
          setArticles(result.data.articles || []);
          setTotalArticles(result.data.total || 0);
        } else {
          setError(result.message || '获取文章列表失败');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '发生未知网络错误');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, pageSize, submittedSearch]); // 当这些状态变化时重新获取数据

  const handleSearch = (value: string) => {
    setPage(1); // 搜索时回到第一页
    setSubmittedSearch(value);
  };

  const handleDelete = async (id: number) => {
    try {
      await articlesApi.deleteArticle(id);
      // 如果当前页只剩一条数据且不是第一页，删除后返回上一页
      if (articles.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        // 否则，重新触发当前页的加载
        // 通过改变一个状态来强制 useEffect 重新运行
        setSubmittedSearch(prev => prev); // 这是一个小技巧，也可以用一个专用的 refresh state
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '删除失败');
    }
  };

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这篇文章吗？此操作不可撤销。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleDelete(id),
    });
  };

  // antd Table 的分页变化处理
  const handleTableChange: TableProps<IRspFindArticle>['onChange'] = (pagination) => {
    setPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  // 定义 Table 的列
  const columns: TableProps<IRspFindArticle>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '分类', dataIndex: 'name', key: 'name', render: (name) => name || '未分类' },
    { 
      title: '创建时间', 
      dataIndex: 'CreatedAt', 
      key: 'CreatedAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" onClick={() => navigate(`/article/${record.id}`)}>详情</Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/article/edit/${record.id}`)} />
          <Button size="small" icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Search
              placeholder="搜索文章标题"
              onSearch={handleSearch}
              style={{ width: 300 }}
              enterButton
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/article/create')}
            >
              写文章
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={articles}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: totalArticles,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            onChange={handleTableChange}
            locale={{ emptyText: <Empty description="暂无文章数据" /> }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default ArticleListPage;
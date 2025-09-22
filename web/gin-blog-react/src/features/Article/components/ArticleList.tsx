import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Input, Button, Select, Table, message, Modal, type TableProps, type TablePaginationConfig } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from '../../../api/request';

// It's a good practice to move shared styles to the feature folder as well
import styles from './ArtList.module.css'; 

const { Search } = Input;
const { Option } = Select;

import type { Article, Category } from '../../../shared/types';

// Rename the component and use a named export
export const ArticleList: React.FC = () => {
  const navigate = useNavigate();
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [cateList, setCateList] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20'],
    showTotal: (total) => `共${total}条`,
  });
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const columns: TableProps<Article>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: '10%', key: 'id', align: 'center' },
    { title: '分类', dataIndex: 'name', width: '15%', key: 'name', align: 'center' },
    { title: '文章标题', dataIndex: 'title', width: '20%', key: 'title', align: 'center' },
    { title: '文章描述', dataIndex: 'desc', width: '20%', key: 'desc', align: 'center' },
    {
      title: '缩略图',
      dataIndex: 'img',
      width: '15%',
      key: 'img',
      align: 'center',
      render: (img: string) => <img src={img} style={{ width: '120px', height: '90px' }} alt="thumbnail" />,
    },
    {
      title: '操作',
      width: '20%',
      key: 'action',
      align: 'center',
      render: (_, record: Article) => (
        <div className={styles.actionSlot}>
          <Button type="primary" style={{ marginRight: '15px' }} onClick={() => navigate(`/admin/addart/${record.id}`)}>
            编辑
          </Button>
          <Button type="primary" danger onClick={() => deleteArticle(record.id)}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  const getArticleList = useCallback(async () => {
    setLoading(true);
    try {
      const params: { pagesize: number; pagenum: number; title: string; cate_id?: number } = {
        pagesize: pagination.pageSize!,
        pagenum: pagination.current!,
        title: searchTitle,
      };
      if (selectedCategory) {
        params.cate_id = selectedCategory;
      }

      const { data: result } = await request.get('articles', { params });
      if (result.status !== 200) {
        return message.error(result.message || '获取文章列表失败');
      }
      setArticleList(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      message.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination, searchTitle, selectedCategory]);

  const getCateList = async () => {
    try {
      const { data: result } = await request.get('category');
      if (result.status !== 200) {
        return message.error(result.message || '获取分类列表失败');
      }
      setCateList(result.data);
    } catch {
      message.error('获取分类列表失败');
    }
  };

  const deleteArticle = (id: number) => {
    Modal.confirm({
      title: '确定要删除吗？',
      content: '一旦删除，无法恢复',
      onOk: async () => {
        try {
          const { data: result } = await request.delete(`article/${id}`);
          if (result.status !== 200) {
            return message.error(result.message || '删除失败');
          }
          message.success('删除成功');
          getArticleList();
        } catch {
          message.error('删除失败');
        }
      },
      onCancel: () => {
        message.info('已取消删除');
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchTitle(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleCategoryChange = (value: number | undefined) => {
    setSelectedCategory(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  useEffect(() => {
    getArticleList();
  }, [getArticleList]);

  useEffect(() => {
    getCateList();
  }, []);

  return (
    <div>
      <h3>文章列表</h3>
      <Card>
        <Row gutter={20} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Search
              placeholder="请输入文章标题查找"
              enterButton
              onSearch={handleSearch}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={() => navigate('/admin/addart')}>
              新增
            </Button>
          </Col>
          <Col span={4} offset={10}>
            {/* 【修正】使用 placeholder 替代 defaultValue */}
            <Select
              placeholder="请选择分类"
              style={{ width: 130 }}
              onChange={handleCategoryChange}
              value={selectedCategory}
              allowClear
            >
              {cateList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleList}
          pagination={pagination}
          loading={loading}
          bordered
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};
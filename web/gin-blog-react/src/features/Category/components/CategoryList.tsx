import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Input, Button, Table, message, Modal, Form, type TableProps, type TablePaginationConfig } from 'antd';
import request from '../../../api/request'; // <-- IMPORTANT: Adjust this relative path if needed

const { Search } = Input;

import type { Category } from '../../../shared/types';

// Rename the component to CategoryList and use a named export
export const CategoryList: React.FC = () => {
  const [form] = Form.useForm();
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const columns: TableProps<Category>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: '25%', align: 'center' },
    { title: '分类名称', dataIndex: 'name', key: 'name', width: '50%', align: 'center' },
    {
      title: '操作',
      key: 'action',
      width: '25%',
      align: 'center',
      render: (_, record) => (
        <>
          <Button type="primary" style={{ marginRight: '15px' }} onClick={() => showModal(record)}>
            编辑
          </Button>
          <Button type="primary" danger onClick={() => deleteCate(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const getCateList = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result } = await request.get('category', {
        params: {
          pagesize: pagination.pageSize,
          pagenum: pagination.current,
          name: searchQuery,
        },
      });
      if (result.status !== 200) {
        return message.error(result.message || '获取分类列表失败');
      }
      setCateList(result.data);
      setPagination(prev => ({ ...prev, total: result.total }));
    } catch {
      message.error('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const deleteCate = (id: number) => {
    Modal.confirm({
      title: '确定要删除此分类吗？',
      content: '删除后无法恢复',
      onOk: async () => {
        try {
          const { data: result } = await request.delete(`category/${id}`);
          if (result.status !== 200) {
            return message.error(result.message || '删除失败');
          }
          message.success('删除成功');
          getCateList();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const showModal = (category: Category | null) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category ? category.name : '' });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const handleModalOk = async (values: { name: string }) => {
    try {
      const requestPromise = editingCategory
        ? request.put(`category/${editingCategory.id}`, { name: values.name })
        : request.post('category/add', { name: values.name });
      
      const { data: result } = await requestPromise;

      if (result.status !== 200) {
        return message.error(result.message || (editingCategory ? '更新失败' : '新增失败'));
      }
      
      message.success(editingCategory ? '更新成功' : '新增成功');
      setIsModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
      getCateList();
    } catch {
      message.error('操作失败，请重试');
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  useEffect(() => {
    getCateList();
  }, [getCateList]);

  // The JSX is copied directly from the original file
  return (
    <div>
      <h3>分类列表</h3>
      <Card>
        <Row gutter={20} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Search placeholder="请输入分类名查找" enterButton onSearch={handleSearch} />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={() => showModal(null)}>新增分类</Button>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={cateList}
          pagination={pagination}
          loading={loading}
          bordered
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleModalCancel}
        destroyOnClose // Use destroyOnClose to reset form state when modal is closed
      >
        <Form form={form} onFinish={handleModalOk} layout="vertical">
          <Form.Item
            label="分类名称"
            name="name"
            rules={[
              { required: true, message: '请输入分类名称' },
              { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Input, Button, Table, message, Modal, Form, Select, type TableProps, type TablePaginationConfig } from 'antd';
import request from '../../../api/request'; // 调整后的相对路径
import styles from './UserList.module.css'; // 假设 CSS 模块也移动到了此文件夹

const { Search } = Input;
const { Option } = Select;

import type { User } from '../../../shared/types';

// 组件使用命名导出
export const UserList: React.FC = () => {
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1, pageSize: 5, total: 0, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'], showTotal: (total) => `共${total}条`,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const columns: TableProps<User>['columns'] = [
    { title: 'ID', dataIndex: 'ID', width: '10%', key: 'id', align: 'center' },
    { title: '用户名', dataIndex: 'username', width: '20%', key: 'username', align: 'center' },
    { title: '角色', dataIndex: 'role', width: '20%', key: 'role', align: 'center', render: (role: number) => (role === 1 ? '管理员' : '订阅者')},
    { title: '邮箱', dataIndex: 'email', width: '20%', key: 'email', align: 'center' },
    {
      title: '操作', width: '20%', key: 'action', align: 'center',
      render: (_, record: User) => (
        <div className={styles.actionSlot}>
          <Button type="primary" style={{ marginRight: '15px' }} onClick={() => showEditModal(record.ID)}>编辑</Button>
          <Button type="primary" danger onClick={() => deleteUser(record.ID)}>删除</Button>
        </div>
      ),
    },
  ];

  const validateUsername = (_: unknown, value: string) => {
    if (!value) return Promise.reject(new Error('请输入用户名'));
    if (value.length < 4 || value.length > 12) return Promise.reject(new Error('用户名长度应该在4-12位之间'));
    return Promise.resolve();
  };

  const validatePassword = (_: unknown, value: string) => {
    if (!value) return Promise.reject(new Error('请输入密码'));
    if (value.length < 6 || value.length > 20) return Promise.reject(new Error('密码长度应该在6-20位之间'));
    return Promise.resolve();
  };

  const validateEmail = (_: unknown, value: string) => {
    if (value && !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
      return Promise.reject(new Error('请输入正确的邮箱'));
    }
    return Promise.resolve();
  };

  const getUserList = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result } = await request.post('users', {
        pagesize: pagination.pageSize,
        pagenum: pagination.current,
        idorname: searchQuery,
      });
      if (result.status !== 200) return message.error(result.message || '获取用户列表失败');
      setUserList(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch { 
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination, searchQuery]);

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const deleteUser = (id: number) => {
    Modal.confirm({
      title: '确定要删除吗？',
      content: '一旦删除，无法恢复',
      onOk: async () => {
        try {
          const { data: result } = await request.delete(`user/${id}`);
          if (result.status !== 200) return message.error(result.message || '删除失败');
          message.success('删除成功');
          getUserList();
        } catch { 
          message.error('删除失败');
        }
      },
      onCancel: () => message.info('已取消删除'),
    });
  };

  const showAddModal = () => {
    addForm.resetFields();
    setIsAddModalOpen(true);
  };

  const handleAddOk = async (values: User) => {
    try {
      const { data: result } = await request.post('user/add', values);
      if (result.status !== 200) return message.error(result.message || '添加失败');
      message.success('添加成功');
      setIsAddModalOpen(false);
      getUserList();
    } catch { 
      message.error('输入不符合要求，请重新输入');
    }
  };

  const handleAddCancel = () => {
    addForm.resetFields();
    setIsAddModalOpen(false);
    message.info('新增用户已取消');
  };

  const showEditModal = async (id: number) => {
    try {
      const { data: result } = await request.get(`user/${id}`);
      if (result.status !== 200) return message.error(result.message || '获取用户信息失败');
      const userData = result.data as User;
      setEditingUser(userData);
      editForm.setFieldsValue({
        username: userData.username,
        role: userData.role,
        email: userData.email,
      });
      setIsEditModalOpen(true);
    } catch { 
      message.error('获取用户信息失败');
    }
  };

  const handleEditOk = async (values: Partial<User>) => {
    try {
      if (!editingUser) return;
      const payload = { ...values, ID: editingUser.ID };
      const { data: result } = await request.put(`user/${editingUser.ID}`, payload);
      if (result.status !== 200) return message.error(result.message || '更新失败');
      message.success('用户信息更新成功');
      setIsEditModalOpen(false);
      getUserList();
    } catch { 
      message.error('输入不符合要求，请重新输入');
    }
  };

  const handleEditCancel = () => {
    editForm.resetFields();
    setIsEditModalOpen(false);
    setEditingUser(null);
    message.info('编辑已取消');
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  return (
    <div>
      <h3>用户列表</h3>
      <Card>
        <Row gutter={20} style={{ marginBottom: '20px' }}>
          <Col span={6}><Search placeholder="请输入用户名或id查找" enterButton onSearch={handleSearch} /></Col>
          <Col span={4}><Button type="primary" onClick={showAddModal}>新增</Button></Col>
        </Row>
        <Table rowKey="ID" columns={columns} dataSource={userList} pagination={pagination} loading={loading} bordered onChange={handleTableChange} />
      </Card>
      <Modal title="新增用户" open={isAddModalOpen} onOk={addForm.submit} onCancel={handleAddCancel} destroyOnClose>
        <Form form={addForm} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} onFinish={handleAddOk}>
          <Form.Item label="用户名" name="username" rules={[{ validator: validateUsername, validateTrigger: 'onBlur' }]}><Input /></Form.Item>
          <Form.Item label="密码" name="password" rules={[{ validator: validatePassword, validateTrigger: 'onBlur' }]}><Input.Password /></Form.Item>
          <Form.Item label="确认密码" name="checkpass" dependencies={['password']} rules={[{ required: true, message: '请再次输入密码' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('两次输入的密码不一致!')); }, }),]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="是否为管理员" name="role" initialValue={2}><Select><Option value={1}>是</Option><Option value={2}>否</Option></Select></Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ validator: validateEmail, validateTrigger: 'onBlur' }]}><Input /></Form.Item>
        </Form>
      </Modal>
      <Modal title="编辑用户" open={isEditModalOpen} onOk={editForm.submit} onCancel={handleEditCancel} destroyOnClose>
        <Form form={editForm} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} onFinish={handleEditOk}>
          <Form.Item label="用户名" name="username"><Input readOnly /></Form.Item>
          <Form.Item label="是否为管理员" name="role"><Select><Option value={1}>是</Option><Option value={2}>否</Option></Select></Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ validator: validateEmail, validateTrigger: 'onBlur' }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
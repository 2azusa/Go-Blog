import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Table, Modal, Form, Input, message, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';

interface Category {
    id: number;
    name: string;
}

interface CategoryFormData {
    name: string;
}

const CateListPage: React.FC = () => {
    // State Hooks
    const [cateList, setCateList] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisble, setIsEditModalVisible] = useState(false)
    const [editingCate, setEditingCate] = useState<Category | null>(null);

    const [addForm] = Form.useForm<CategoryFormData>();
    const [editForm] = Form.useForm<CategoryFormData>();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        pageSizeOptions: ['5', '10', '20'],
        showSizeChange: true,
        showTotal: (total: number) => `共 ${total}条`,
    });

    // API and Logic Functions
    // 使用 useCallback 避免在组件重渲染时不必要地重新创建函数
    const getCateList = useCallback(async (page = pagination.current, size = pagination.pageSize) => {
        setLoading(true);
        try {
            const { data: result } = await axios.get('/api/category', {
                params: {
                    pagenum: page,
                    pagesize: size,
                },
            });

            if (result.status !== 200) {
                return message.error(result.message)
            }

            setCateList(result.data);
            setPagination(prev => ({ ...prev, current: page, pageSize: size, total: result.total}));
        } catch (error) {
            message.error('获取分类列表失败', );
            console.error('Get Category List Error:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination]);

    // Lifecycle Hook
    useEffect(() => {
        getCateList();
    }, [getCateList]); // 空数组表示仅在挂在时执行一次

    // Event Handlers
    // 处理表单变化
    const handleTableChange: TableProps<Category>['onChange'] = (newPagination) => {
        getCateList(newPagination.current, newPagination.pageSize);
    };

    // 删除分类
    const deleteCate = (id: number) => {
        Modal.confirm({
            title: '确定要删除吗',
            content: '一旦删除，无法恢复',
            onOk: async () => {
                try {
                    const { data: result } = await axios.delete(`/api/category/${id}`);
                    if (result.statue !== 200) return message.error(result.message);
                    message.success(`删除成功`);
                    getCateList();
                } catch (error) {
                    message.error(`删除失败`);
                    console.error('Delete Category Error:', error);
                }
            },
            onCancel: () => {
                message.info(`已取消删除`);
            },
        });
    };

    // 显示新增弹窗
    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    // 显示编辑弹窗
    const showEditModal = (category: Category) => {
        setEditingCate(category);
        editForm.setFieldsValue({ name: category.name });
        setIsEditModalVisible(true);
    };

    // 处理新增
    const handleAddOk = async() => {
        try {
            const values = await addForm.validateFields();
            const { data: result } = await axios.post(`/api/category/add`, values);
            if (result.status !== 200) return message.error(result.message);

            message.success('添加成功');
            setIsAddModalVisible(false);
            addForm.resetFields();
            getCateList()
        } catch (error) {
            console.log('Validation Failed:', error)
        }
    }

    // 处理编辑
    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            if (!editingCate) return;

            const { data: result } = await axios.put(`/api/category/${editingCate.id}`, values);
            if (result.status !== 200) return message.error(result.message);

            message.success('分类信息更新成功');
            setIsEditModalVisible(false);
            setEditingCate(null);
            getCateList();
        } catch (error) {
            console.log(`Edit Failed`, error);
        }
    };

    // Table Columns Definition
    const columns: TableProps<Category>['columns'] = [
        { title: 'ID', dataIndex: 'id', key: 'id', align: 'center', width: '10%' },
        { title: '分类名', dataIndex: 'name', key: 'name', align: 'center', width: '20%' },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: '20%',

            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px'}}>
                    <Button type="primary" onClick={() => showEditModal(record)}>编辑</Button>
                    <Button type="primary" danger onClick={() => deleteCate(record.id)}>删除</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h3>分类列表</h3>
            <Card>
                <Row gutter={[20, 20]}>
                    <Col>
                        <Button type="primary" onClick={showAddModal}>新增</Button>
                    </Col>
                </Row>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={cateList}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    style={{ marginTop: 20 }}
                />
            </Card>

            {/* 新增分类 */}
            <Modal
                title="新增分类"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    addForm.resetFields();
                    message.info('新增分类已取消');
                }}
                destroyOnHidden
            >
                <Form form={addForm} labelCol={{ span: 5}} wrapperCol={{ span: 16 }} name="addCategory">
                    <Form.Item
                        name="name"
                        label="分类名"
                        rules={[{ required: true, message: '请输入分类名' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 编辑分类 */}
            <Modal
                title="编辑分类"
                open={isEditModalVisble}
                onOk={handleEditOk}
                onCancel={() => {
                    setIsEditModalVisible(false)
                    setEditingCate(null);
                    message.info('编辑已取消');
                }}
                destroyOnHidden
            >
                <Form form={editForm} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} name="editCategory">
                    <Form.Item
                        name="name"
                        label="分类名"
                        rules={[{ required: true, message: '请输入分类名' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CateListPage;
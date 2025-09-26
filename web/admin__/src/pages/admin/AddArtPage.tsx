import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Select, Upload, Button, message, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import Editor from '../../utils/Editor'; // 导入重写后的 Editor 组件
import api from '../../services/api'; // 导入封装的 Axios 实例

const { Option } = Select;
const { TextArea } = Input;

interface Category {
    id: number;
    name: string;
}

interface ArticleInfo {
    id?: number;
    title: string;
    cid?: number;
    desc: string;
    content: string;
    img: string;
}

interface ApiResponse<T> {
    data: T;
    message: string;
}

const AddArtPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // 从 URL 获取 id
    const navigate = useNavigate(); // 用于页面跳转
    const [form] = Form.useForm<ArticleInfo>(); // antd form hook

    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [imageUrl, setImageUrl] = useState<string>(''); // 用于浏览上传或已有的图片

    const upUrl = 'http://your-api-base-url.com/api/upload'; // 上传地址
    const headers = { Authorization: `Bearer ${sessionStorage.getItem('token')}`};

    // useEffect 模拟 created 生命周期
    useEffect(() => {
        // 1. 获取分类列表
        const getCateList = async () => {
            try {
                // 修正 2：通过 response.data 访问后端返回的数据体
                const response = await api.get<ApiResponse<Category[]>>('category');
                setCategoryList(response.data.data); // result.data 是后端数据体, result.data.data 才是分类数组
            } catch (error) {
                console.error('获取分类列表失败：', error);
            }
        };

        // 2. 如果存在id， 说明是编辑模式，获取文章详情
        const getArtInfo = async (articleId: string) => {
            try {
                // 修正 3 & 4：同样通过 response.data 访问数据
                const response = await api.get<ApiResponse<ArticleInfo>>(`article/info/${articleId}`);
                const articleData = response.data.data;
                form.setFieldsValue(articleData); // 使用后端返回的文章数据填充表单
                setImageUrl(articleData.img);     // 使用后端返回的图片URL设置预览
            } catch (error) {
                console.error('获取文章详情失败：', error)
            }
        };

        getCateList();
        if (id) {
            getArtInfo(id);
        }
    }, [id, form]); // 依赖项数组： 当 id 变化时，重新执行 useEffect

    // 处理图片上传状态变化
    const handleUploadChange = (info: UploadChangeParam) => {
        if (info.file.status === 'done') {
            message.success('图片上传成功');
            const newImageUrl = info.file.response.url;
            setImageUrl(newImageUrl);
            form.setFieldsValue({ img: newImageUrl }); // 将图片 URL 同步到表单数据
        } else if (info.file.status === 'error') {
            message.error('图片上传失败');
        }
    };

    // 表单验证通过后的提交函数
    const onFinish = async (values: ArticleInfo) => {
        try {
            if (id) {
                // 编辑模式：调用更新接口
                await api.put(`article/${id}`, values);
                message.success('更新文章成功');
            } else {
                await api.post('article/add', values);
                message.success('文章添加成功');
            }
            navigate('/artlist');
        } catch (error) {
            console.error('提交文章失败：', error);
        }
    };

    // 取消按钮处理函数
    const handleCancel = () => {
        form.resetFields();
        navigate('/artlist');
    };

    return (
        <Card title={id ? '编辑文章' : '新增文章'}>
            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 18 }}
                initialValues={{ title: '', cid: undefined, desc: '', content: '', img: ''}}
            >
                <Form.Item
                    label="文章标题"
                    name="title"
                    rules={[{ required: true, message: '请输入文章标题'}]} 
                >
                    <Input style={{ width: 400}} placeholder="请输入文章标题" />
                </Form.Item>

                <Form.Item
                    label="文章分类"
                    name="cid"
                    rules={[{ required: true, message: '请选择文章分类' }]}
                >
                    <Select style={{ width: 200 }} placeholder="请选择分类">
                        {categoryList.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                
                <Form.Item
                    label="文章描述"
                    name="desc"
                    rules={[
                        { required: true, message: '请输入文章描述'},
                        { max: 120, message: '文章描述字数不能超过120'},
                    ]}
                >
                    <TextArea rows={4} placeholder="请输入文章描述" />
                </Form.Item>

                <Form.Item label="文章缩略图" name="img">
                    <>
                        <Upload
                            name="file"
                            action={upUrl}
                            headers={headers}
                            multiple={false}
                            listType="picture"
                            showUploadList={false}
                            onChange={handleUploadChange}
                        >
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                        {imageUrl && (
                            <div style={{ marginTop: 10 }}>
                                <img src={imageUrl} alt="缩略图预览" style={{ width: 150, border: '1px solid #d9d9d9', padding: '4px' }} />
                            </div>
                        )}
                    </>
                </Form.Item>

                <Form.Item
                    label="文章内容"
                    name="content"
                    rules={[{ required: true, message: '请输入文章内容'}]}
                >
                    <Editor />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 3 }}>
                    <Space size="large">
                        <Button type="primary" htmlType="submit">
                            {id ? '更新' : '提交'}
                        </Button>
                        <Button onClick={handleCancel}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddArtPage;
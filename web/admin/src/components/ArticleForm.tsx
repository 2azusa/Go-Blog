import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Divider } from 'antd';
import type { IRspCategory, IReqArticle } from '../api/types';
import ImageUploader from './ImageUploader';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const { Option } = Select;

interface ArticleFormProps {
  initialValues?: Partial<IReqArticle>; 
  categories: IRspCategory[];
  onFinish: (values: IReqArticle) => Promise<void>;
  loading: boolean;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

const ArticleForm: React.FC<ArticleFormProps> = ({ initialValues, categories, onFinish, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFormSubmit = (values: any) => {
    const articleData: IReqArticle = {
      title: values.title,
      cid: values.cid,
      desc: values.desc,
      content: values.content,
      img: values.img || '',
    };
    onFinish(articleData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
    >
      <Form.Item name="title" label="文章标题" rules={[{ required: true, message: '请输入文章标题' }]}>
        <Input placeholder="请输入文章标题" />
      </Form.Item>
      
      <Form.Item name="cid" label="文章分类" rules={[{ required: true, message: '请选择文章分类' }]}>
        <Select placeholder="请选择文章分类">
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="desc" label="文章描述" rules={[{ required: true, message: '请输入文章描述' }]}>
        <Input.TextArea rows={4} placeholder="请输入文章的简要描述" />
      </Form.Item>

      <Form.Item name="img" label="文章封面图">
        <ImageUploader />
      </Form.Item>
      
      <Divider />

      <Form.Item 
        name="content" 
        label="文章内容" 
        rules={[{ required: true, message: '请输入文章内容' }]}
        valuePropName="value"
        getValueFromEvent={(content) => content}
      >
        <ReactQuill
          theme="snow"
          modules={quillModules}
          style={{ height: '400px', marginBottom: '50px' }}
          placeholder="开始创作你的文章..."
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues?.title ? '更新文章' : '发布文章'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ArticleForm;
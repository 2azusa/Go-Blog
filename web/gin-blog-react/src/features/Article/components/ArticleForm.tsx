import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Input, Select, Upload, Button, message, type UploadFile } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import request from '../../../api/request'; 
import { Editor } from '@tinymce/tinymce-react';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

const { Option } = Select;
const { TextArea } = Input;

import type { ArticleInfo, Category, ApiUploadResponse } from '../../../shared/types';

export const ArticleForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [articleInfo, setArticleInfo] = useState<ArticleInfo>({
    title: '',
    cid: undefined,
    desc: '',
    content: '',
    img: '',
  });
  const [cateList, setCateList] = useState<Category[]>([]);
  const [fileList, setFileList] = useState<UploadFile<ApiUploadResponse>[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // 重要：请务必替换为您的 TinyMCE API Key
  const tinymceScriptSrc = 'https://cdn.tiny.cloud/1/YOUR_API_KEY/tinymce/6/tinymce.min.js';

  const getArtInfo = useCallback(async (articleId: number) => {
    try {
      const { data: result } = await request.get(`article/info/${articleId}`);
      if (result.status !== 200) {
        return message.error(result.message || '获取文章信息失败');
      }
      const fetchedArticle: ArticleInfo = result.data;
      setArticleInfo(fetchedArticle);
      form.setFieldsValue({
        title: fetchedArticle.title,
        cid: fetchedArticle.cid,
        desc: fetchedArticle.desc,
      });

      if (fetchedArticle.img) {
        setFileList([{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: fetchedArticle.img,
        }]);
      }
    } catch {
      message.error('获取文章信息失败');
    }
  }, [form]);

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

  useEffect(() => {
    getCateList();
    if (id) {
      getArtInfo(Number(id));
    }
  }, [id, getArtInfo]);

  const onFinish = async (values: Omit<ArticleInfo, 'content' | 'img'>) => {
    try {
      const finalArticleInfo = { ...values, content: articleInfo.content, img: articleInfo.img };
      if (!finalArticleInfo.content || finalArticleInfo.content.trim() === '') {
        return message.error('请输入文章内容');
      }

      const response = id
        ? await request.put(`article/${id}`, finalArticleInfo)
        : await request.post('article/add', finalArticleInfo);

      if (response.data.status !== 200) {
        return message.error(response.data.message || '操作失败');
      }

      message.success(id ? '更新文章成功' : '文章添加成功');
      navigate('/admin/artlist');
    } catch {
      message.error('操作失败');
    }
  };

  const artCancel = () => {
    navigate('/admin/artlist');
  };

  const handleUploadChange = (info: UploadChangeParam<UploadFile<ApiUploadResponse>>) => {
    let newFileList = [...info.fileList].slice(-1);
    newFileList = newFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);

    if (info.file.status === 'uploading') {
      setUploading(true);
    } else {
      setUploading(false);
      if (info.file.status === 'done' && info.file.response) {
        message.success(`${info.file.name} 图片上传成功`);
        setArticleInfo(prev => ({ ...prev, img: info.file.response!.url }));
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 图片上传失败`);
      }
    }
  };

  const customRequest = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data: result } = await request.post('/upload', formData);
      if (result.status === 200 && onSuccess) {
        onSuccess(result);
      } else if (onError) {
        onError(new Error(result.message || '上传失败'));
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  };
  
  // JSX 部分保持不变
return (
    <div>
      <Card>
        <h3>{id ? '编辑文章' : '新增文章'}</h3>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="文章标题" name="title" rules={[{ required: true, message: '请输入文章标题' }]}>
            <Input style={{ width: '300px' }} />
          </Form.Item>
          <Form.Item label="文章分类" name="cid" rules={[{ required: true, message: '请选择文章分类' }]}>
            <Select style={{ width: '130px' }} placeholder="请选择分类">
              {cateList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            label="文章描述"
            name="desc"
            rules={[
              { required: true, message: '请输入文章描述' },
              { max: 120, message: '文章描述字数不能超过120' },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="文章缩略图">
            <Upload<ApiUploadResponse>
              name="file"
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              customRequest={customRequest}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>点击上传</Button>
            </Upload>
            {articleInfo.img && fileList.length === 0 && (
              <img src={articleInfo.img} style={{ width: '120px', height: '90px', marginTop: '10px' }} alt="thumbnail" />
            )}
          </Form.Item>
          <Form.Item label="文章内容">
            <Editor
              apiKey="YOUR_API_KEY"
              tinymceScriptSrc={tinymceScriptSrc}
              init={{
                height: 500,
                menubar: false,
                plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              }}
              value={articleInfo.content}
              onEditorChange={content => setArticleInfo(prev => ({ ...prev, content }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '15px' }}>
              {id ? '更新' : '提交'}
            </Button>
            <Button onClick={artCancel}>取消</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
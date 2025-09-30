import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { uploadApi } from '../api/api';

const { TextArea } = Input;

// 自定义上传请求的处理函数
const customUploadRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await uploadApi.uploadImage(formData);
    const result = response.data;

    if (result && result.status === 200) {
      // 调用 onSuccess 并传递后端返回的 URL
      // antd 的 Upload 组件会用这个返回值来更新文件列表项
      onSuccess({ url: result.data.url }, file);
      message.success('图片上传成功！');
    } else {
      // 如果后端返回的 status 不是 200，也视为错误
      const errorMsg = result.message || '图片上传失败';
      onError(new Error(errorMsg));
      message.error(errorMsg);
    }
  } catch (err) {
    onError(err);
    message.error('图片上传请求失败');
  }
};

// 封装一个通用的 Upload 组件，用于头像和背景图
const ImageUploader = ({ value, onChange }: { value?: any; onChange?: (url: string) => void }) => {
  
  // 处理上传状态变化的函数
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      // 当文件状态变为 'done' 时，从响应中获取 URL 并调用 onChange
      // antd Upload 的 onSuccess 会把服务器响应附加到 info.file.response
      if (onChange && info.file.response?.url) {
        onChange(info.file.response.url);
      }
    }
  };

  // 根据 value（即表单字段的值，一个 URL 字符串）生成 fileList
  const fileList: UploadFile[] = value
    ? [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: value, // 图片预览地址
        },
      ]
    : [];

  return (
    <Upload
      name="file" // 与后端 c.Request.FormFile("file") 对应
      listType="picture"
      maxCount={1}
      fileList={fileList}
      customRequest={customUploadRequest}
      onChange={handleChange}
    >
      <Button icon={<UploadOutlined />}>点击上传</Button>
    </Upload>
  );
};

// ProfileFormFields 组件现在使用新的 ImageUploader
const ProfileFormFields = () => (
  <>
    {/* 其他 Form.Item 保持不变 */}
    <Form.Item name="name" label="昵称" rules={[{ required: true, message: '请输入您的昵称!' }]}>
      <Input />
    </Form.Item>
    <Form.Item name="desc" label="个人简介" rules={[{ required: true, message: '请输入个人简介!' }]}>
      <TextArea rows={3} />
    </Form.Item>
    <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入您的邮箱!' }, { type: 'email', message: '请输入有效的邮箱地址!' }]}>
      <Input />
    </Form.Item>
    <Form.Item name="qqchat" label="QQ 号"><Input /></Form.Item>
    <Form.Item name="wechat" label="微信号"><Input /></Form.Item>
    <Form.Item name="weibo" label="微博"><Input /></Form.Item>

    {/* 使用新的上传组件 */}
    <Form.Item name="avatar" label="头像">
      <ImageUploader />
    </Form.Item>

    <Form.Item name="img" label="背景图">
      <ImageUploader />
    </Form.Item>
  </>
);

export default ProfileFormFields;
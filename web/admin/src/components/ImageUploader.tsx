import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { uploadApi } from '../api/api'; // 引入上传 API

const customUploadRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await uploadApi.uploadImage(formData);
    const result = response.data;

    if (result && result.status === 200) {
      onSuccess({ url: result.data.url }, file);
      message.success('图片上传成功！');
    } else {
     	const errorMsg = result.message || '图片上传失败';
			onError(new Error(errorMsg));
			message.error(errorMsg);
    }
  } catch (err) {
    onError(err);
    message.error('图片上传请求失败');
  }
};

const ImageUploader = ({ value, onChange }: { value?: any; onChange?: (url: string) => void }) => {
  
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      if (onChange && info.file.response?.url) {
        // 当上传成功，调用 onChange 将 URL 传回给 Form.Item
        onChange(info.file.response.url);
      }
    } else if (info.file.status === 'removed') {
        // 如果用户点击删除按钮，也通知表单清空该字段
        if (onChange) {
            onChange(''); // 传递空字符串或 undefined
        }
    }
  };

  const fileList: UploadFile[] = value
    ? [{ uid: '-1', name: 'image.png', status: 'done', url: value }]
    : [];

  return (
    <Upload
      name="file"
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

export default ImageUploader;
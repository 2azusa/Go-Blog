import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Input, Button, Upload, message } from 'antd';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../../../api/request'; // 调整后的相对路径
import type { AxiosError } from 'axios';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

import type { ProfileInfo, ApiResponse } from '../../../shared/types';

// 组件从 Profile 重命名为 ProfileForm，并使用命名导出
export const ProfileForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: '', desc: '', qq_chat: '', wechat: '', weibo: '', email: '', img: '', avatar: '',
  });

  const [avatarFileList, setAvatarFileList] = useState<UploadFile<ApiResponse<{ url: string; }>>[]>([]);
  const [imgFileList, setImgFileList] = useState<UploadFile<ApiResponse<{ url: string; }>>[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [uploadingImg, setUploadingImg] = useState<boolean>(false);

  const getProfile = useCallback(async () => {
    try {
      const { data: result } = await request.get<ApiResponse<ProfileInfo>>('profile');
      if (result.status !== 200) {
        return message.error(result.message || '获取个人资料失败');
      }
      const fetchedProfile = result.data;
      setProfileInfo(fetchedProfile);
      form.setFieldsValue(fetchedProfile);

      if (fetchedProfile.avatar) {
        setAvatarFileList([{ uid: '-1', name: 'avatar.png', status: 'done', url: fetchedProfile.avatar }]);
      }
      if (fetchedProfile.img) {
        setImgFileList([{ uid: '-2', name: 'background.png', status: 'done', url: fetchedProfile.img }]);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(axiosError.message || '获取个人资料失败');
    }
  }, [form]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const onFinish = async (values: ProfileInfo) => {
    try {
      const finalProfileInfo = { ...values, avatar: profileInfo.avatar, img: profileInfo.img };
      const { data: result } = await request.put<ApiResponse<ProfileInfo>>('profile', finalProfileInfo);
      if (result.status !== 200) {
        return message.error(result.message || '更新个人资料失败');
      }
      message.success('个人资料更新成功');
      setProfileInfo(result.data);
      navigate('/admin');
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(axiosError.message || '更新个人资料失败');
    }
  };

  const customRequest = async (options: UploadRequestOption, type: 'avatar' | 'img') => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: result } = await request.post<ApiResponse<{ url: string }>>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (result.status === 200 && onSuccess) {
        onSuccess(result);
        if (type === 'avatar') {
          setProfileInfo((prev) => ({ ...prev, avatar: result.data.url }));
        } else {
          setProfileInfo((prev) => ({ ...prev, img: result.data.url }));
        }
      } else if (onError) {
        onError(new Error(result.message || '上传失败'));
      }
    } catch (error) {
      if (onError) onError(error as Error);
    }
  };

  const handleAvatarChange = (info: UploadChangeParam<UploadFile<ApiResponse<{ url: string; }>>>) => {
    let newFileList = info.fileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response && file.response.status === 200) {
        return { ...file, url: file.response.data.url };
      }
      return file;
    });
    setAvatarFileList(newFileList);

    if (info.file.status === 'uploading') setUploadingAvatar(true);
    else {
      setUploadingAvatar(false);
      if (info.file.status === 'done') message.success(`${info.file.name} 图片上传成功`);
      else if (info.file.status === 'error') message.error(`${info.file.name} 图片上传失败`);
    }
  };
  
  const handleImgChange = (info: UploadChangeParam<UploadFile<ApiResponse<{ url: string; }>>>) => {
    let newFileList = info.fileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response && file.response.status === 200) {
        return { ...file, url: file.response.data.url };
      }
      return file;
    });
    setImgFileList(newFileList);

    if (info.file.status === 'uploading') setUploadingImg(true);
    else {
      setUploadingImg(false);
      if (info.file.status === 'done') message.success(`${info.file.name} 图片上传成功`);
      else if (info.file.status === 'error') message.error(`${info.file.name} 图片上传失败`);
    }
  };

  return (
    <div>
      <h3>个人设置</h3>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={profileInfo}>
          <Form.Item label="作者名称" name="name"><Input style={{ width: '300px' }} /></Form.Item>
          <Form.Item label="个人简介" name="desc"><Input style={{ width: '300px' }} /></Form.Item>
          <Form.Item label="QQ" name="qq_chat"><Input style={{ width: '300px' }} /></Form.Item>
          <Form.Item label="微信" name="wechat"><Input style={{ width: '300px' }} /></Form.Item>
          <Form.Item label="微博" name="weibo"><Input style={{ width: '300px' }} /></Form.Item>
          <Form.Item label="Email" name="email"><Input style={{ width: '300px' }} /></Form.Item>
          <Form.Item label="头像">
            <Upload<ApiResponse<{ url: string; }>> name="file" listType="picture" fileList={avatarFileList} onChange={handleAvatarChange} customRequest={(options) => customRequest(options, 'avatar')} maxCount={1}>
              <Button icon={<UploadOutlined />} loading={uploadingAvatar}>点击上传</Button>
            </Upload>
            {profileInfo.avatar && !avatarFileList.length && (
              <img src={profileInfo.avatar} style={{ width: '120px', height: '90px', marginTop: '10px' }} alt="avatar" />
            )}
          </Form.Item>
          <Form.Item label="头像背景">
            <Upload<ApiResponse<{ url: string; }>> name="file" listType="picture" fileList={imgFileList} onChange={handleImgChange} customRequest={(options) => customRequest(options, 'img')} maxCount={1}>
              <Button icon={<UploadOutlined />} loading={uploadingImg}>点击上传</Button>
            </Upload>
            {profileInfo.img && !imgFileList.length && (
              <img src={profileInfo.img} style={{ width: '120px', height: '90px', marginTop: '10px' }} alt="background" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">更新</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
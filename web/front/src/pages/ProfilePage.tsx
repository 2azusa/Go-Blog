import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi, uploadApi } from '../api/api';
import type { IReqProfile } from '../api/types';

export default function ProfilePage() {
  const { userProfile, login } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<IReqProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        desc: userProfile.desc || '',
        qqchat: userProfile.qqchat || '',
        wechat: userProfile.wechat || '',
        weibo: userProfile.weibo || '',
        email: userProfile.email || '',
        img: userProfile.img || '',
        avatar: userProfile.avatar || '',
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);

    setIsUploading(true);
    setError(null);
    try {
      const response = await uploadApi.uploadImage(fd);
      if (formData) {
        setFormData({ ...formData, avatar: response.data.data.url });
      }
    } catch (err) {
      setError('头像上传失败。');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await profileApi.updateProfile(formData);
      const token = localStorage.getItem('token');
      if (token) {
        await login(token);
      }
      setIsEditMode(false);
      setError(null);
    } catch (err) {
      setError('更新失败，请稍后重试。');
      console.error(err);
    }
  };

  if (!userProfile || !formData) {
    return <div className="text-center p-8">加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            {isEditMode ? '取消' : '编辑资料'}
          </button>
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload in Edit Mode */}
            <div className="flex items-center space-x-4">
                <img src={formData.avatar || 'https://via.placeholder.com/100'} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                <div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-200">
                        {isUploading ? '上传中...' : '更换头像'}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                </div>
            </div>
            {/* Other fields */}
            <div>
                <label className="block text-sm font-medium text-gray-700">昵称</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">个人简介</label>
                <textarea name="desc" value={formData.desc} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">邮箱</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">QQ</label>
                <input type="text" name="qqchat" value={formData.qqchat} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">微信</label>
                <input type="text" name="wechat" value={formData.wechat} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">微博</label>
                <input type="text" name="weibo" value={formData.weibo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">保存更改</button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <img src={userProfile.avatar || 'https://via.placeholder.com/100'} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
              <div>
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <p className="text-gray-600">{userProfile.desc || '暂无简介'}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">邮箱</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">QQ</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile.qqchat || '-'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">微信</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile.wechat || '-'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">微博</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile.weibo || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

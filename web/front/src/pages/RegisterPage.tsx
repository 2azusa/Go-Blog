import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/api';
import type { IReqRegister } from '../api/types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IReqRegister & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    const { username, email, password, confirmPassword } = formData;
    if (username.length < 6 || username.length > 20) {
      setError('用户名长度必须在 6-20 个字符之间');
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }
    if (password.length < 6 || password.length > 20) {
      setError('密码长度必须在 6-20 个字符之间');
      return false;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    try {
      await authApi.register({ username: formData.username, password: formData.password, email: formData.email });
      setIsRegistered(true);
    } catch (err) {
      setError('注册失败，用户名或邮箱可能已被占用。');
      console.error(err);
    }
  };

  if (isRegistered) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-3">注册成功！</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                我们已经向您的邮箱{' '}
                <span className="font-medium text-accent">{formData.email}</span>{' '}
                发送了一封激活邮件
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                请前往邮箱点击链接以激活您的账户
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 shadow-sm"
            >
              返回登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">创建账户</h1>
          <p className="text-muted-foreground text-base">加入我们，开始您的创作</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full px-4 py-3.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-base"
                placeholder="6-20 个字符"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-base"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-4 py-3.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-base"
                placeholder="6-20 个字符"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                确认密码
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="block w-full px-4 py-3.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-base"
                placeholder="再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 shadow-sm"
            >
              注册
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            已有账户？{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-accent hover:underline transition-all duration-200"
            >
              直接登录
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

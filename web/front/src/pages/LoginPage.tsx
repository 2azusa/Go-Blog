import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/api';
import type { IReqLogin, IReqLoginByEmail } from '../api/types';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginType, setLoginType] = useState<'password' | 'email'>('password');

  const [passwordFormData, setPasswordFormData] = useState<IReqLogin>({ username: '', password: '' });
  const [emailFormData, setEmailFormData] = useState<IReqLoginByEmail>({ email: '', code: '' });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFormData({ ...passwordFormData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFormData({ ...emailFormData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!emailFormData.email) {
      setError('请输入邮箱地址');
      return;
    }
    setError(null);
    try {
      await authApi.sendVerificationEmail({ email: emailFormData.email });
      setIsCodeSent(true);
      setError('验证码已发送，请查收。');
    } catch (err) {
      setError('发送验证码失败，请稍后重试。');
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!passwordFormData.username || !passwordFormData.password) {
      setError('请输入用户名和密码');
      return;
    }
    try {
      const response = await authApi.login(passwordFormData);
      if (response.data.token) {
        await login(response.data.token);
        navigate('/');
      } else {
        setError('登录失败，未收到认证令牌。');
      }
    } catch (err) {
      setError('登录失败，请检查您的用户名和密码。');
      console.error(err);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!emailFormData.email || !emailFormData.code) {
      setError('请输入邮箱和验证码');
      return;
    }
    try {
      const response = await authApi.loginByEmail(emailFormData);
      if (response.data.token) {
        await login(response.data.token);
        navigate('/');
      } else {
        setError('登录失败，未收到认证令牌。');
      }
    } catch (err) {
      setError('登录失败，请检查您的验证码。');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">欢迎回来</h1>
          <p className="text-muted-foreground text-base">登录继续您的创作之旅</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-border">
            <button
              className={`flex-1 pb-3 text-center text-base font-medium transition-all duration-200 border-b-2 ${
                loginType === 'password'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setLoginType('password')}
            >
              密码登录
            </button>
            <button
              className={`flex-1 pb-3 text-center text-base font-medium transition-all duration-200 border-b-2 ${
                loginType === 'email'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setLoginType('email')}
            >
              验证码登录
            </button>
          </div>

          {/* Forms */}
          {loginType === 'password' ? (
            <form className="space-y-5" onSubmit={handlePasswordSubmit}>
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
                  placeholder="输入您的用户名"
                  value={passwordFormData.username}
                  onChange={handlePasswordChange}
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
                  placeholder="输入您的密码"
                  value={passwordFormData.password}
                  onChange={handlePasswordChange}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                登录
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  邮箱地址
                </label>
                <div className="flex gap-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="flex-1 px-4 py-3.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="输入您的邮箱"
                    value={emailFormData.email}
                    onChange={handleEmailChange}
                    disabled={isCodeSent}
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isCodeSent}
                    className="px-5 py-3.5 border border-input rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isCodeSent ? '已发送' : '发送验证码'}
                  </button>
                </div>
              </div>
              {isCodeSent && (
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
                    验证码
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="block w-full px-4 py-3.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-base"
                    placeholder="输入6位验证码"
                    value={emailFormData.code}
                    onChange={handleEmailChange}
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                登录
              </button>
            </form>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            还没有账户？{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-accent hover:underline transition-all duration-200"
            >
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - 页面未找到</h1>
      <p>您正在寻找的页面不存在。</p>
      <Link to="/">返回首页</Link>
    </div>
  );
};

export default NotFoundPage;
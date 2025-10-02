import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const IndexPage = () => {
  return (
    <Result
      icon={<SmileOutlined />}
      title="欢迎使用 Azusa's Blog 后台管理系统"
      extra={
        <Button type="primary">
          <Link to="/articlelist">开始管理文章</Link>
        </Button>
      }
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default IndexPage;
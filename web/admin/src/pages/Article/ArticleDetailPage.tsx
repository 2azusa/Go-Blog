import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesApi } from '../../api/api';
import type { IRspArticle } from '../../api/types';
import { 
    Card, 
    Spin, 
    Alert, 
    Descriptions, 
    Button, 
    Divider, 
    Typography, 
    Space, 
    Image as AntdImage 
} from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import { EditOutlined } from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';

const { Title, Paragraph, Text } = Typography;

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<IRspArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('未提供文章ID');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await articlesApi.getArticleDetail(parseInt(id, 10));
        if (response.data && response.data.status === 200) {
          setArticle(response.data.data);
        } else {
          setError(response.data.message || '获取文章详情失败');
        }
      } catch (err: any) {
        setError(err.message || '发生未知网络错误');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon style={{ margin: 24 }} />;
  }

  if (!article) {
    return <Alert message="未找到该文章" type="warning" showIcon style={{ margin: 24 }} />;
  }

  return (
    <div style={{ padding: 24 }}>
        <PageHeader
            onBack={() => navigate(-1)}
            title="文章详情"
        />
        <Card
            title={<Title level={3} style={{ margin: 0 }}>{article.title}</Title>}
            cover={article.img ? <AntdImage alt="cover" src={article.img} style={{ maxHeight: 300, objectFit: 'cover' }} /> : null}
            extra={
              <Button 
                  icon={<EditOutlined />} 
                  onClick={() => navigate(`/article/edit/${article.id}`)}
              >
                  编辑
              </Button>
            }
        >
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="分类">{article.category?.name || '未分类'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{new Date(article.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="最后更新">{new Date(article.updatedAt).toLocaleString()}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Typography>
              <Title level={5}>摘要</Title>
              <Paragraph>
                  <Text type="secondary">{article.desc}</Text>
              </Paragraph>

              <Title level={5}>正文</Title>
              <div 
                className="ql-snow" 
                style={{ border: 'none' }}
              >
                <div 
                  className="ql-editor" 
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              </div>
            </Typography>

            <Divider />
            <Title level={4}>评论区</Title>
            {article.comments && article.comments.length > 0 ? (
            <Space direction="vertical" style={{width: '100%'}}>
                {article.comments.map(comment => (
                <Card key={comment.id} size="small" type="inner">
                    <p>{comment.content}</p>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {comment.commentator || '匿名用户'} 发布于 {new Date(comment.createdAt).toLocaleString()}
                    </Text>
                </Card>
                ))}
            </Space>
            ) : (
            <Text>暂无评论。</Text>
            )}
        </Card>
    </div>
  );
};

export default ArticleDetailPage;
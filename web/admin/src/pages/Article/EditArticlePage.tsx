import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articlesApi, categoryApi } from '../../api/api'; // 确认路径是否正确
import type { IReqArticle, IRspCategory, IReqPagination } from '../../types/types'; // 确认路径是否正确
import { Card, Spin, Alert, message } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import ArticleForm from '../../components/ArticleForm'; // 确认路径是否正确

const EditArticlePage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // 将文章数据和分类数据分开加载
  const [initialValues, setInitialValues] = useState<Partial<IReqArticle> | undefined>(undefined);
  const [categories, setCategories] = useState<IRspCategory[]>([]);
  
  const [pageLoading, setPageLoading] = useState<boolean>(true); // 页面级加载（获取分类和文章详情）
  const [formLoading, setFormLoading] = useState<boolean>(false); // 表单提交加载
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      setError(null);
      try {
        // 1. 获取分类列表
        const requestData: IReqPagination  = {
          pagenum: 1,
          pagesize: 100,
        };
        const categoriesResponse = await categoryApi.getCategories(requestData);
        if (categoriesResponse.data.status === 200 && categoriesResponse.data.data) {
          setCategories(categoriesResponse.data.data);
        } else {
          throw new Error(categoriesResponse.data.message || '获取分类列表失败');
        }

        // 2. 如果是编辑模式，获取文章详情
        if (isEditing && id) {
          const articleResponse = await articlesApi.getArticleDetail(parseInt(id, 10));
          if (articleResponse.data.status === 200 && articleResponse.data.data) {
            const article = articleResponse.data.data;
            // 组装表单需要的数据
            setInitialValues({
              title: article.title,
              cid: article.cid,
              desc: article.desc,
              content: article.content,
              img: article.img,
            });
          } else {
            throw new Error(articleResponse.data.message || '获取文章详情失败');
          }
        }
      } catch (err: any) {
        // api.ts 中的拦截器已经处理了 message.error, 这里只设置页面错误状态
        setError(err.message || '数据加载失败');
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleFinish = async (values: IReqArticle) => {
    setFormLoading(true);
    try {
      if (isEditing && id) {
        await articlesApi.updateArticle(parseInt(id, 10), values);
        message.success('文章更新成功！');
        navigate(`/articledetail/${id}`);
      } else {
        await articlesApi.addArticle(values);
        message.success('文章发布成功！');
        navigate('/articlelist');
      }
    } catch (err) {
        console.error(err);
    } finally {
        setFormLoading(false);
    }
  };

  if (pageLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }
  
  if (error) {
    return <Alert message={error} type="error" showIcon style={{ margin: 24 }} />;
  }

  return (
    <div style={{ padding: 24 }}>
        <PageHeader
            onBack={() => navigate(-1)}
            title={isEditing ? '编辑文章' : '写新文章'}
        />
        <Card>
            <ArticleForm
                initialValues={initialValues}
                categories={categories}
                onFinish={handleFinish}
                loading={formLoading}
            />
        </Card>
    </div>
  );
};

export default EditArticlePage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.ts';

// 导入 MUI 组件
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Pagination,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

// 导入 MUI 图标
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// 1. 为数据对象定义清晰的 TypeScript 类型
interface Article {
  id: number;
  img: string;
  name: string; // 分类名称
  title: string;
  desc: string;
  CreatedAt: string; // 后端返回的时间字符串
}

// 描述后端 API 响应的标准结构
interface ApiResponse<T> {
  status: number;
  data: T;
  total: number;
  message: string;
}

const ArticleListPage = () => {
  // 2. 初始化 Hooks
  const navigate = useNavigate();
  const { id: categoryId } = useParams<{ id: string }>();

  // 3. 使用 useState 管理所有组件状态
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [queryData, setQueryData] = useState({
    pagesize: 5,
    pagenum: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 4. 使用 useEffect 在组件挂载或依赖项变化时获取数据
  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
  setError(null);
      
      try {
        const params = {
          pagesize: queryData.pagesize,
          pagenum: queryData.pagenum,
        };
        
        // 根据 categoryId 是否存在，确定 API 的 URL
        const url = categoryId ? `/article/cate/${categoryId}` : '/articles';
        
        // **[核心修正]**
        // api.get 返回的是 AxiosResponse 对象，其结构为 { data: {...}, status: ... }
        // 我们需要的数据（符合 ApiResponse 类型）在 .data 属性中。
        // 因此，我们使用解构赋值 `const { data: response }` 来直接提取它。
        const { data: response } = await api.get<ApiResponse<Article[]>>(url, { params });

        // 现在 'response' 变量的类型就是我们定义的 ApiResponse<Article[]>，可以安全访问其属性
        if (response.status === 200) {
          setArticleList(response.data);
          setTotal(response.total);
        } else {
          setError(response.message || '获取数据失败');
        }
      } catch (err) {
        // 网络层面的错误会被 api.ts 的拦截器捕获并显示全局通知
        // 我们在这里设置一个本地错误，用于在页面上显示具体的提示
        setError("无法加载文章列表，请检查网络或稍后再试。");
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    };

    getArticles();
    // 依赖项：当分类、页码或每页数量变化时，都重新获取数据
  }, [categoryId, queryData.pagenum, queryData.pagesize]);

  // 5. 事件处理函数
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setQueryData({ ...queryData, pagenum: value });
    window.scrollTo(0, 0); // 翻页后滚动到页面顶部
  };

  // 6. 辅助函数
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    };
    // 使用瑞典格式可以方便地得到 YYYY-MM-DD HH:mm 格式
    return new Date(dateString).toLocaleString('sv-SE', options); 
  };

  // 7. 条件渲染
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    );
  }

  // 8. 主体 JSX 渲染
  return (
    <Box>
      {articleList.length > 0 ? (
        articleList.map((article) => (
          <Card key={article.id} sx={{ mb: 2, display: 'flex' }}>
            <CardActionArea
              onClick={() => navigate(`/home/detail/${article.id}`)}
              sx={{ display: 'flex', justifyContent: 'flex-start' }}
            >
              <CardMedia
                component="img"
                sx={{ width: 120, height: 120, m: 2, borderRadius: 1.5, flexShrink: 0 }}
                image={article.img}
                alt={article.title}
              />
              <CardContent sx={{ flex: '1 1 auto', py: 2 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  <Chip
                    label={article.name}
                    color="secondary"
                    size="small"
                    sx={{ mr: 1.5, color: 'white' }}
                  />
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {article.desc}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(article.CreatedAt)}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))
      ) : (
        <Alert severity="info" sx={{ m: 2 }}>该分类下暂无文章。</Alert>
      )}

      {/* 只有当总数超过一页时才显示分页器 */}
      {total > queryData.pagesize && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <Pagination
            count={Math.ceil(total / queryData.pagesize)}
            page={queryData.pagenum}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default ArticleListPage;
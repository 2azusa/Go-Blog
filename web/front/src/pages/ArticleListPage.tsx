// src/pages/ArticleListPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
} from '@mui/material';

// 导入 MUI 图标
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// 为文章对象定义 TypeScript 类型，增强代码健壮性
interface Article {
  id: number;
  img: string;
  name: string; // 假设 'name' 是分类名称
  title: string;
  desc: string;
  CreatedAt: string; // 日期先作为字符串接收，在渲染时格式化
}

const ArticleListPage = () => {
  // 1. 使用 Hooks 获取路由参数和导航函数
  const navigate = useNavigate();
  const { id: categoryId } = useParams<{ id: string }>(); // 从 URL 获取 id

  // 2. 使用 useState 管理组件状态
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [queryData, setQueryData] = useState({
    pagesize: 5,
    pagenum: 1,
  });

  // 3. 使用 useEffect 获取文章数据
  useEffect(() => {
    const getArticles = async () => {
      // 如果 URL 中没有 id，可能代表首页，这里假设 API 用 '0' 或其他值代表“全部”
      const currentCategoryId = categoryId || '0';
      try {
        const { data: result } = await axios.get(`api/article/cate/${currentCategoryId}`, {
           params: {
            pagesize: queryData.pagesize,
            pagenum: queryData.pagenum,
          },
        });

        if (result.status === 200) {
          setArticleList(result.data);
          setTotal(result.total);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    getArticles();
    // 当分类ID或当前页码变化时，重新执行 effect
  }, [categoryId, queryData.pagenum, queryData.pagesize]);

  // 4. 分页器页码变化时的处理函数
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setQueryData({ ...queryData, pagenum: value });
    // 页面滚动到顶部，提升用户体验
    window.scrollTo(0, 0);
  };

  // 5. 日期格式化辅助函数
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    };
    return new Date(dateString).toLocaleString('sv-SE', options); // 使用瑞典格式得到 YYYY-MM-DD HH:mm
  };

  // 6. 渲染 JSX
  return (
    <Box>
      {/* 渲染文章列表 */}
      {articleList.map((article) => (
        <Card key={article.id} sx={{ mb: 2, display: 'flex' }}>
          <CardActionArea
            onClick={() => navigate(`/home/detail/${article.id}`)}
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            {/* 左侧图片 */}
            <CardMedia
              component="img"
              sx={{ width: 120, height: 120, m: 2, borderRadius: 1.5, flexShrink: 0 }}
              image={article.img}
              alt={article.title}
            />
            {/* 右侧内容 */}
            <CardContent sx={{ flex: '1 1 auto', py: 2 }}>
              <Typography variant="h6" component="div" gutterBottom>
                <Chip
                  label={article.name}
                  color="secondary" // 'pink' 可以映射为 'secondary'
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
      ))}

      {/* 分页器 */}
      {total > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
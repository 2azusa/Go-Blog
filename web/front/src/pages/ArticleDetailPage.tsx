import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.ts';

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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface Article {
  id: number;
  img: string;
  name: string;
  title: string;
  desc: string;
  CreatedAt: string;
}
interface ApiResponse<T> {
  status: number;
  data: T;
  total: number;
  message: string;
}

const ArticleListPage = () => {
  const navigate = useNavigate();
  const { id: categoryId } = useParams<{ id: string }>();

  // --- State Management ---
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [queryData, setQueryData] = useState({
    pagesize: 5,
    pagenum: 1,
  });
  // Add loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          pagesize: queryData.pagesize,
          pagenum: queryData.pagenum,
        };

        // [FIX] Determine the correct API endpoint based on the route
        const url = categoryId ? `/article/cate/${categoryId}` : '/articles';

        // [FIX] Use the 'api' client and correctly destructure the response
        const { data: response } = await api.get<ApiResponse<Article[]>>(url, { params });

        if (response.status === 200) {
          setArticleList(response.data);
          setTotal(response.total);
        } else {
          setError(response.message || 'Failed to fetch data');
        }
      } catch (err) {
        // The global error notification is handled by api.ts interceptor.
        // Set a local error for rendering an in-page message.
        setError("Could not load articles. Please check your connection and try again.");
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [categoryId, queryData.pagenum, queryData.pagesize]);

  // --- Event Handlers & Helpers ---
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setQueryData({ ...queryData, pagenum: value });
    window.scrollTo(0, 0);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    };
    return new Date(dateString).toLocaleString('sv-SE', options);
  };

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>
    );
  }

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
                  <Chip label={article.name} color="secondary" size="small" sx={{ mr: 1.5, color: 'white' }}/>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{article.desc}</Typography>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{formatDate(article.CreatedAt)}</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))
      ) : (
        <Alert severity="info" sx={{ m: 3 }}>No articles found in this category.</Alert>
      )}

      {total > queryData.pagesize && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
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
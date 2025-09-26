// src/pages/ArticleListPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesApi } from '../services/api';
import type { IRspFindArticle, IReqFindArticle } from '../utils/types'; // 引入标准类型
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

const ArticleListPage = () => {
  const [articles, setArticles] = useState<IRspFindArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);

  const navigate = useNavigate();

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      // 修正请求参数字段以匹配 IReqFindArticle
      const requestData: IReqFindArticle = {
        title: searchTerm,
        pagenum: page + 1,
        pagesize: rowsPerPage,
      };
      
      const { data: result } = await articlesApi.getArticles(requestData);

      // 正确处理 IApiResponse<IRspArticleList> 结构
      if (result && result.status === 200) {
        setArticles(result.data.articles || []);
        setTotalArticles(result.data.total || 0);
      } else {
        setError(result.message || '获取文章列表失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '发生未知网络错误');
    } finally {
      setLoading(false);
    }
  };

  // 当页码或每页数量变化时重新获取
  useEffect(() => {
    fetchArticles();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0); // 搜索时回到第一页
    fetchArticles();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await articlesApi.deleteArticle(id);
        // 如果当前页只剩一条数据，删除后应该返回上一页
        if (articles.length === 1 && page > 0) {
          setPage(page - 1);
        } else {
          fetchArticles(); // 重新加载当前页
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '删除失败');
      }
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }
    if (articles.length === 0) {
        return <Typography sx={{ mt: 2, textAlign: 'center' }}>暂无文章数据</Typography>
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>标题</TableCell>
              <TableCell>分类</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 修正字段访问：article.id 和 article.name */}
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.id}</TableCell>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.name || '未分类'}</TableCell>
                <TableCell>{new Date(article.CreatedAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => navigate(`/article/${article.id}`)}>详情</Button>
                  <IconButton size="small" onClick={() => navigate(`/article/edit/${article.id}`)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(article.id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          文章管理
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
          <TextField
            label="搜索文章标题"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}><SearchIcon /></IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/article/create')} // 跳转到新建文章页
          >
            写文章
          </Button>
        </Box>
        
        {renderContent()}

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={totalArticles}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="每页行数:"
        />
      </Paper>
    </Box>
  );
};

export default ArticleListPage;
// src/pages/ArticleDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articlesApi, commentsApi } from '../services/api'; // 引入 commentsApi
import type { IRspFindArticle, IRspComment, IReqAddComment } from '../utils/types'; // 引入标准类型
import { 
    Box, 
    Typography, 
    Paper, 
    CircularProgress, 
    Alert, 
    Divider, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton,
    TextField,
    Button
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';


const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  // 使用从 types.ts 导入的类型
  const [article, setArticle] = useState<IRspFindArticle | null>(null);
  const [comments, setComments] = useState<IRspComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newComment, setNewComment] = useState('');

  // 并行获取文章和评论
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const articleId = parseInt(id, 10);
      // 使用 Promise.all 并行请求
      const [articleRes, commentsRes] = await Promise.all([
        articlesApi.getArticleDetail(articleId),
        commentsApi.getComments(articleId) // 修正：使用 commentsApi
      ]);
      
      // 正确处理 IApiResponse 结构
      if (articleRes.data && articleRes.data.status === 200) {
        setArticle(articleRes.data.data);
      } else {
        throw new Error(articleRes.data.message || '获取文章详情失败');
      }

      if (commentsRes.data && commentsRes.data.status === 200) {
        setComments(commentsRes.data.data || []);
      } else {
        // 评论加载失败不应阻塞文章显示
        console.error(commentsRes.data.message || '获取评论列表失败');
      }

    } catch (err: any) {
      // 优先使用后端返回的错误信息
      const errMsg = err.response?.data?.message || err.message || '数据加载失败';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;
    try {
        const postData: IReqAddComment = {
            article_id: parseInt(id, 10),
            content: newComment,
        };
        // 修正：使用 commentsApi.addComment
        await commentsApi.addComment(postData);
        setNewComment('');
        fetchData(); // 重新加载数据以显示新评论
    } catch (err: any) {
        alert(err.response?.data?.message || '评论失败');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if(window.confirm('确定删除这条评论吗?')) {
        try {
            // 修正：使用 commentsApi.deleteComment
            await commentsApi.deleteComment(commentId);
            fetchData(); // 重新加载
        } catch (err: any) {
            alert(err.response?.data?.message || '删除失败');
        }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  if (!article) return <Typography sx={{ m: 3, textAlign: 'center' }}>未找到文章</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* 文章内容 - 修正字段访问 */}
        <Typography variant="h4" component="h1" gutterBottom>{article.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          分类: {article.name || '无'} | 发布于: {new Date(article.CreatedAt).toLocaleDateString()}
        </Typography>
        <Divider sx={{ my: 2 }} />
        {/* 使用 dangerouslySetInnerHTML 来渲染后端返回的 HTML 内容 */}
        <Box dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* 评论区 */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" gutterBottom>评论区</Typography>
        <List>
          {comments.length > 0 ? comments.map(comment => (
            <ListItem key={comment.ID} secondaryAction={
                <IconButton edge="end" onClick={() => handleDeleteComment(comment.ID)}>
                    <DeleteIcon />
                </IconButton>
            }>
              <ListItemText 
                primary={comment.content}
                // 修正字段访问：comment.commentator 和 comment.CreatedAt
                secondary={`${comment.commentator || '匿名用户'} - ${new Date(comment.CreatedAt).toLocaleString()}`}
              />
            </ListItem>
          )) : <Typography>暂无评论</Typography>}
        </List>

        {/* 添加评论 */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <TextField
                label="添加一条新评论"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddComment}>提交</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ArticleDetailPage;
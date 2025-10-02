import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { articlesApi, commentsApi } from '../api/api';
import type { IRspArticle, IRspComment } from '../api/types';
import { useAuth } from '../context/AuthContext';

// Comment Form Component
interface CommentFormProps {
  articleId: number;
  onCommentAdded: () => void; // Callback to refresh comments
}

const CommentForm = ({ articleId, onCommentAdded }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('评论内容不能为空');
      return;
    }
    try {
      await commentsApi.addComment({ articleId, content });
      setContent('');
      setError(null);
      onCommentAdded(); // Trigger refresh
    } catch (err) {
      setError('发表评论失败，请稍后重试。');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h3 className="text-xl font-semibold mb-4">发表评论</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
        rows={4}
        placeholder="写下你的想法..."
      ></textarea>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button type="submit" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        提交
      </button>
    </form>
  );
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const [article, setArticle] = useState<IRspArticle | null>(null);
  const [comments, setComments] = useState<IRspComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticleAndComments = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const articleId = parseInt(id, 10);
      const [articleRes, commentsRes] = await Promise.all([
        articlesApi.getArticleDetail(articleId),
        commentsApi.getComments(articleId),
      ]);
      setArticle(articleRes.data.data);
      setComments(commentsRes.data.data || []);
    } catch (err) {
      setError('加载文章失败，请检查URL或稍后重试。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticleAndComments();
  }, [fetchArticleAndComments]);

  if (loading) {
    return <div className="text-center p-8">加载中...</div>;
  }

  if (error || !article) {
    return <div className="text-center text-red-500 p-8">{error || '未找到文章。'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
      <div className="text-sm text-gray-500 mb-8">
        <span>发布于 {new Date(article.createdAt).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>分类：{article.category.name}</span>
      </div>
      
      {/* Article Content */}
      <div 
        className="prose lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Comments Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">评论区 ({comments.length})</h2>
        {isAuthenticated ? (
          <CommentForm articleId={article.id} onCommentAdded={fetchArticleAndComments} />
        ) : (
          <p className="text-gray-600">请<a href="/login" className="text-indigo-600">登录</a>后发表评论。</p>
        )}
        <div className="mt-8 space-y-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  {/* Placeholder for avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{comment.commentator || '匿名用户'}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-800 mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">暂无评论。</p>
          )}
        </div>
      </div>
    </div>
  );
}

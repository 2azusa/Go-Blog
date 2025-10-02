import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { articlesApi } from '../api/api';
import type { IRspArticle } from '../api/types';
import ArticleCard from '../components/articles/ArticleCard';

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        上一页
      </button>
      <div className="hidden md:flex items-center space-x-2">
        {pageNumbers.map(number => (
          <button 
            key={number} 
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === number ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {number}
          </button>
        ))}
      </div>
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        下一页
      </button>
    </div>
  );
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function HomePage() {
  const [articles, setArticles] = useState<IRspArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagenum, setPagenum] = useState<number>(1);
  const [pagesize] = useState<number>(6);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  const query = useQuery();
  const searchTerm = query.get('title');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { pagenum, pagesize, title: searchTerm || undefined };
        const response = await articlesApi.getArticles(params);
        setArticles(response.data.data || []);
        setTotalArticles(response.data.total || 0);
      } catch (err) {
        setError('获取文章失败，请稍后重试。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [pagenum, pagesize, searchTerm]);

  const handlePageChange = (page: number) => {
    setPagenum(page);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div>加载中...</div></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const totalPages = Math.ceil(totalArticles / pagesize);
  const pageTitle = searchTerm ? `搜索结果: "${searchTerm}"` : '最新文章';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>
      {articles.length > 0 ? (
        <>
          <div className="flex flex-col gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination 
              currentPage={pagenum} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">{searchTerm ? '没有找到匹配的文章。' : '暂无文章'}</p>
      )}
    </div>
  );
}

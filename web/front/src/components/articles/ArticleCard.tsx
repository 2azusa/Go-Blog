import { Link } from 'react-router-dom';
import type { IRspArticle } from '../../api/types';

interface ArticleCardProps {
  article: IRspArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/articles/${article.id}`} className="flex flex-row items-center overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white">
      {/* Image Container: Fixed width, non-shrinking */}
      <div className="flex-shrink-0 w-40 relative">
        <div className="aspect-square">
          <img 
            className="w-full h-full object-cover" 
            src={article.img || 'https://via.placeholder.com/150'} 
            alt={article.title} 
          />
          {article.category && (
            <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">{article.category.name}</span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col justify-between self-stretch">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.desc}</p>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mt-2">
          <span>{formattedDate}</span>
          <span>{article.comments?.length || 0} 条评论</span>
        </div>
      </div>
    </Link>
  );
}

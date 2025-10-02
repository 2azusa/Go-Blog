import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../api/api';
import type { IRspCategory } from '../api/types';

export default function CategoryListPage() {
  const [categories, setCategories] = useState<IRspCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Assuming we want to fetch all categories, so using a high limit or backend default
        const response = await categoryApi.getCategories({ pagenum: 1, pagesize: 100 });
        setCategories(response.data.data || []);
      } catch (err) {
        setError('获取分类列表失败。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center p-8">加载中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">所有分类</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={`/categories/${category.id}`}
            className="block p-6 bg-white rounded-lg shadow text-center hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

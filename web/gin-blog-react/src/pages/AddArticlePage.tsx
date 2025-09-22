import React from 'react';
// 从我们的功能模块出口导入 ArticleForm
import { ArticleForm } from '../features/Article'; // 同样，注意路径

const AddArticlePage: React.FC = () => {
  // 页面组件只负责渲染功能组件
  // 未来可以在这里添加 Layout、PageHeader 等
  return <ArticleForm />;
};

export default AddArticlePage;
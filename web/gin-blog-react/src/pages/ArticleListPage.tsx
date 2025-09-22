import React from 'react';
// Import the feature component from the feature's index file
import { ArticleList } from '../features/Article'; // <-- Note the clean import path

const ArticleListPage: React.FC = () => {
  // The page layer is simple. It renders the feature component.
  // You could add a page-specific Layout or PageHeader here in the future.
  return <ArticleList />;
};

export default ArticleListPage;
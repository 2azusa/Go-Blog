import React from 'react';
// Import from the feature's public entry point
import { CategoryList } from '../features/Category';

const CategoryListPage: React.FC = () => {
  // The page component's only job is to render the feature component.
  return <CategoryList />;
};

export default CategoryListPage;
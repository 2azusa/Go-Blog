import React from 'react';
// Import the feature component from its public entry point
import { LoginForm } from '../features/Auth';
const LoginPage: React.FC = () => {
// The page's only responsibility is to render the LoginForm feature.
  return <LoginForm />;
};
export default LoginPage;
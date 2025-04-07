// src/router/index.jsx
import { createBrowserRouter } from 'react-router-dom';

import App from '../App';
import Home from '../pages/Home';
import SignUp from '../auth/SignupForm';
import SignInForm from '../auth/SignInForm';

// Admin
import AdminLayout from '../admin/AdminLayout';
import Dashboard from '../admin/pages/Dashboard';
// (Optional) Other admin pages can be imported too

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home imagePath="/assets/images/" baseUrl="/" /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'signin', element: <SignInForm /> },
    ],
  },

  // 🔐 Admin Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      // Add more admin routes like:
      // { path: 'users', element: <UsersPage /> },
    ],
  },
]);

export default router;

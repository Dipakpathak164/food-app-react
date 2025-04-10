// src/router/index.jsx
import { createBrowserRouter } from 'react-router-dom';

import App from '../App';
import Home from '../pages/Home';
import SignUp from '../auth/SignupForm';
import SignInForm from '../auth/SignInForm';
import ProductDetails from '../pages/ProductDetail';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/Checkout';

// Admin
import AdminLayout from '../admin/AdminLayout';
import Dashboard from '../admin/pages/Dashboard';
import AddFood from '../admin/pages/AddFood';
import FoodLists from '../admin/pages/FoodLists';
import EditFood from '../admin/pages/EditFood'
import Customers from '../admin/pages/CustomersTable';
import Orders from '../admin/pages/OrdersWithCustomers'
// (Optional) Other admin pages can be imported too

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home imagePath="/assets/images/" baseUrl="/" /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'signin', element: <SignInForm /> },
      { path: 'product-details/:id', element: <ProductDetails /> }, 
      { path: 'cart', element: <CartPage imagePath="/assets/images/" /> },
      { path: 'cart/:id', element: <CartPage  imagePath="/assets/images/"/> },
      { path: 'checkout', element: <CheckoutPage imagePath="/assets/images/" /> },
    ],
  },

  // 🔐 Admin Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      // Add more admin routes like:
      { path: 'add-food-items', element: <AddFood /> },
      { path: 'foods', element: <FoodLists /> },
      { path: 'foods/edit/:id', element: <EditFood /> },
      { path: 'customers', element: <Customers /> },
      { path: 'orders', element: <Orders /> },
    ],
  },
]);

export default router;

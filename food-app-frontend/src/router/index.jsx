import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import SignUp from '../auth/SignupForm';
import SignInForm from '../auth/SignInForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home imagePath="/assets/images/" baseUrl="/"/> },
      { path: 'signup', element: <SignUp /> },
      { path: 'signin', element: <SignInForm /> },
    ],
  },
]);

export default router;

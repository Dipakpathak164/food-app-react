// layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-page-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;

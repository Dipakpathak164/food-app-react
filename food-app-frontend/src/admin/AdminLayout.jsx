// src/admin/AdminLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <div className="d-flex justify-content-end align-items-center p-3 border-bottom">
          <div className="dropdown">
            <button className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
              {user?.name || 'Admin'}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

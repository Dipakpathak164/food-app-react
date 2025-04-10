import { useState } from 'react'; // 👈 Add useState
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { MdLogout } from 'react-icons/md';


const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 👈 State to control sidebar

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className={`d-flex admin-layout-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}> {/* 👈 dynamic class here */}
      <div className="sidebar-fixed">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} /> {/* 👈 pass props */}
      </div>

      <div className="flex-grow-1 dashboard-inner-content">
        <div className="top-header d-flex justify-content-end align-items-center p-3 border-bottom">
          <div className="dropdown">
            <button className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
              {user?.name || 'Admin'}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" onClick={handleLogout}><MdLogout /> Logout</button></li>
            </ul>
          </div>
        </div>

        <Toaster position="center" toastOptions={{ duration: 3000 }} />

        <div className="p-4 outer_div">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

// src/admin/components/Sidebar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Admin.css'; // You can style as needed

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        ☰
      </button>
      <ul className="sidebar-menu">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/settings">Settings</Link></li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;

// src/admin/components/Sidebar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdPeople, MdFastfood, MdShoppingCart } from 'react-icons/md';

import '../Admin.css'; // You can style as needed

const Sidebar = ({ collapsed, setCollapsed }) => {
    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
               ☰
            </button>
            <ul className="sidebar-menu">
                <li>
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <MdDashboard className="me-2" /> <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/customers"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <MdPeople className="me-2" /> <span>Customers</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <MdShoppingCart className="me-2" /> <span>Orders</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/foods"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <MdFastfood className="me-2" /> <span>Foods</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

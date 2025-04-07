// src/admin/components/Breadcrumbs.jsx
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();

  const breadcrumbMap = {
    dashboard: 'Dashboard',
    orders: 'Orders',
    customers: 'Customers',
    foods:'Food List',
  };

  const pathnames = location.pathname
    .split('/')
    .filter((x) => x && x !== 'admin');

  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = `/admin/${pathnames.slice(0, index + 1).join('/')}`;
          const label = breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li key={name} className="breadcrumb-item active" aria-current="page">
              {label}
            </li>
          ) : (
            <li key={name} className="breadcrumb-item">
              <Link to={routeTo}>{label}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

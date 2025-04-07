import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();

  const breadcrumbMap = {
    dashboard: 'Dashboard',
    orders: 'Orders',
    customers: 'Customers',
    foods: 'Food List',
    'add-food-items': 'Add new food',
    // Add more mappings as needed
  };

  let pathnames = location.pathname
    .split('/')
    .filter((x) => x && x !== 'admin');

  // ✅ Manually insert virtual parent for certain pages
  if (pathnames.includes('add-food-items') && !pathnames.includes('foods')) {
    pathnames = ['foods', ...pathnames];
  }

  const generateLink = (index) => `/admin/${pathnames.slice(0, index + 1).join('/')}`;

  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb">
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const routeTo = generateLink(index);
          const label = breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <li
              key={name}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? label : <Link to={routeTo}>{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

// src/admin/pages/Dashboard.jsx
import AdminStatsChart from '../components/AdminStatsChart';

const Dashboard = () => {
    return (
      <div className="p-4">
        <h2 className='mb-4'>Welcome, Super Admin 👑</h2>
         <AdminStatsChart />
      </div>
    );
  };
  
  export default Dashboard;
  
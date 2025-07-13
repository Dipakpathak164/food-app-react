import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#e84242', '#00C49F', '#FFBB28']; // Customize as needed

const AdminStatsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`)
      .then(res => {
        const { customers, orders, foods } = res.data;

        // Transform data for pie chart
        setData([
          { name: 'Customers', value: customers },
          { name: 'Orders', value: orders },
          { name: 'Foods', value: foods }
        ]);
      })
      .catch(err => console.error('❌ Failed to fetch stats', err));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="mb-4 text-center">Platform Overview</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminStatsChart;

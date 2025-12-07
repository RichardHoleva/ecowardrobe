import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const WEARS_PER_AVOIDED_ITEM = 10;
const CO2_PER_AVOIDED_ITEM = 5; // kg
const GOAL_CO2 = 50; // kg – you can change this

export default function Chart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const { data, error } = await supabase.from('items').select('wear_count');

      if (error) {
        console.error('Error fetching items for chart:', error);
        setLoading(false);
        return;
      }

      const totalWears = data.reduce(
        (sum, item) => sum + (item.wear_count || 0),
        0
      );
      const avoidedItems = Math.floor(totalWears / WEARS_PER_AVOIDED_ITEM);
      const co2Saved = avoidedItems * CO2_PER_AVOIDED_ITEM;

      const chartValues = [
        { name: 'Saved', value: co2Saved },
        { name: 'Goal', value: GOAL_CO2 },
      ];

      setChartData(chartValues);
      setLoading(false);
    }

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="chart-container">
        <p style={{ color: '#9ca3af', textAlign: 'center' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d5a45" />
          <XAxis dataKey="name" stroke="#ffffff" tick={{ fill: '#ffffff', fontSize: 12 }} />
          <YAxis stroke="#ffffff" tick={{ fill: '#ffffff', fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value} kg`, 'CO₂']}
            labelFormatter={(label) => label}
            contentStyle={{
              backgroundColor: '#0d1f1a',
              border: '1px solid #2d5a45',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#ffffff' }}
            itemStyle={{ color: '#F0FF1B' }}
          />
          <Bar dataKey="value" fill="#F0FF1B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

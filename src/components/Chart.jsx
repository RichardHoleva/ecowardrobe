import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const WEARS_PER_AVOIDED_ITEM = 10;
const CO2_PER_AVOIDED_ITEM = 5; // kg
const GOAL_CO2 = 150; // kg

export default function Chart() {
  const [co2Saved, setCo2Saved] = useState(0);
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
      const saved = avoidedItems * CO2_PER_AVOIDED_ITEM;

      setCo2Saved(saved);
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

  const percentage = Math.min((co2Saved / GOAL_CO2) * 100, 100);
  const circumference = 2 * Math.PI * 70; // radius = 70
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Calculate km equivalent (assuming ~0.068 kg CO2 per km)
  const kmEquivalent = Math.round(co2Saved / 0.068);

  return (
    <>
    <div className="donut-chart-container">
      <h3 className="donut-chart-label">CO₂ savings</h3>
      
      <div className="donut-chart-wrapper">
        <svg width="120" height="120" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#1a3a2e"
            strokeWidth="20"
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#F0FF1B"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        
        <div className="donut-chart-center">
          <div className="donut-chart-value">{co2Saved}</div>
          <div className="donut-chart-unit">kg</div>
        </div>
      </div>
      
      <div className="donut-chart-goal">Goal: {GOAL_CO2} kg</div>
    </div>
    <div className="donut-chart-equivalent">
        Equivalent to {kmEquivalent} km of driving <i className="fa-solid fa-car-side"></i>
    </div>
    </>
  );
}
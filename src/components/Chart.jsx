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
  const kmEquivalent = Math.round(co2Saved / 0.068);

  return (
    <div className="progress-chart-container">
      <h3 className="progress-chart-title">Your CO₂ savings</h3>
      
      <div className="progress-chart-value">
        <span className="progress-value">{co2Saved} kg</span>
        <span className="progress-label">/ {GOAL_CO2} kg</span>
      </div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar-background">
          <div 
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <p className="progress-chart-equivalent">
        = {kmEquivalent} km of driving avoided <i className="fa-solid fa-car-side"></i>
      </p>

      <p className="progress-chart-footnote">
        Rewearing what you own reduces the CO₂ footprint of fashion production.
      </p>
    </div>
  );
}
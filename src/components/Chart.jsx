// src/components/Chart.jsx
import { useItems } from '../context/ItemsContext';

const GOAL_CO2 = 150; // kg

export default function Chart() {
  const { co2Saved, loading } = useItems();

  if (loading) {
    return (
      <div className="progress-chart-container">
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#9ca3af' }}>Loading…</p>
        </div>
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
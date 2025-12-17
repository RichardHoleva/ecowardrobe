// src/components/Chart.jsx
import { memo } from 'react';
import { useItems } from '../context/ItemsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

const GOAL_CO2 = 150; // kg

function Chart() {
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

  // Calculate progress percentage toward goal
  const percentage = Math.min((co2Saved / GOAL_CO2) * 100, 100);
  // Convert CO2 to km equivalent (1 km ≈ 0.12 kg CO2 for average car)
  const kmEquivalent = Math.round(co2Saved / 0.12);

  return (
    <div className="progress-chart-container">
      <h3 className="progress-chart-title">Your CO₂ savings</h3>
      
      <div className="progress-chart-value">
        <span className="progress-value">{co2Saved} kg</span>
        <span className="progress-label">/ {GOAL_CO2} kg</span>
      </div>

      {/* Visual progress bar */}
      <div className="progress-bar-wrapper">
        <div className="progress-bar-background">
          <div 
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <p className="progress-chart-equivalent">
        = {kmEquivalent} km of driving avoided <FontAwesomeIcon icon={faCar} />
      </p>

      <p className="progress-chart-footnote">
        Rewearing what you own reduces the CO₂ footprint of fashion production.
      </p>
    </div>
  );
}

export default memo(Chart);
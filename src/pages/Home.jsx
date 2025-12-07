import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Chart from '../components/Chart';
import Logo from '../assets/logo.png';

export default function Home() {
  const [user, setUser] = useState(null);
  const [totalWears, setTotalWears] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);

      const { data, error } = await supabase
        .from('items')
        .select('wear_count');

      if (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
        return;
      }

      const wears = data.reduce((sum, item) => sum + (item.wear_count || 0), 0);
      setTotalWears(wears);
      setLoading(false);
    }

    fetchStats();
  }, []);

  const avoidedItems = Math.floor(totalWears / 10);
  const estimatedCO2SavedKg = avoidedItems * 5;

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="home-profile">
          <span>Profile</span>
        </div>
      </div>

      <h1 className="home-greeting">
        Hello <span className="home-name">{firstName}</span>
      </h1>

      <div className="saved-co2-card">
        <h2 className="saved-co2-title">Saved CO₂</h2>
          <Chart />

      </div>

      <Navbar />
    </div>
  );
}
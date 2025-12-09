import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Chart from '../components/Chart';
import Logo from '../assets/logo.png';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

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

      <div className="home-content">
        <h1 className="home-greeting">
          <span className='greeting'>Hello, </span> <span className="home-name">{firstName}</span>
        </h1>
        
        <p className="home-subtitle">Here is your impact on the planet</p>

        <Chart />
      </div>

      <Navbar />
    </div>
  );
}
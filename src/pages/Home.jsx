import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Chart from '../components/Chart';
import Filter from '../components/Filter';
import StreakCounter from '../components/StreakCounter';
import ItemCard from '../components/ItemCard';
import Logo from '../assets/logo.png';

export default function Home() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // Show only 6 most recent items on home page

      if (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
        return;
      }

      setItems(data || []);
      setLoading(false);
    }

    fetchItems();
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  // Filter items based on selected category
  const visibleItems =
    filteredCategory === 'all'
      ? items
      : items.filter((item) => item.category === filteredCategory);

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <StreakCounter />
      </div>

      <div className="home-content">
        <h1 className="home-greeting">
          <span className='greeting'>Hello, </span> <span className="home-name">{firstName}</span>
        </h1>
        
        <p className="home-subtitle">Here is your impact on the planet</p>

        <Chart />
      </div>

      <div className='wardrobe-preview'>
        <h3 className='wardrobe-preview-title'>Your Wardrobe</h3>
        <h3 className='wardrobe-preview-link' onClick={() => navigate('/wardrobe')}>
          See All &rarr;
        </h3>
      </div>
      
      <Filter onFilterChange={setFilteredCategory} />

      {/* Display Items */}
      <div className="items-container" style={{ padding: '0 1rem', marginBottom: '5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>Loading items...</p>
        ) : visibleItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>
            No items yet. Add your first item to get started!
          </p>
        ) : (
          visibleItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        )}
      </div>

      <Navbar />
    </div>
  );
}
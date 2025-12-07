import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ItemCard from '../components/ItemCard.jsx';
import Navbar from '../components/Navbar';

const categories = ['all', 'top', 'bottom', 'shoes', 'outerwear'];

export default function Wardrobe() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
        return;
      }

      setItems(data);
      setLoading(false);
    }

    fetchItems();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    navigate('/login');
  };

  const visibleItems =
    filteredCategory === 'all'
      ? items
      : items.filter((item) => item.category === filteredCategory);

  return (
    <>
      <Navbar />
        <section>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Your wardrobe</h2>
                <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                  See the clothes you&apos;ve added and how often you wear them.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="btn"
                style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Log out
              </button>
            </div>

            <div
              role="radiogroup"
              aria-label="Filter wardrobe by category"
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilteredCategory(cat)}
                  aria-pressed={filteredCategory === cat}
                  style={{
                    background: filteredCategory === cat ? '#22c55e' : '#111827',
                    color: filteredCategory === cat ? '#022c22' : '#e5e7eb',
                    borderRadius: '999px',
                    padding: '0.3rem 0.8rem',
                    border: '1px solid #374151',
                    fontSize: '0.8rem',
                  }}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p>Loading wardrobe…</p>
          ) : visibleItems.length === 0 ? (
            <div className="card">
              <p>No items here yet. Try adding your first piece of clothing.</p>
            </div>
          ) : (
            visibleItems.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </section>
    </>
  );
}
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
        return;
      }

      setItem(data);
      setLoading(false);
    }

    fetchItem();
  }, [id]);

  async function handleWearToday() {
    if (!item) return;
    setSaving(true);
    setMessage('');

    const newWearCount = (item.wear_count || 0) + 1;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const { data, error } = await supabase
      .from('items')
      .update({ wear_count: newWearCount, last_worn: today })
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating wear count:', error);
      setMessage('Could not log wear, please try again.');
      setSaving(false);
      return;
    }

    setItem(data);
    setSaving(false);
    setMessage('Logged that you wore this today!');
  }

  function getCareAdvice() {
    // SUPER simple care advice based on category – you can expand this.
    if (!item) return null;

    if (item.category === 'outerwear') {
      return (
        <>
          <p>Try to air out jackets instead of washing after every wear.</p>
          <p>Wash rarely and on a gentle cycle to make them last longer.</p>
        </>
      );
    }

    if (item.category === 'shoes') {
      return (
        <>
          <p>Clean shoes with a damp cloth instead of machine washing.</p>
          <p>Let them dry naturally – no direct heaters.</p>
        </>
      );
    }

    return (
      <>
        <p>Only wash when it&apos;s actually dirty – not after every single wear.</p>
        <p>Use cold water and air dry to save energy and protect the fabric.</p>
      </>
    );
  }

  function getWearMessage() {
    if (!item) return null;
    const count = item.wear_count || 0;

    if (count < 3) {
      return 'Still pretty new! Wearing it a few more times helps avoid buying something similar.';
    }
    if (count < 10) {
      return 'Nice, this item is getting some love. Keep rewearing instead of buying new.';
    }
    return 'Amazing! You really made the most of this piece – that’s great for your wallet and the planet.';
  }

  if (loading) {
    return <p>Loading item…</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  return (
    <>
      <Navbar />
        <section className="card">
          <h2>{item.name}</h2>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
            {item.category} · {item.brand_type.replace('_', ' ')}{' '}
            {item.purchase_year ? `· bought in ${item.purchase_year}` : ''}
          </p>

          <p>
            Worn <strong>{item.wear_count}</strong> times.
            {item.last_worn && (
              <span style={{ fontSize: '0.85rem', color: '#9ca3af', marginLeft: '0.3rem' }}>
                Last worn: {item.last_worn}
              </span>
            )}
          </p>

          <button type="button" onClick={handleWearToday} disabled={saving}>
            {saving ? 'Logging…' : 'I wore this today'}
          </button>

          {message && <p className="success" role="status">{message}</p>}

          <div style={{ marginTop: '1rem' }}>
            <h3>Wear &amp; sustainability</h3>
            <p style={{ fontSize: '0.9rem' }}>{getWearMessage()}</p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3>Care advice</h3>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              Washing less often and on lower temperatures saves water and energy, and makes clothes last longer.
            </p>
            <div style={{ fontSize: '0.9rem' }}>
              {getCareAdvice()}
            </div>
          </div>
        </section>
    </>
  );
}

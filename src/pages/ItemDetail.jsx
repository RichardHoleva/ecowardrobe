// src/pages/ItemDetail.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useItems } from '../context/ItemsContext';
import Navbar from '../components/Navbar';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, updateItem, deleteItem } = useItems();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // First check if item exists in context (faster)
    const cachedItem = items.find(i => i.id === id);
    if (cachedItem) {
      setItem(cachedItem);
      setLoading(false);
    } else {
      // Fallback to fetching from database
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
    }
  }, [id, items]);

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

    // Update both local state and context
    setItem(data);
    updateItem(item.id, { wear_count: newWearCount, last_worn: today });
    
    setSaving(false);
    setMessage('Logged that you wore this today!');
  }

  async function handleDelete() {
    if (!item) return;
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    setDeleting(true);

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', item.id);

    if (error) {
      console.error('Error deleting item:', error);
      setMessage('Could not delete item. Please try again.');
      setDeleting(false);
      return;
    }

    deleteItem(item.id);
    navigate('/wardrobe');
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !item) return;

    setUploading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      setMessage('Failed to upload image.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('items')
      .update({ image_url: publicUrl })
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating image:', error);
      setMessage('Failed to update image.');
      setUploading(false);
      return;
    }

    setItem(data);
    updateItem(item.id, { image_url: publicUrl });
    setMessage('Image updated!');
    setUploading(false);
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
    return 'Amazing! You really made the most of this piece – that&apos;s sustainable fashion.';
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="detail-page">
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>Loading...</p>
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="detail-page">
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>Item not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="detail-page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>

        <div className="detail-image">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} />
          ) : (
            <div className="detail-no-image">
              <i className="fas fa-tshirt"></i>
            </div>
          )}
          <button 
            className="edit-image-btn" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Change photo"
          >
            <i className="fas fa-camera"></i>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        <div className="detail-content">
          <h1 className="detail-title">{item.name}</h1>
          <p className="detail-meta">
            {item.category} · {item.brand_type.replace('_', ' ')}
          </p>

          <div className="detail-wear-info">
            <span className="wear-label">Worn</span>
            <span className="wear-number">{item.wear_count || 0}</span>
            <span className="wear-label">times</span>
          </div>

          {item.last_worn && (
            <p className="last-worn">Last worn: {item.last_worn}</p>
          )}

          <button className="btn-wear" onClick={handleWearToday} disabled={saving}>
            {saving ? 'Logging...' : 'I wore this today'}
          </button>

          {message && <p className="detail-message">{message}</p>}

          <div className="detail-section">
            <h3>Sustainability</h3>
            <p>{getWearMessage()}</p>
          </div>

          <div className="detail-section">
            <h3>Care tips</h3>
            <p className="care-intro">
              Washing less often and on lower temperatures saves water and energy.
            </p>
            {getCareAdvice()}
          </div>

          <button className="btn-delete" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Item'}
          </button>
        </div>
      </div>
    </>
  );
}
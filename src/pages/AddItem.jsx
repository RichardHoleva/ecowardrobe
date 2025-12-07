import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

export default function AddItem() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('top');
  const [brandType, setBrandType] = useState('fast_fashion');
  const [purchaseYear, setPurchaseYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter a name for the item.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('items').insert([
      {
        name: name.trim(),
        category,
        brand_type: brandType,
        purchase_year: purchaseYear ? Number(purchaseYear) : null,
      },
    ]);

    if (error) {
      console.error('Error adding item:', error);
      setErrorMsg('Something went wrong while saving. Please try again.');
      setLoading(false);
      return;
    }

    setSuccessMsg('Item added to your wardrobe!');
    setLoading(false);

    // small delay then go to wardrobe
    setTimeout(() => {
      navigate('/wardrobe');
    }, 800);
  }

  return (
    <>
      <Navbar />
      <section className="card">
        <h2>Add a clothing item</h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          Start by adding the pieces you wear often or want to track more closely.
        </p>

        <form onSubmit={handleSubmit} aria-describedby="add-item-description">
          <span id="add-item-description" style={{ display: 'none' }}>
            Form for adding a clothing item to your EcoWardrobe.
          </span>

          <div>
            <label htmlFor="name">Item name *</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Black hoodie"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="shoes">Shoes</option>
              <option value="outerwear">Outerwear</option>
            </select>
          </div>

          <div>
            <label htmlFor="brandType">Brand type *</label>
            <select
              id="brandType"
              value={brandType}
              onChange={(e) => setBrandType(e.target.value)}
            >
              <option value="fast_fashion">Fast fashion</option>
              <option value="second_hand">Second-hand</option>
              <option value="sustainable_brand">Sustainable brand</option>
              <option value="dont_know">Don&apos;t know</option>
            </select>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Second-hand and sustainable brands often have lower impact – and
              tracking what you already own helps you buy less overall.
            </p>
          </div>

          <div>
            <label htmlFor="purchaseYear">Purchase year</label>
            <input
              id="purchaseYear"
              type="number"
              min="2000"
              max="2100"
              placeholder="e.g. 2022"
              value={purchaseYear}
              onChange={(e) => setPurchaseYear(e.target.value)}
            />
          </div>

          {errorMsg && <p className="error" role="alert">{errorMsg}</p>}
          {successMsg && <p className="success" role="status">{successMsg}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Add item'}
          </button>
        </form>
      </section>
    </>
  );
}

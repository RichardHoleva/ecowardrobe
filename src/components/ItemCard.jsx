// src/components/ItemCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useItems } from '../context/ItemsContext';

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const { updateItem } = useItems();
  const [updating, setUpdating] = useState(false);

  async function handleWearChange(e, increment) {
    e.stopPropagation();
    if (updating) return;
    
    setUpdating(true);
    const newCount = Math.max(0, (item.wear_count || 0) + increment);
    
    const { error } = await supabase
      .from('items')
      .update({ wear_count: newCount })
      .eq('id', item.id);

    if (!error) {
      updateItem(item.id, { wear_count: newCount });
    }
    
    setUpdating(false);
  }

  function handleCardClick() {
    navigate(`/item/${item.id}`);
  }

  return (
    <div className="item-card" onClick={handleCardClick}>
      <div className="item-image">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} />
        ) : (
          <div className="item-no-image">
            <i className="fas fa-tshirt"></i>
          </div>
        )}
      </div>
      
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-category">{item.category}</p>
      </div>
      
      <div className="item-wear">
        <button 
          className="wear-btn" 
          onClick={(e) => handleWearChange(e, -1)}
          disabled={updating || item.wear_count === 0}
          aria-label="Decrease wear count"
        >
          −
        </button>
        <span className="wear-count">{item.wear_count || 0}</span>
        <button 
          className="wear-btn" 
          onClick={(e) => handleWearChange(e, 1)}
          disabled={updating}
          aria-label="Increase wear count"
        >
          +
        </button>
      </div>
    </div>
  );
}
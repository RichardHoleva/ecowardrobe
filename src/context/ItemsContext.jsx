// src/context/ItemsContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from './UserContext';

const ItemsContext = createContext();

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } else {
      // Transform image URLs to use smaller thumbnails if Supabase supports it
      const itemsWithOptimizedImages = data?.map(item => ({
        ...item,
        image_url: item.image_url ? `${item.image_url}?width=400&quality=80` : null
      }));
      setItems(itemsWithOptimizedImages || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user, fetchItems]);

  const addItem = useCallback((newItem) => {
    setItems(prev => [newItem, ...prev]);
  }, []);

  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const deleteItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const totalWears = useMemo(
    () => items.reduce((sum, item) => sum + (item.wear_count || 0), 0),
    [items]
  );

  const co2Saved = useMemo(
    () => Math.floor(totalWears / 10) * 5,
    [totalWears]
  );

  const value = useMemo(
    () => ({ 
      items, 
      loading, 
      addItem, 
      updateItem, 
      deleteItem, 
      refetch: fetchItems,
      totalWears,
      co2Saved 
    }),
    [items, loading, addItem, updateItem, deleteItem, fetchItems, totalWears, co2Saved]
  );

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
}
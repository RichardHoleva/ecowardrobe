import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from './UserContext';
import { toSupabaseRenderUrl } from '../lib/supabaseImages';

const ItemsContext = createContext();

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const cacheKey = user?.id ? `ecowardrobe.items.v1.${user.id}` : null;

  useEffect(() => {
    if (!cacheKey) return;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
        setLoading(false);
      }
    } catch {
      // ignore
    }
  }, [cacheKey]);

  const fetchItems = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('items')
      .select('id,name,category,brand_type,image_url,wear_count,last_worn,created_at,user_id')
      .eq('user_id', user.id) // ✅ CRITICAL: only your items
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
      setItems([]);
      setLoading(false);
      return;
    }

    const itemsWithThumbs = (data || []).map((item) => ({
      ...item,
      image_thumb_url: item.image_url
        ? toSupabaseRenderUrl(item.image_url, { width: 360, height: 360, quality: 75, resize: 'cover' })
        : null,
    }));

    setItems(itemsWithThumbs);

    if (cacheKey) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(itemsWithThumbs));
      } catch {
        // ignore quota
      }
    }

    setLoading(false);
  }, [user?.id, cacheKey]);

  useEffect(() => {
    if (user) fetchItems();
    else {
      setItems([]);
      setLoading(false);
    }
  }, [user, fetchItems]);

  const addItem = useCallback((newItem) => {
    const normalized = {
      ...newItem,
      image_thumb_url: newItem?.image_url
        ? toSupabaseRenderUrl(newItem.image_url, { width: 360, height: 360, quality: 75, resize: 'cover' })
        : null,
    };
    setItems((prev) => [normalized, ...prev]);
  }, []);

  const updateItem = useCallback((id, updates) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...updates };
        if (updates?.image_url) {
          next.image_thumb_url = toSupabaseRenderUrl(updates.image_url, { width: 360, height: 360, quality: 75, resize: 'cover' });
        }
        return next;
      })
    );
  }, []);

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) throw new Error('useItems must be used within an ItemsProvider');
  return context;
}

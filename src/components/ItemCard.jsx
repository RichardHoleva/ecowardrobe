import { useRef, useState, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useItems } from '../context/ItemsContext';
import { getSupabaseSrcSet, toSupabaseRenderUrl } from '../lib/supabaseImages';
import { CATEGORY_ICON, FAIcon } from '../icons/fa';

function ItemCard({ item, compact, priority = false }) {
  const navigate = useNavigate();
  const { updateItem } = useItems();
  const [updating, setUpdating] = useState(false);
  const updatingRef = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const icon = CATEGORY_ICON[item.category] ?? CATEGORY_ICON.top;

  const imgSrc = useMemo(() => {
    if (item.image_thumb_url) return item.image_thumb_url;
    if (!item.image_url) return null;
    return toSupabaseRenderUrl(item.image_url, {
      width: 360,
      height: 360,
      quality: 75,
      resize: 'cover',
    });
  }, [item.image_thumb_url, item.image_url]);

  const imgSrcSet = useMemo(() => {
    if (!item.image_url) return undefined;
    return getSupabaseSrcSet(item.image_url, {
      width: 360,
      height: 360,
      quality: 75,
      resize: 'cover',
    });
  }, [item.image_url]);

  const handleWearChange = useCallback(
    async (e, increment) => {
      e.stopPropagation();
      if (updatingRef.current) return;

      updatingRef.current = true;
      setUpdating(true);

      const newCount = Math.max(0, (item.wear_count || 0) + increment);

      const { error } = await supabase
        .from('items')
        .update({ wear_count: newCount })
        .eq('id', item.id);

      if (!error) updateItem(item.id, { wear_count: newCount });

      updatingRef.current = false;
      setUpdating(false);
    },
    [item.id, item.wear_count, updateItem]
  );

  const handleCardClick = useCallback(() => {
    navigate(`/item/${item.id}`);
  }, [navigate, item.id]);

  return (
    <div className={`item-card${compact ? ' compact' : ''}`} onClick={handleCardClick}>
      <div className={`item-image ${imgSrc && !imageLoaded ? 'loading' : ''}`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            srcSet={imgSrcSet}
            sizes="(max-width: 600px) 50vw, 280px"
            alt={item.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchpriority={priority ? 'high' : 'auto'}
            onLoad={() => setImageLoaded(true)}
            width="360"
            height="360"
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        ) : (
          <div className="item-no-image" aria-label={item.category || 'item'}>
            <FAIcon icon={icon} />
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

export default memo(ItemCard);

// src/hooks/useInfiniteScroll.js
import { useState, useEffect, useCallback, useRef } from 'react';

export function useInfiniteScroll(items, itemsPerPage = 12) {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  // Reset when items change
  useEffect(() => {
    const initialItems = items.slice(0, itemsPerPage);
    setDisplayedItems(initialItems);
    setPage(1);
    setHasMore(items.length > itemsPerPage);
  }, [items, itemsPerPage]);

  // Load more items
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * itemsPerPage;
    const newItems = items.slice(startIndex, endIndex);
    
    setDisplayedItems(newItems);
    setPage(nextPage);
    setHasMore(endIndex < items.length);
  }, [items, page, itemsPerPage]);

  // Intersection observer callback
  const lastItemRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      
      if (node) observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  return { displayedItems, hasMore, lastItemRef };
}
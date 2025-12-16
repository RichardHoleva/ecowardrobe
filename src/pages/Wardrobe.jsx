// src/pages/Wardrobe.jsx - Updated
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import { useUser } from '../context/UserContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import ItemCard from '../components/ItemCard.jsx';
import Navbar from '../components/Navbar';
import Filter from '../components/Filter';

const categories = ['all', 'top', 'bottom', 'shoes', 'outerwear'];

export default function Wardrobe() {
  const navigate = useNavigate();
  const { items, loading } = useItems();
  const { profile } = useUser();
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (category) => {
    setFilteredCategory(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Filter items by category and search query
  const filteredItems = items.filter((item) => {
    const matchesCategory = filteredCategory === 'all' || item.category === filteredCategory;
    const matchesSearch =
      searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const { displayedItems, hasMore, lastItemRef } = useInfiniteScroll(filteredItems, 20);

  const avatarUrl = profile?.avatar_url;

  return (
    <>
      <Navbar />
      <div className="wardrobe-page">
        <div className="wardrobe-header">
          <h1 className="wardrobe-title">Your Wardrobe</h1>
          <button
            onClick={() => navigate('/profile')}
            className="profile-icon-btn"
            aria-label="View account"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="profile-icon-img" />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </button>
        </div>

        <p className="wardrobe-subtitle">
          See the clothes you&apos;ve added and how often you wear them.
        </p>

        <Filter onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />

        {loading ? (
          <p className="loading-text">Loading your wardrobe...</p>
        ) : displayedItems.length === 0 ? (
          <p className="no-items-text">
            {searchQuery
              ? `No items found matching "${searchQuery}"`
              : filteredCategory === 'all'
              ? 'Your wardrobe is empty. Add your first item!'
              : `No ${filteredCategory} items yet.`}
          </p>
        ) : (
          <div className="wardrobe-grid">
            {displayedItems.map((item, index) => {
              // Attach ref to the last item for infinite scroll
              if (index === displayedItems.length - 1) {
                return (
                  <div key={item.id} ref={lastItemRef}>
                    <ItemCard item={item} compact />
                  </div>
                );
              }
              return <ItemCard key={item.id} item={item} compact />;
            })}
            {hasMore && (
              <div className="loading-more">
                <p>Loading more items...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
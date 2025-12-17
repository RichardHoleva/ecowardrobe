// src/pages/Wardrobe.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import { useUser } from '../context/UserContext';
import ItemCard from '../components/ItemCard.jsx';
import Navbar from '../components/Navbar';
import Filter from '../components/Filter';
import { COMMON_ICON, FAIcon } from '../icons/fa';

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

  // Filter items by both category and search query
  const visibleItems = items.filter((item) => {
    const matchesCategory = filteredCategory === 'all' || item.category === filteredCategory;
    const matchesSearch =
      searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <FAIcon icon={COMMON_ICON.user} />
            )}
          </button>
        </div>

        <p className="wardrobe-subtitle">
          See the clothes you&apos;ve added and how often you wear them.
        </p>

        <Filter onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />

        {/* Display all wardrobe items in grid */}
        {loading ? (
          <p className="loading-text">Loading your wardrobe...</p>
        ) : visibleItems.length === 0 ? (
          <p className="no-items-text">
            {searchQuery
              ? `No items found matching "${searchQuery}"`
              : filteredCategory === 'all'
              ? 'Your wardrobe is empty. Add your first item!'
              : `No ${filteredCategory} items yet.`}
          </p>
        ) : (
          <div className="wardrobe-grid">
              {visibleItems.map((item, idx) => (
                <ItemCard key={item.id} item={item} compact priority={idx < 2} />
              ))}
          </div>
        )}
      </div>
    </>
  );
}
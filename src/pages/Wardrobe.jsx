// src/pages/Wardrobe.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ItemCard.jsx';
import Navbar from '../components/Navbar';
import Filter from '../components/Filter';

const categories = ['all', 'top', 'bottom', 'shoes', 'outerwear'];

export default function Wardrobe() {
  const navigate = useNavigate();
  const { items, loading } = useItems();
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (category) => {
    setFilteredCategory(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Filter items by category and search query
  const visibleItems = items.filter((item) => {
    // Filter by category
    const matchesCategory = filteredCategory === 'all' || item.category === filteredCategory;

    // Filter by search query (case insensitive)
    const matchesSearch =
      searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
            <i className="fa-solid fa-user"></i>
          </button>
        </div>

        <p className="wardrobe-subtitle">
          See the clothes you&apos;ve added and how often you wear them.
        </p>

        <Filter onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />

        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '2rem' }}>
            Loading your wardrobe...
          </p>
        ) : visibleItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '2rem' }}>
            {searchQuery
              ? `No items found matching "${searchQuery}"`
              : filteredCategory === 'all'
              ? 'Your wardrobe is empty. Add your first item!'
              : `No ${filteredCategory} items yet.`}
          </p>
        ) : (
          <div className="wardrobe-grid">
            {visibleItems.map((item) => (
              <ItemCard key={item.id} item={item} compact />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
// src/pages/Home.jsx - Updated
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useItems } from '../context/ItemsContext';
import Navbar from '../components/Navbar';
import Chart from '../components/Chart';
import Filter from '../components/Filter';
import StreakCounter from '../components/StreakCounter';
import ItemCard from '../components/ItemCard';
import Logo from '../assets/logo.png';

export default function Home() {
  const { user } = useUser();
  const { items, loading } = useItems();
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Show only first 8 items on home page (preview)
  const recentItems = items.slice(0, 8);
  const visibleItems = recentItems.filter((item) => {
    const matchesCategory = filteredCategory === 'all' || item.category === filteredCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Adjust grid layout based on number of items
  const hasMultipleRows = visibleItems.length > 2;
  const itemsGridClass = hasMultipleRows ? 'items-grid multi-row' : 'items-grid single-row';

  useEffect(() => {
    const progressElement = document.getElementById('scrollProgress');
    if (progressElement) {
      progressElement.style.width = '0%';
    }
  }, [itemsGridClass]);

  // Update horizontal scroll progress indicator
  function handleItemsScroll(e) {
    const { scrollWidth, clientWidth, scrollLeft } = e.target;
    const progressElement = document.getElementById('scrollProgress');
    if (!progressElement) return;
    const scrollableWidth = scrollWidth - clientWidth;
    const progress = scrollableWidth > 0 ? (scrollLeft / scrollableWidth) * 100 : 0;
    progressElement.style.width = `${progress}%`;
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-logo">
          <img src={Logo} alt="Logo" loading="lazy" />
        </div>
        <StreakCounter />
      </div>

      <div className="home-content">
        <h1 className="home-greeting">
          <span className='greeting'>Hello, </span> <span className="home-name">{firstName}</span>
        </h1>
        
        <p className="home-subtitle">Here is your impact on the planet</p>

        <Chart />
      </div>

      <div className='wardrobe-preview'>
        <h3 className='wardrobe-preview-title'>Your Wardrobe</h3>
        <h3 className='wardrobe-preview-link' onClick={() => navigate('/wardrobe')}>
          See Wardrobe &rarr;
        </h3>
      </div>
      
      <Filter 
        onFilterChange={setFilteredCategory}
        onSearchChange={handleSearchChange}
      />

      {/* Display first 8 items with horizontal scroll */}
      <div className="items-grid-wrapper">
        <div className="scroll-progress-bar">
          <div className="scroll-progress-fill" id="scrollProgress"></div>
        </div>
        <div className={itemsGridClass} onScroll={handleItemsScroll}>
          {loading ? (
            <p className="items-empty-message">Loading items...</p>
          ) : visibleItems.length === 0 ? (
            <p className="items-empty-message">
              {searchQuery
                ? `No items found matching "${searchQuery}"`
                : 'No items yet. Add your first item to get started!'}
            </p>
          ) : (
            <>
              {visibleItems.map((item, index) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  priority={index < 2}
                />
              ))}
              {!searchQuery && items.length > 8 && (
                <div className="see-full-wardrobe-container">
                  <button className="see-full-wardrobe-btn" onClick={() => navigate('/wardrobe')}>
                    <span>Full Wardrobe</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
}
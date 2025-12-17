import React, { useState } from 'react';
import { COMMON_ICON, FAIcon } from '../icons/fa';
import "../styles/global.css";

export default function Filter({ onFilterChange, onSearchChange }) {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleFilter = (category) => {
        setSelectedFilter(category);
        onFilterChange(category);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearchChange) {
            onSearchChange(query);
        }
    };

    return (
        <div className="filter-wrapper">
            <div className="search-bar-container">
                <FAIcon icon={COMMON_ICON.search} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            if (onSearchChange) {
                                onSearchChange('');
                            }
                        }}
                        className="search-clear-btn"
                        aria-label="Clear search"
                    >
                        <FAIcon icon={COMMON_ICON.close} />
                    </button>
                )}
            </div>

            <div className="filter-container">
                <button
                    className={selectedFilter === 'all' ? 'active' : ''}
                    onClick={() => handleFilter('all')}
                >
                    All
                </button>
                <button
                    className={selectedFilter === 'top' ? 'active' : ''}
                    onClick={() => handleFilter('top')}
                >
                    Top
                </button>
                <button
                    className={selectedFilter === 'bottom' ? 'active' : ''}
                    onClick={() => handleFilter('bottom')}
                >
                    Bottom
                </button>
                <button
                    className={selectedFilter === 'shoes' ? 'active' : ''}
                    onClick={() => handleFilter('shoes')}
                >
                    Shoes
                </button>
                <button
                    className={selectedFilter === 'outerwear' ? 'active' : ''}
                    onClick={() => handleFilter('outerwear')}
                >
                    Outerwear
                </button>
            </div>
        </div>
    );
}
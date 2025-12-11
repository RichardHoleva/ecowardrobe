import React, { useState } from 'react';
import "../styles/global.css";

export default function Filter({ onFilterChange }) {
    const [selectedFilter, setSelectedFilter] = useState('all');

    const handleFilter = (category) => {
        setSelectedFilter(category);
        onFilterChange(category);
    };

    return (
        <div className="filter-container">
            <button
                className={selectedFilter === 'all' ? 'active' : ''}
                onClick={() => handleFilter('all')}
            >
                All
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
                className={selectedFilter === 'top' ? 'active' : ''}
                onClick={() => handleFilter('top')}
            >
                Top
            </button>

            <button
                className={selectedFilter === 'outwear' ? 'active' : ''}
                onClick={() => handleFilter('outwear')}
            >
                OutWear
            </button>

        </div>
    );
}
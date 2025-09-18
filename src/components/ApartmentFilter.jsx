import React from 'react';
import { useTranslation } from 'react-i18next';
import './ApartmentFilter.css';

/**
 * Simple 3-button filter (All, Rent, Sale)
 * - Parent supplies `activeFilter` ('all' | 'rent' | 'sale') and `setFilter` (fn)
 * - No selects/inputs, only buttons
 */
const ApartmentFilter = ({ activeFilter = 'all', setFilter }) => {
  const { t } = useTranslation();
  const options = [
    { key: 'all', label: t('all') },
    { key: 'rent', label: t('rent') },
    { key: 'sale', label: t('sale') },
  ];

  const handleClick = (key) => {
    if (typeof setFilter === 'function') {
      setFilter(key);
    }
  };

  return (
    <div className="filter-buttons">
      {options.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={activeFilter === key ? 'active' : ''}
          aria-pressed={activeFilter === key}
          onClick={() => handleClick(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ApartmentFilter;
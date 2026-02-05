import { useState } from 'react';
import { XMarkIcon as XIcon } from '@heroicons/react/24/outline';

const FilterSidebar = ({
  filters,
  onFilterChange,
  categories,
  brands,
  isOpen,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      category: '',
      brand: '',
      condition: '',
      storage: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const storageOptions = [
    { value: '32GB', label: '32GB' },
    { value: '64GB', label: '64GB' },
    { value: '128GB', label: '128GB' },
    { value: '256GB', label: '256GB' },
    { value: '512GB', label: '512GB' },
    { value: '1TB', label: '1TB' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:inset-y-auto md:left-auto md:z-auto md:w-80 md:shadow-none md:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search products..."
              value={localFilters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="input"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              value={localFilters.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="input"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <div className="space-y-2">
              {conditionOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value={option.value}
                    checked={localFilters.condition === option.value}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value=""
                  checked={localFilters.condition === ''}
                  onChange={(e) => handleInputChange('condition', '')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">All Conditions</span>
              </label>
            </div>
          </div>

          {/* Storage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage
            </label>
            <div className="space-y-2">
              {storageOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="storage"
                    value={option.value}
                    checked={localFilters.storage === option.value}
                    onChange={(e) => handleInputChange('storage', e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="storage"
                  value=""
                  checked={localFilters.storage === ''}
                  onChange={(e) => handleInputChange('storage', '')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">All Storage</span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={localFilters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={localFilters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={localFilters.sort}
              onChange={(e) => handleInputChange('sort', e.target.value)}
              className="input"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <button
              onClick={applyFilters}
              className="flex-1 btn btn-primary"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 btn btn-secondary"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

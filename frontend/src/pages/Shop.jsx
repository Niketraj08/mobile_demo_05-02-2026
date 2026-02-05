import { useState } from 'react';
import { FunnelIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    products,
    loading,
    error,
    filters,
    pagination,
    categories,
    brands,
    updateFilters,
    changePage
  } = useProducts();

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };


  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Products</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Mobile Phones</h1>
        <p className="text-gray-600">Find the perfect phone for you</p>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={updateFilters}
          categories={categories}
          brands={brands}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={toggleFilters}
              className="flex items-center space-x-2 btn btn-secondary"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              {loading ? (
                'Loading...'
              ) : (
                <>
                  Showing {products.length} of {pagination.totalProducts} products
                  {pagination.totalPages > 1 && (
                    <span className="ml-2">
                      (Page {pagination.currentPage} of {pagination.totalPages})
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Active Filters Display */}
            {(filters.search || filters.category || filters.brand || filters.condition || filters.storage || filters.minPrice || filters.maxPrice) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                <button
                  onClick={() => updateFilters({
                    search: '',
                    category: '',
                    brand: '',
                    condition: '',
                    storage: '',
                    minPrice: '',
                    maxPrice: ''
                  })}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  <XIcon className="h-4 w-4" />
                  <span>Clear all</span>
                </button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-lg p-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => updateFilters({
                    search: '',
                    category: '',
                    brand: '',
                    condition: '',
                    storage: '',
                    minPrice: '',
                    maxPrice: ''
                  })}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          pageNum === pagination.currentPage
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;

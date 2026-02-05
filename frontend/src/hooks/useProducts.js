import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../services/api';

const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    condition: '',
    storage: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    ...initialFilters
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch products based on current filters
  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Clean up filters - remove empty values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
      );

      const response = await productsAPI.getProducts({
        ...cleanFilters,
        page,
        limit: 12
      });

      setProducts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories and brands on mount
  const fetchMetadata = useCallback(async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        productsAPI.getCategories(),
        productsAPI.getBrands()
      ]);

      setCategories(categoriesRes.data.data);
      setBrands(brandsRes.data.data);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  }, []);

  // Update filters and refetch
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      condition: '',
      storage: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
  }, []);

  // Change page
  const changePage = useCallback((page) => {
    fetchProducts(page);
  }, [fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchMetadata();
    fetchProducts();
  }, [fetchProducts, fetchMetadata]);

  // Refetch when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    filters,
    pagination,
    categories,
    brands,
    updateFilters,
    clearFilters,
    changePage,
    refetch: fetchProducts
  };
};

export default useProducts;

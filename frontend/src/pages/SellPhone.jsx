import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

const SellPhone = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    storage: '',
    color: '',
    images: [],
    specifications: {
      display: '',
      processor: '',
      ram: '',
      battery: '',
      camera: '',
      os: '',
      network: ''
    },
    issues: [],
    warranty: ''
  });

  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch categories and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          productsAPI.getCategories(),
          productsAPI.getBrands()
        ]);
        setCategories(categoriesRes.data.data);
        setBrands(brandsRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSpecChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const handleIssuesChange = (issues) => {
    const issuesArray = issues.split(',').map(issue => issue.trim()).filter(issue => issue);
    setFormData(prev => ({
      ...prev,
      issues: issuesArray
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    // Check file size (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ ...prev, images: 'Each image must be less than 5MB' }));
      return;
    }

    setImageFiles(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);

    // Clear errors
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);

    setImageFiles(newFiles);
    setImagePreview(newPreviews);

    // Clean up object URLs
    URL.revokeObjectURL(imagePreview[index]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Phone name is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.storage) newErrors.storage = 'Storage capacity is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (imageFiles.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // For now, we'll simulate image upload with placeholder URLs
      // In production, you would upload to Cloudinary or similar service
      const imageUrls = imagePreview.length > 0
        ? imagePreview
        : ['/placeholder-phone.jpg'];

      const productData = {
        ...formData,
        images: imageUrls,
        price: parseFloat(formData.price)
      };

      await productsAPI.sellPhone(productData);

      // Redirect to success page or show success message
      alert('Phone listed successfully! It will be reviewed by our admin team before going live.');
      navigate('/dashboard');

    } catch (error) {
      console.error('Error listing phone:', error);
      alert(error.response?.data?.message || 'Failed to list phone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const conditionOptions = [
    { value: 'new', label: 'New - Unused, in original packaging' },
    { value: 'like-new', label: 'Like New - Minor wear, fully functional' },
    { value: 'good', label: 'Good - Some wear but works perfectly' },
    { value: 'fair', label: 'Fair - Noticeable wear, minor issues possible' },
    { value: 'poor', label: 'Poor - Heavy wear, may have issues' }
  ];

  const storageOptions = [
    { value: '32GB', label: '32GB' },
    { value: '64GB', label: '64GB' },
    { value: '128GB', label: '128GB' },
    { value: '256GB', label: '256GB' },
    { value: '512GB', label: '512GB' },
    { value: '1TB', label: '1TB' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Phone</h1>
        <p className="text-gray-600">
          Fill out the details below to list your phone for sale. Our admin team will review and approve your listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g., iPhone 13 Pro"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className={`input ${errors.brand ? 'border-red-500' : ''}`}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className={`input ${errors.model ? 'border-red-500' : ''}`}
                placeholder="e.g., iPhone 13 Pro Max"
              />
              {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`input ${errors.price ? 'border-red-500' : ''}`}
                placeholder="Enter your asking price"
                min="1"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`input ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className={`input ${errors.color ? 'border-red-500' : ''}`}
                placeholder="e.g., Space Gray"
              />
              {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`input ${errors.description ? 'border-red-500' : ''}`}
              rows="4"
              placeholder="Describe your phone's condition, features, and any other relevant details..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Condition & Storage */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Condition & Storage</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className={`input ${errors.condition ? 'border-red-500' : ''}`}
              >
                <option value="">Select Condition</option>
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Capacity *
              </label>
              <select
                value={formData.storage}
                onChange={(e) => handleInputChange('storage', e.target.value)}
                className={`input ${errors.storage ? 'border-red-500' : ''}`}
              >
                <option value="">Select Storage</option>
                {storageOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.storage && <p className="text-red-500 text-sm mt-1">{errors.storage}</p>}
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Technical Specifications (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display
              </label>
              <input
                type="text"
                value={formData.specifications.display}
                onChange={(e) => handleSpecChange('display', e.target.value)}
                className="input"
                placeholder="e.g., 6.1-inch Super Retina XDR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processor
              </label>
              <input
                type="text"
                value={formData.specifications.processor}
                onChange={(e) => handleSpecChange('processor', e.target.value)}
                className="input"
                placeholder="e.g., A15 Bionic chip"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RAM
              </label>
              <input
                type="text"
                value={formData.specifications.ram}
                onChange={(e) => handleSpecChange('ram', e.target.value)}
                className="input"
                placeholder="e.g., 6GB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Battery
              </label>
              <input
                type="text"
                value={formData.specifications.battery}
                onChange={(e) => handleSpecChange('battery', e.target.value)}
                className="input"
                placeholder="e.g., Up to 19 hours video playback"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camera
              </label>
              <input
                type="text"
                value={formData.specifications.camera}
                onChange={(e) => handleSpecChange('camera', e.target.value)}
                className="input"
                placeholder="e.g., 12MP dual camera system"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operating System
              </label>
              <input
                type="text"
                value={formData.specifications.os}
                onChange={(e) => handleSpecChange('os', e.target.value)}
                className="input"
                placeholder="e.g., iOS 16"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network
              </label>
              <input
                type="text"
                value={formData.specifications.network}
                onChange={(e) => handleSpecChange('network', e.target.value)}
                className="input"
                placeholder="e.g., 5G capable"
              />
            </div>
          </div>
        </div>

        {/* Issues & Warranty */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Issues & Warranty</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Issues (Optional)
              </label>
              <textarea
                value={formData.issues.join(', ')}
                onChange={(e) => handleIssuesChange(e.target.value)}
                className="input"
                rows="3"
                placeholder="List any known issues, separated by commas (e.g., cracked screen, battery drains fast)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Be honest about any issues to avoid disputes
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Status
              </label>
              <input
                type="text"
                value={formData.warranty}
                onChange={(e) => handleInputChange('warranty', e.target.value)}
                className="input"
                placeholder="e.g., Apple warranty until Dec 2024"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Phone Images *</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (Max 5, each under 5MB)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Listing Phone...' : 'List My Phone'}
          </button>
        </div>
      </form>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• Your listing will be reviewed by our admin team before going live</li>
          <li>• Be honest about your phone's condition to avoid buyer disputes</li>
          <li>• High-quality images increase your chances of selling faster</li>
          <li>• You can edit or remove your listing from your dashboard</li>
          <li>• Once sold, our team will coordinate the payment and delivery</li>
        </ul>
      </div>
    </div>
  );
};

export default SellPhone;

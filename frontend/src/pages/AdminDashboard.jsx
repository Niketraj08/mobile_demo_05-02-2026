import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
  UsersIcon,
  ShoppingBagIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      pendingProducts: 0,
      monthlyRevenue: 0
    },
    recentOrders: []
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardRes = await adminAPI.getDashboard();
      setDashboardData(dashboardRes.data.data);

      // Fetch additional data based on active tab
      if (activeTab === 'users') {
        const usersRes = await adminAPI.getUsers({ limit: 20 });
        setUsers(usersRes.data.data);
      } else if (activeTab === 'orders') {
        const ordersRes = await adminAPI.getAdminOrders({ limit: 20 });
        setOrders(ordersRes.data.data);
      } else if (activeTab === 'products') {
        const productsRes = await adminAPI.getPendingProducts();
        setPendingProducts(productsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setLoading(true);

    try {
      if (tab === 'users') {
        const usersRes = await adminAPI.getUsers({ limit: 20 });
        setUsers(usersRes.data.data);
      } else if (tab === 'orders') {
        const ordersRes = await adminAPI.getAdminOrders({ limit: 20 });
        setOrders(ordersRes.data.data);
      } else if (tab === 'products') {
        const productsRes = await adminAPI.getPendingProducts();
        setPendingProducts(productsRes.data.data);
      }
      // Other tabs don't need additional data fetching for now
    } catch (error) {
      console.error('Error fetching tab data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      await adminAPI.approveProduct(productId);
      setPendingProducts(products => products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Failed to approve product');
    }
  };

  const handleRejectProduct = async (productId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await adminAPI.rejectProduct(productId, { reason });
      setPendingProducts(products => products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('Failed to reject product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { orderStatus: newStatus });
      // Refresh orders
      const ordersRes = await adminAPI.getAdminOrders({ limit: 20 });
      setOrders(ordersRes.data.data);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.deleteProduct(productId);
      alert('Product deleted successfully');
      // Refresh products if on manage-products tab
      if (activeTab === 'manage-products') {
        // Could implement product fetching here
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleCreateCategory = async () => {
    const name = prompt('Enter category name:');
    if (!name) return;

    try {
      await adminAPI.createCategory({ name });
      alert('Category created successfully');
      // Refresh categories
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: EyeIcon },
    { id: 'products', name: 'Product Approvals', icon: PhoneIcon },
    { id: 'manage-products', name: 'Manage Products', icon: PencilIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'categories', name: 'Categories', icon: PlusIcon }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <PhoneIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ShoppingBagIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.pendingProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>

        {dashboardData.recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders</p>
        ) : (
          <div className="space-y-4">
            {dashboardData.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-600">
                    {order.user?.name} - {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProductApprovals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Approvals</h2>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          {pendingProducts.length} pending
        </span>
      </div>

      {pendingProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No products waiting for approval</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex space-x-6">
                <img
                  src={product.images?.[0] || '/placeholder-phone.jpg'}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.brand} - {product.model}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="ml-2 text-gray-900">₹{product.price.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Condition:</span>
                      <span className="ml-2 text-gray-900">{product.condition}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Storage:</span>
                      <span className="ml-2 text-gray-900">{product.storage}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Seller:</span>
                      <span className="ml-2 text-gray-900">{product.seller?.name}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{product.description}</p>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApproveProduct(product._id)}
                      className="btn btn-primary"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectProduct(product._id)}
                      className="btn bg-red-600 text-white hover:bg-red-700"
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user?.name}</div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className={`text-sm rounded-full px-2 py-1 font-medium ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderManageProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <button className="btn btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <PhoneIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Management</h3>
        <p className="text-gray-600 mb-4">View and manage all products on the platform</p>
        <p className="text-sm text-gray-500">This feature allows admins to add, edit, and remove products directly</p>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
        <button onClick={handleCreateCategory} className="btn btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <PlusIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Management</h3>
        <p className="text-gray-600 mb-4">Organize products into categories</p>
        <p className="text-sm text-gray-500">Create, edit, and manage product categories</p>
      </div>
    </div>
  );

  if (loading && activeTab === 'overview') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-16 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your platform and monitor performance</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2 px-1 py-2 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProductApprovals()}
        {activeTab === 'manage-products' && renderManageProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'categories' && renderCategories()}
      </div>
    </div>
  );
};

export default AdminDashboard;

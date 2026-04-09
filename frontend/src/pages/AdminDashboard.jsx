import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PackageSearch, Users, ShoppingBag, RotateCcw, PenTool, LayoutDashboard, Plus, Trash2, Edit, MessageSquare, Send as SendIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [toys, setToys] = useState([]);
  const [orders, setOrders] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [toysRes, ordersRes, repairsRes, usersRes] = await Promise.all([
        axiosClient.get('/api/toys'),
        axiosClient.get('/api/orders/all'),
        axiosClient.get('/api/repairs/all').catch(() => ({ data: [] })),
        axiosClient.get('/api/users/all').catch(() => ({ data: [] }))
      ]);
      setToys(toysRes.data.toys || toysRes.data || []);
      setOrders(ordersRes.data);
      setRepairs(repairsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
      if (err.response?.status === 403) {
         toast.error("You don't have admin privileges to fetch data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'toys', label: 'Manage Toys', icon: PackageSearch },
    { id: 'orders', label: 'Orders & Adoptions', icon: ShoppingBag },
    { id: 'returns', label: 'Returns & Repairs', icon: RotateCcw },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'support', label: 'Support Chat', icon: MessageSquare },
  ];

  if (!isAuthenticated || user?.role !== 'admin') {
     return (
       <div className="pt-24 pb-20 text-center min-h-screen flex items-center justify-center">
         <div>
           <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
           <p className="text-textMuted">You need admin privileges to view this page.</p>
         </div>
       </div>
     );
  }

  return (
    <div className="pt-24 pb-20 bg-secondary min-h-screen border-t border-borderColor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-textMain mb-2">Admin Portal</h1>
            <p className="text-textMuted">Manage store operations and inventory.</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            System Active
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-primary rounded-2xl shadow-sm border border-borderColor p-4 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                          : 'text-textMuted hover:bg-orange-50 hover:text-primary font-medium'
                      }`}
                    >
                      <Icon size={20} className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="p-12 text-center text-primary font-bold">Loading system data...</div>
              ) : (
                <>
                  {activeTab === 'overview' && <OverviewTab toys={toys} orders={orders} repairs={repairs} />}
                  {activeTab === 'toys' && <ManageToysTab toys={toys} onRefresh={fetchAdminData} />}
                  {activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={fetchAdminData} />}
                  {activeTab === 'returns' && <ReturnsTab repairs={repairs} onRefresh={fetchAdminData} />}
                  {activeTab === 'users' && <UsersTab users={users} />}
                  {activeTab === 'support' && <SupportTab />}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// Sub-components

function OverviewTab({ toys, orders, repairs }) {
  const pendingRepairs = repairs.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 p-6 rounded-2xl">
          <h3 className="text-blue-800 font-bold mb-2">Total Income</h3>
          <p className="text-4xl font-black text-blue-900">₹{orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toFixed(2)}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 p-6 rounded-2xl">
          <h3 className="text-green-800 font-bold mb-2">Total Orders</h3>
          <p className="text-4xl font-black text-green-900">{orders.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 p-6 rounded-2xl">
          <h3 className="text-orange-800 font-bold mb-2">Active Toys</h3>
          <p className="text-4xl font-black text-orange-900">{toys.length}</p>
        </div>
      </div>

      <div className="bg-primary p-6 rounded-3xl shadow-sm border border-borderColor">
         <h2 className="text-xl font-bold mb-6 text-textMain">Recent Admin Alerts</h2>
         <div className="space-y-4">
           {pendingRepairs > 0 ? (
             <div className="flex bg-yellow-50 p-4 rounded-xl items-start gap-4 border border-yellow-100">
                <RotateCcw className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-yellow-900">{pendingRepairs} Return/Repair Requests Pending</p>
                  <p className="text-sm text-yellow-800">Please review the Returns & Repairs tab to process them.</p>
                </div>
             </div>
           ) : (
              <div className="text-textMuted">No new alerts. All caught up!</div>
           )}
         </div>
      </div>
    </div>
  );
}

function ManageToysTab({ toys, onRefresh }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: '',
    category: 'Educational',
    ageGroup: '1-3 years',
    uniqueId: '',
    artisanName: '',
    artisanLocation: '',
    artisanStory: ''
  });

  const handleEdit = (toy) => {
    setEditingId(toy._id);
    setFormData({
      name: toy.name || '',
      description: toy.description || '',
      price: toy.price || '',
      images: toy.images?.[0] || '',
      category: toy.category || 'Educational',
      ageGroup: toy.ageGroup || '1-3 years',
      uniqueId: toy.uniqueId || '',
      artisanName: toy.artisan?.name || '',
      artisanLocation: toy.artisan?.location || '',
      artisanStory: toy.artisan?.story || ''
    });
    setShowAddForm(true);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      name: '', description: '', price: '', images: '',
      category: 'Educational', ageGroup: '1-3 years', uniqueId: '',
      artisanName: '', artisanLocation: '', artisanStory: ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this toy?")) {
      try {
        await axiosClient.delete(`/api/toys/${id}`);
        toast.success("Toy deleted");
        onRefresh();
      } catch (err) {
        toast.error("Failed to delete toy");
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveToy = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Parse single image string to array for backend
    const payload = {
      ...formData,
      price: Number(formData.price),
      images: formData.images ? [formData.images] : [],
      artisan: {
        name: formData.artisanName,
        location: formData.artisanLocation,
        story: formData.artisanStory
      }
    };

    try {
      if (editingId) {
        await axiosClient.put(`/api/toys/${editingId}`, payload);
        toast.success("Toy successfully updated!");
      } else {
        await axiosClient.post('/api/toys', payload);
        toast.success("New toy successfully added!");
      }
      handleCancel();
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to save toy");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-primary rounded-3xl shadow-sm border border-borderColor overflow-hidden">
      <div className="p-6 border-b border-borderColor flex justify-between items-center bg-secondary transition-colors duration-300">
        <h2 className="text-xl font-bold text-textMain">Inventory Management</h2>
        <button 
          onClick={() => editingId ? handleCancel() : setShowAddForm(!showAddForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
        >
          {(showAddForm || editingId) ? <RotateCcw size={18} /> : <Plus size={18} />} 
          {(showAddForm || editingId) ? "Cancel" : "Add New Toy"}
        </button>
      </div>

      {showAddForm && (
        <div className="p-6 border-b border-borderColor bg-secondary transition-all">
          <form onSubmit={handleSaveToy} className="space-y-4 max-w-2xl">
            <h3 className="font-bold text-lg text-textMain">{editingId ? `Edit Toy: ${formData.name}` : 'Add New Toy'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-textMuted mb-1">Toy Name *</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-textMuted mb-1">Unique ID *</label>
                <input required name="uniqueId" value={formData.uniqueId} onChange={handleInputChange} placeholder="e.g. CH-2024-005" className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-textMuted mb-1">Price (₹) *</label>
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-textMuted mb-1">Image URL</label>
                <input name="images" value={formData.images} onChange={handleInputChange} placeholder="e.g. /images/toy1.jpg" className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-textMuted mb-1">Category *</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm">
                  <option value="Educational">Educational</option>
                  <option value="Animals">Animals</option>
                  <option value="Classic">Classic</option>
                  <option value="Pretend Play">Pretend Play</option>
                  <option value="Decorative">Decorative</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-textMuted mb-1">Age Group *</label>
                <select required name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm">
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-6 years">3-6 years</option>
                  <option value="4-8 years">4-8 years</option>
                  <option value="8+ years">8+ years</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-textMuted mb-1">Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-textMuted mb-1">Artisan Name *</label>
                <input required name="artisanName" value={formData.artisanName} onChange={handleInputChange} className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-textMuted mb-1">Artisan Location *</label>
                <input required name="artisanLocation" value={formData.artisanLocation} onChange={handleInputChange} className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-textMuted mb-1">Artisan Story *</label>
              <textarea required name="artisanStory" value={formData.artisanStory} onChange={handleInputChange} rows="2" className="w-full bg-primary border border-borderColor p-2 rounded-lg text-textMain text-sm"></textarea>
            </div>
            <div className="flex justify-end pt-2">
              <button disabled={isSubmitting} type="submit" className="bg-accent text-white px-6 py-2 rounded-lg font-bold hover:bg-accent/90 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingId ? 'Update Toy' : 'Save Toy'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-textMuted">
          <thead className="bg-secondary text-textMain font-bold border-b border-borderColor">
            <tr>
              <th className="px-6 py-4">Toy Detail</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Age Group</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(toys || []).map((toy) => (
              <React.Fragment key={toy._id}>
                <tr className="border-b border-borderColor hover:bg-secondary transition-colors duration-300">
                  <td className="px-6 py-4 flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === toy._id ? null : toy._id)}>
                    <img src={toy.images?.[0] || 'https://picsum.photos/200'} className="w-12 h-12 rounded-lg object-cover bg-secondary border border-borderColor" />
                    <div>
                      <p className="font-bold text-textMain truncate max-w-[200px] hover:text-accent flex items-center gap-2">
                        {toy.name} 
                        {expandedId === toy._id ? <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">Less</span> : <span className="text-xs bg-primary border text-textMuted px-1.5 py-0.5 rounded">More</span>}
                      </p>
                      <p className="text-xs text-textMuted text-sm">ID: {toy.uniqueId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{toy.category}</td>
                  <td className="px-6 py-4 font-bold text-textMain">₹{toy.price}</td>
                  <td className="px-6 py-4 text-sm text-textMuted">{toy.ageGroup}</td>
                  <td className="px-6 py-4">
                     <div className="flex justify-end gap-2">
                       <button onClick={() => handleEdit(toy)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                       <button onClick={() => handleDelete(toy._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                     </div>
                  </td>
                </tr>
                {expandedId === toy._id && (
                  <tr className="bg-secondary/50 border-b border-borderColor">
                    <td colSpan="5" className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-xs font-bold text-textMuted uppercase mb-1">Description</h4>
                          <p className="text-sm text-textMain leading-relaxed">{toy.description}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-textMuted uppercase mb-1">Artisan Profile</h4>
                          {toy.artisan ? (
                            <div className="text-sm text-textMain">
                              <p><span className="font-bold">Name:</span> {toy.artisan.name}</p>
                              <p><span className="font-bold">Location:</span> {toy.artisan.location}</p>
                              <p className="mt-1 line-clamp-3 text-textMuted"><span className="font-bold text-textMain">Story:</span> {toy.artisan.story}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-textMuted">No artisan details.</p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs font-bold text-textMuted uppercase mb-1">Status</h4>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold mr-2">In Stock</span>
                            {toy.isAdoptable && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">Adoptable</span>}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-textMuted uppercase mb-1">Performance</h4>
                            <div className="text-sm text-textMain">
                              <p>Rating: <span className="font-bold">{toy.rating || 'N/A'}</span> / 5.0</p>
                              <p>Reviews: <span className="font-bold">{toy.reviews || 0}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab({ orders, onRefresh }) {
  const updateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Processing' : currentStatus === 'Processing' ? 'Delivered' : 'Pending';
    try {
      await axiosClient.put(`/api/orders/${id}/status`, { status: nextStatus });
      toast.success(`Order marked as ${nextStatus}`);
      onRefresh();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="bg-primary rounded-3xl shadow-sm border border-borderColor overflow-hidden">
      <div className="p-6 border-b border-borderColor bg-secondary transition-colors duration-300">
        <h2 className="text-xl font-bold text-textMain">All Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-textMuted">
          <thead className="bg-secondary text-textMain font-bold border-b border-borderColor">
            <tr>
              <th className="px-6 py-4">Order ID & User</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-borderColor hover:bg-secondary transition-colors duration-300">
                <td className="px-6 py-4">
                  <div className="font-mono text-xs text-textMuted mb-1">{order._id.substring(0, 8).toUpperCase()}</div>
                  <div className="font-bold text-textMain">{order.user?.name || 'Guest'}</div>
                  <div className="text-xs">{order.user?.email}</div>
                </td>
                <td className="px-6 py-4">{new Date(order.date || order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-textMain">₹{order.totalAmount}</td>
                <td className="px-6 py-4 uppercase text-xs font-bold text-textMuted">{order.paymentMethod}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => updateStatus(order._id, order.status || 'Pending')}
                    className="text-primary hover:underline font-bold text-xs bg-primary/10 px-3 py-2 rounded-lg"
                  >
                    Cycle Status
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" className="text-center py-8">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReturnsTab({ repairs, onRefresh }) {
  const handleApprove = async (id, requestType) => {
    let creditAmount = 0;
    if (requestType === 'return') {
      const amountStr = window.prompt("Enter the amount of Store Credits to reward the user for this Resell (Adoption):", "0");
      if (amountStr === null) return; // Admin cancelled
      creditAmount = Number(amountStr);
      if (isNaN(creditAmount) || creditAmount < 0) {
        toast.error("Invalid credit amount.");
        return;
      }
    }

    try {
       await axiosClient.put(`/api/repairs/${id}`, { status: 'completed', creditAmount });
       toast.success(requestType === 'return' ? `Marked as Completed & ₹${creditAmount} credits awarded!` : "Marked as Completed");
       onRefresh();
    } catch(err) {
       toast.error("Failed to update status");
    }
  };

  return (
    <div className="bg-primary rounded-3xl shadow-sm border border-borderColor overflow-hidden">
      <div className="p-6 border-b border-borderColor bg-secondary transition-colors duration-300">
        <h2 className="text-xl font-bold text-textMain">Return & Repair Requests</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-textMuted">
          <thead className="bg-secondary text-textMain font-bold border-b border-borderColor">
            <tr>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Toy</th>
              <th className="px-6 py-4">Issue / Condition</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((r) => (
              <tr key={r._id} className="border-b border-borderColor hover:bg-secondary transition-colors duration-300">
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    r.requestType === 'return' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {r.requestType === 'return' ? 'Resell (Adoption)' : 'Repair'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">{r.user?.name || 'User'}</td>
                <td className="px-6 py-4">{r.toy?.name || 'Toy Item'}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-xs uppercase">{r.issue}</p>
                  <p className="text-xs text-textMuted text-sm max-w-[200px] truncate">{r.description}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 ${r.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} rounded text-xs font-bold`}>
                    {r.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {r.status !== 'completed' ? (
                     <button onClick={() => handleApprove(r._id, r.requestType)} className="bg-green-600 text-white px-3 py-1 rounded text-xs inline-block font-bold hover:bg-green-700">Manage Request</button>
                  ) : (
                     <span className="text-textMuted text-sm text-xs font-bold">Done</span>
                  )}
                </td>
              </tr>
            ))}
            {repairs.length === 0 && (
              <tr><td colSpan="6" className="text-center py-10 font-bold text-textMuted">No active requests currently</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTab({ users }) {
  return (
    <div className="bg-primary rounded-3xl shadow-sm border border-borderColor overflow-hidden">
      <div className="p-6 border-b border-borderColor bg-secondary transition-colors duration-300">
        <h2 className="text-xl font-bold text-textMain">User Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-textMuted">
          <thead className="bg-secondary text-textMain font-bold border-b border-borderColor">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Credits</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((user) => (
              <tr key={user._id} className="border-b border-borderColor hover:bg-secondary transition-colors duration-300">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="font-bold text-textMain">{user.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs">{user.email}</div>
                  <div className="text-[10px] text-textMuted">{user.phone || 'No phone'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-textMain">₹{user.creditBalance || 0}</td>
                <td className="px-6 py-4 text-xs">
                  {new Date(user.date || user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr><td colSpan="5" className="text-center py-10 font-bold text-textMuted">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupportTab() {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = React.useRef(null);

  const fetchActiveChats = async () => {
    try {
      const res = await axiosClient.get('/api/support/active-chats');
      setActiveChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await axiosClient.get(`/api/support/messages/${userId}`);
      setMessages(res.data);
      // Mark as read
      await axiosClient.put(`/api/support/mark-read/${userId}`);
      fetchActiveChats(); // Refresh unread counts
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActiveChats();
    const interval = setInterval(fetchActiveChats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    if (selectedChat) {
      fetchMessages(selectedChat.user._id);
      interval = setInterval(() => fetchMessages(selectedChat.user._id), 3000);
    }
    return () => clearInterval(interval);
  }, [selectedChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;

    try {
      await axiosClient.post('/api/support/send', {
        userId: selectedChat.user._id,
        message: reply,
        sender: 'admin'
      });
      setReply('');
      fetchMessages(selectedChat.user._id);
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      {/* Chat List */}
      <div className="md:col-span-1 bg-primary rounded-3xl border border-borderColor overflow-hidden flex flex-col">
        <div className="p-4 border-b border-borderColor bg-secondary font-bold text-textMain">Active Chats</div>
        <div className="flex-1 overflow-y-auto">
          {activeChats.length === 0 ? (
            <div className="p-8 text-center text-textMuted text-sm italic">No active chats</div>
          ) : (
            activeChats.map((chat) => (
              <button
                key={chat.user._id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full text-left p-4 border-b border-borderColor hover:bg-secondary transition-colors relative ${
                  selectedChat?.user._id === chat.user._id ? 'bg-secondary' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-textMain truncate pr-2">{chat.user.name}</span>
                  <span className="text-[10px] text-textMuted flex-shrink-0">
                    {chat.timestamp ? new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div className="text-xs text-textMuted truncate pr-4 italic">{chat.lastMessage}</div>
                {chat.unreadCount > 0 && (
                  <span className="absolute bottom-4 right-4 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {chat.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="md:col-span-2 bg-primary rounded-3xl border border-borderColor overflow-hidden flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-borderColor bg-secondary flex justify-between items-center">
              <div>
                <span className="font-bold text-textMain">{selectedChat.user.name}</span>
                <p className="text-[10px] text-textMuted">{selectedChat.user.email}</p>
              </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === 'admin' 
                      ? 'bg-accent text-white rounded-tr-sm' 
                      : 'bg-primary border border-borderColor text-textMain rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-borderColor bg-primary flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 bg-secondary border border-borderColor rounded-xl px-4 py-2 text-sm outline-none focus:border-accent"
              />
              <button type="submit" className="bg-accent text-white p-2 rounded-xl hover:bg-accent/90 transition-all shadow-md">
                <SendIcon size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-textMuted p-8 text-center">
            <MessageSquare size={48} className="opacity-20 mb-4" />
            <p className="font-bold">Select a chat to start responding</p>
            <p className="text-sm">Real-time support enabled</p>
          </div>
        )}
      </div>
    </div>
  );
}

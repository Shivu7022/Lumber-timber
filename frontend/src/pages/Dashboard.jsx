import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Heart, RotateCcw, CreditCard, Settings, Crown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'adoptions', label: 'Adoptions', icon: Heart },
    { id: 'repairs', label: 'Repairs', icon: RotateCcw },
    { id: 'credits', label: 'Credits', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, repairsRes, subscriptionsRes] = await Promise.all([
          axiosClient.get('/api/orders'),
          axiosClient.get('/api/repairs'),
          axiosClient.get('/api/subscriptions')
        ]);

        setOrders(ordersRes.data);
        setRepairs(repairsRes.data);
        setSubscriptions(subscriptionsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated]);

  const renderContent = () => {
    const sharedProps = { orders, repairs, subscriptions, user, loading, error };
    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...sharedProps} />;
      case 'orders':
        return <OrdersTab orders={orders} loading={loading} error={error} />;
      case 'adoptions':
        return <AdoptionsTab orders={orders} subscriptions={subscriptions} loading={loading} error={error} />;
      case 'repairs':
        return <RepairsTab repairs={repairs} loading={loading} error={error} />;
      case 'credits':
        return <CreditsTab user={user} orders={orders} />;
      case 'settings':
        return <SettingsTab user={user} />;
      default:
        return <OverviewTab {...sharedProps} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-20 text-center">
        <h1 className="text-3xl font-bold text-textMain mb-4">Please log in to view your dashboard</h1>
        <p className="text-textMuted mb-6">Your orders, repairs, and subscriptions are available once you are logged in.</p>
        <a href="/login" className="btn-primary">
          Log in
        </a>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-textMain mb-2 flex items-center gap-3">
              My Dashboard 
              {user?.creditBalance > 100 && (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Crown size={14} /> Platinum Member
                </span>
              )}
            </h1>
            <p className="text-textMuted">Manage your toys, orders, and account</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-accent text-white'
                          : 'text-textMuted hover:bg-primary/50'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ orders = [], repairs = [], subscriptions = [], user, loading, error }) => {
  const totalOrders = orders.length;
  const adoptedCount = subscriptions.length;
  const creditBalance = user?.creditBalance ?? 0;

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center text-textMuted">Loading dashboard…</div>
      )}

      {error && (
        <div className="text-center text-red-600">{error}</div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Package className="mx-auto mb-4 text-accent" size={48} />
          <h3 className="text-2xl font-bold text-textMain">{totalOrders}</h3>
          <p className="text-textMuted">Total Orders</p>
        </div>
        <div className="card text-center">
          <Heart className="mx-auto mb-4 text-accent" size={48} />
          <h3 className="text-2xl font-bold text-textMain">{adoptedCount}</h3>
          <p className="text-textMuted">Adopted Toys</p>
        </div>
        <div className="card text-center">
          <CreditCard className="mx-auto mb-4 text-accent" size={48} />
          <h3 className="text-2xl font-bold text-textMain">₹{creditBalance}</h3>
          <p className="text-textMuted">Credit Balance</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-textMain mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Ordered Wooden Train Set', date: '2024-03-15', status: 'Delivered' },
            { action: 'Adopted Animal Figurines', date: '2024-03-10', status: 'Active' },
            { action: 'Repair requested for Puzzle Game', date: '2024-03-08', status: 'In Progress' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0">
              <div>
                <p className="font-semibold">{activity.action}</p>
                <p className="text-sm text-textMuted">{activity.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                activity.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                activity.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrdersTab = ({ orders = [], loading, error }) => {
  const getStep = (status) => {
    if (status === 'Pending') return 1;
    if (status === 'Processing') return 2;
    if (status === 'Delivered') return 3;
    return 1;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-textMain mb-6">My Orders & Tracking</h2>

      {loading && <div className="text-center text-textMuted">Loading orders…</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-textMuted">No orders found. start shopping!</div>
        ) : (
          orders.map((order) => {
             const step = getStep(order.status || 'Pending');
             return (
              <div key={order._id || order.id} className="p-6 border border-borderColor rounded-2xl bg-primary shadow-sm flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-textMain text-lg">{order.toys?.[0]?.toy?.name || 'Wooden Toy Order'} {order.toys?.length > 1 ? `+${order.toys.length - 1} more` : ''}</h3>
                    <p className="font-mono text-xs text-textMuted text-sm mt-1 uppercase">Order #{order._id?.substring(0, 10) || order.id}</p>
                    <p className="text-sm text-textMuted mt-1">Placed on {new Date(order.date || order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right border-l border-borderColor pl-4">
                    <p className="text-sm text-textMuted uppercase font-semibold">{order.paymentMethod}</p>
                    <p className="font-black text-2xl text-accent">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* Timeline Tracking */}
                <div className="relative pt-4 pb-2 border-t border-gray-50">
                   <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-secondary border border-borderColor">
                     <div style={{ width: `${(step / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
                   </div>
                   <div className="flex justify-between text-xs font-bold px-2">
                     <div className={`text-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>Order Placed</div>
                     <div className={`text-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>Processing & Packed</div>
                     <div className={`text-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>Delivered</div>
                   </div>
                </div>

              </div>
             );
          })
        )}
      </div>
    </div>
  );
};

const AdoptionsTab = ({ orders = [], subscriptions = [], loading, error }) => {
  const [selectedToyId, setSelectedToyId] = useState('');
  const [issue, setIssue] = useState('Broken part');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const allToys = orders.flatMap((order) => order.toys?.map((item) => item.toy)).filter(Boolean);
  const toyOptions = Array.from(new Map(allToys.map((toy) => [toy._id, toy])).values());

  useEffect(() => {
    if (toyOptions.length && !selectedToyId) {
      setSelectedToyId(toyOptions[0]._id);
    }
  }, [toyOptions, selectedToyId]);

  const handleRequestRepair = async (e) => {
    e.preventDefault();
    if (!selectedToyId) {
      toast.error('Select a toy to request repair');
      return;
    }

    setSubmitting(true);
    try {
      await axiosClient.post('/api/repairs', {
        toyId: selectedToyId,
        issue,
        description
      });
      toast.success('Repair request submitted');
      setDescription('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Failed to submit repair request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-textMain mb-6">My Adopted Toys</h2>

      {loading && <div className="text-center text-textMuted">Loading adoptions…</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      <div className="space-y-4">
        {subscriptions.length === 0 ? (
          <div className="text-textMuted">No adoptions found.</div>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub._id || sub.id} className="p-4 border border-white/20 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{sub.plan || 'Subscription'}</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Active
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p><span className="font-semibold">Started:</span> {new Date(sub.createdAt || sub.date || Date.now()).toLocaleDateString()}</p>
                <p><span className="font-semibold">Duration:</span> {sub.duration || 'Monthly'}</p>
              </div>
            </div>
          ))
        )}

        <div className="p-4 border border-white/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Request a Repair</h3>
          {toyOptions.length === 0 ? (
            <div className="text-textMuted">Place an order first to request a repair.</div>
          ) : (
            <form className="space-y-4" onSubmit={handleRequestRepair}>
              <div>
                <label className="block text-sm font-semibold mb-2">Toy</label>
                <select
                  value={selectedToyId}
                  onChange={(e) => setSelectedToyId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-borderColor bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
                >
                  {toyOptions.map((toy) => (
                    <option key={toy._id} value={toy._id}>
                      {toy.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Issue</label>
                <select
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-borderColor bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
                >
                  <option>Broken part</option>
                  <option>Missing pieces</option>
                  <option>Not working</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-borderColor bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
                  placeholder="Describe the issue"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Repair Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const RepairsTab = ({ repairs = [], loading, error }) => (
  <div className="card">
    <h2 className="text-2xl font-bold text-textMain mb-6">Repair Requests</h2>

    {loading && <div className="text-center text-textMuted">Loading repairs…</div>}
    {error && <div className="text-center text-red-600">{error}</div>}

    <div className="space-y-4">
      {repairs.length === 0 ? (
        <div className="text-textMuted">No repair requests found.</div>
      ) : (
        repairs.map((repair) => (
          <div key={repair._id || repair.id} className="p-4 border border-white/20 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{repair.toy?.name || 'Repair Request'}</h3>
                <p className="text-sm text-textMuted">{repair.issue}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                repair.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {repair.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p><span className="font-semibold">Date:</span> {new Date(repair.dateRequested || repair.createdAt || Date.now()).toLocaleDateString()}</p>
              <p><span className="font-semibold">Cost:</span> {repair.cost ? `₹${repair.cost}` : 'TBD'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const CreditsTab = ({ user, orders = [] }) => {
  const creditBalance = user?.creditBalance ?? 0;
  const [returnStatus, setReturnStatus] = useState(null);
  
  // Get all toys from all orders
  const eligibleToys = orders
    .flatMap(order => order.toys?.map(t => t.toy))
    .filter(Boolean);
    
  // Simple unique array of toys
  const uniqueToys = Array.from(new Map(eligibleToys.map(toy => [toy._id, toy])).values());

  const handleReturn = (e) => {
    e.preventDefault();
    setReturnStatus('processing');
    setTimeout(() => {
      setReturnStatus('success');
      toast.success('Return request submitted! You will earn credits once approved.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-2">
          <CreditCard size={28}/> Credit Balance
        </h2>
        <div className="text-center mb-8 bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-orange-100">
          <p className="text-4xl font-extrabold text-accent mb-2">₹{creditBalance}</p>
          <p className="text-textMuted font-medium">Available Credits</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-textMain">Transaction History</h3>
          <div className="text-textMuted bg-secondary p-4 rounded-xl border border-borderColor text-sm">
            Transaction history will appear here once you start using or earning credits.
          </div>
        </div>
      </div>

      <div className="card border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <RotateCcw size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-900">Return & Earn</h2>
            <p className="text-green-700 text-sm">Return your used toys to earn store credits and reduce waste!</p>
          </div>
        </div>

        {returnStatus === 'success' ? (
          <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 text-center">
            <h3 className="text-xl font-bold mb-2">Request Received!</h3>
            <p>We've received your return request. We will arrange a pickup shortly. Once the toy is verified, credits will be added to your account.</p>
            <button onClick={() => setReturnStatus(null)} className="mt-4 text-green-700 underline font-medium">Return another toy</button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleReturn}>
            <div>
              <label className="block text-sm font-semibold mb-2 text-textMain">Select Toy to Return</label>
              {uniqueToys.length > 0 ? (
                <select required className="w-full px-4 py-3 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-green-500 bg-primary">
                  <option value="">-- Choose a toy --</option>
                  {uniqueToys.map(toy => (
                    <option key={toy._id} value={toy._id}>{toy.name} (Est. Value: ₹{Math.floor(toy.price * 0.3)})</option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-secondary rounded-lg text-textMuted border border-borderColor">
                  You don't have any eligible toys to return yet. Purchase a toy first!
                </div>
              )}
            </div>

            {uniqueToys.length > 0 && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-textMain">Condition</label>
                  <select required className="w-full px-4 py-3 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-green-500 bg-primary">
                    <option value="good">Good (Normal wear)</option>
                    <option value="fair">Fair (Minor damage)</option>
                    <option value="needs_repair">Needs Repair (Broken parts)</option>
                  </select>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                  <Heart className="text-green-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-green-800">
                    By returning this toy, you ensure it gets a second life. We will repair, repaint, and sanitize it for another child to adopt.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={returnStatus === 'processing'}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  {returnStatus === 'processing' ? 'Processing...' : 'Submit Return Request'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

const SettingsTab = ({ user }) => {
  const { updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-textMain mb-6">Account Settings</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-borderColor bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-borderColor bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-borderColor bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Address</label>
          <textarea
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-borderColor bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
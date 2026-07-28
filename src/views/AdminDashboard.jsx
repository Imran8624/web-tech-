import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Bot, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Activity, 
  Search, 
  Filter, 
  PhoneCall,
  Sparkles,
  Award,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Lock,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  Database,
  Store,
  MapPin,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard = () => {
  const { 
    usersList, 
    updateUserProfile, 
    deleteUser, 
    addUserByAdmin,
    resetDatabase,
    savedAddresses,
    restaurantsList,
    addRestaurant,
    triggerVisualAlert, 
    speakText 
  } = useApp();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'restaurants' | 'metrics'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('customer');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserIsDeaf, setNewUserIsDeaf] = useState(false);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);

  // Add Restaurant Modal State
  const [isAddRestOpen, setIsAddRestOpen] = useState(false);
  const [restName, setRestName] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restCuisine, setRestCuisine] = useState('');

  const togglePasswordVisibility = (userId) => {
    setShowPasswordMap(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;

    addUserByAdmin({
      name: newUserName || 'New System User',
      email: newUserEmail.trim(),
      password: newUserPassword || 'user123',
      role: newUserRole,
      phone: newUserPhone || '+1 (555) 000-0000',
      address: newUserAddress || '100 City Center',
      isDeafMute: newUserIsDeaf
    });

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
  };

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserProfile(editingUser.id, editingUser);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    setEditingUser(null);
  };

  const handleCreateRestaurant = (e) => {
    e.preventDefault();
    if (!restName.trim()) return;
    addRestaurant({
      name: restName.trim(),
      address: restAddress.trim() || '123 Market St',
      cuisine: restCuisine || 'Fusion',
      items: [{ name: "Signature Dish", qty: 1, notes: "Chef Special", price: "$15.00" }],
      totalAmount: "$15.00"
    });
    confetti({ particleCount: 60, spread: 60 });
    setIsAddRestOpen(false);
    setRestName('');
    setRestAddress('');
  };

  const handleBroadcastAlert = () => {
    triggerVisualAlert('cyan');
    speakText("Admin notification dispatched: Emergency Visual Alert sent to all active riders.");
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24">
      
      {/* ADMIN HEADER BAR */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-purple-500/50 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-2xl">
            🛡️
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              SignShift Admin Control Center
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-400">Live User Credentials Database, Rider Fleet & Accessibility Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBroadcastAlert}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>Broadcast Flash Alert ⚡</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all user credentials and database stores to factory defaults?")) {
                resetDatabase();
              }
            }}
            className="px-3 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-red-500 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Reset Database to Default Credentials"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Reset DB</span>
          </button>
        </div>
      </div>

      {/* SYSTEM KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Credentials</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{usersList.length}</div>
          <p className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Across 4 System Roles
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Deaf & Mute Riders</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {usersList.filter(u => u.role === 'rider' && u.isDeafMute).length}
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% SignShift Certified
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Merchants</span>
            <Store className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{restaurantsList.length}</div>
          <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Live Restaurant Database
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">System Security</span>
            <Database className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">100%</div>
          <p className="text-[11px] text-purple-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> LocalStorage Synced
          </p>
        </div>

      </div>

      {/* ADMIN SECTION TABS */}
      <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 max-w-md text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Credentials Database ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${activeTab === 'restaurants' ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <Store className="w-4 h-4" />
          <span>Restaurants ({restaurantsList.length})</span>
        </button>
      </div>

      {/* TAB 1: USER CREDENTIALS DATABASE */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-6 shadow-xl">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" /> User Credentials Database Manager
              </h3>
              <p className="text-xs text-slate-400">View, create, edit credentials, or change roles across Customer, Rider, Merchant, and Admin</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none w-48"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="rider">Rider</option>
                <option value="merchant">Merchant</option>
                <option value="admin">Admin</option>
              </select>

              {/* Add User Button */}
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Add User Credential</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User ID & Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Password Credential</th>
                  <th className="py-3 px-4">Phone / Contact</th>
                  <th className="py-3 px-4">Accessibility / Details</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-semibold">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                      <img 
                        src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} 
                        alt={usr.name} 
                        className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <span className="block font-bold">{usr.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{usr.id}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        usr.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        usr.role === 'rider' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        usr.role === 'merchant' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {usr.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cyan-300">
                      {usr.email}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-200">
                          {showPasswordMap[usr.id] ? usr.password || 'user123' : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(usr.id)}
                          className="text-slate-400 hover:text-white"
                          title="Toggle Password Visibility"
                        >
                          {showPasswordMap[usr.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {usr.phone || '+1 (555) 000-0000'}
                    </td>

                    <td className="py-3.5 px-4">
                      {usr.isDeafMute ? (
                        <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800 text-[10px] font-bold">
                          🤟 Deaf / Non-Verbal
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Standard Account</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser({ ...usr })}
                          className="p-1.5 bg-slate-950 hover:bg-cyan-950 text-cyan-400 border border-slate-800 rounded-lg transition"
                          title="Edit User Credentials"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete user credential for ${usr.name} (${usr.email})?`)) {
                              deleteUser(usr.id);
                            }
                          }}
                          className="p-1.5 bg-slate-950 hover:bg-red-950 text-red-400 border border-slate-800 rounded-lg transition"
                          title="Delete User Credential"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: RESTAURANTS DATABASE */}
      {activeTab === 'restaurants' && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" /> Restaurants & Menu Items Database
              </h3>
              <p className="text-xs text-slate-400">Manage partner restaurants, delivery ETAs, and customizable food menus</p>
            </div>

            <button
              onClick={() => setIsAddRestOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Add Restaurant</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurantsList.map((rest) => (
              <div key={rest.id || rest.name} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-white text-base">{rest.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> {rest.address}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-300 rounded-full border border-amber-800 text-[10px] font-bold">
                    {rest.cuisine}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <div>ETA Pickup: <strong className="text-white">{rest.pickupEta}</strong></div>
                  <div>ETA Delivery: <strong className="text-emerald-400">{rest.deliveryEta}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-900 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Sample Menu Items ({rest.items?.length || 0}):</span>
                  <div className="flex flex-wrap gap-1">
                    {rest.items?.map((it, idx) => (
                      <span key={idx} className="bg-slate-900 text-slate-300 text-[11px] px-2 py-0.5 rounded border border-slate-800">
                        {it.name} ({it.price || '$12.00'})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD USER CREDENTIAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>➕ Add New User Credential</span>
              </h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="priya@signshift.io"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="rider123"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="rider">Rider</option>
                    <option value="merchant">Merchant</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+1 (555) 999-1111"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="deafCheck"
                  checked={newUserIsDeaf}
                  onChange={(e) => setNewUserIsDeaf(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <label htmlFor="deafCheck" className="text-xs text-slate-300 font-bold">
                  🤟 Deaf / Non-Verbal Accessibility Badge
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER CREDENTIAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>✏️ Edit User Credential ({editingUser.id})</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="rider">Rider</option>
                    <option value="merchant">Merchant</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editDeafCheck"
                  checked={!!editingUser.isDeafMute}
                  onChange={(e) => setEditingUser({ ...editingUser, isDeafMute: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-purple-500"
                />
                <label htmlFor="editDeafCheck" className="text-xs text-slate-300 font-bold">
                  🤟 Deaf / Non-Verbal Accessibility Badge
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Update Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD RESTAURANT */}
      {isAddRestOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>🏬 Add New Restaurant</span>
              </h3>
              <button onClick={() => setIsAddRestOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  placeholder="e.g. Spice Route Kitchen"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  placeholder="e.g. 500 Grand Ave"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cuisine</label>
                <input
                  type="text"
                  value={restCuisine}
                  onChange={(e) => setRestCuisine(e.target.value)}
                  placeholder="e.g. Indian Street Food"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRestOpen(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Add Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

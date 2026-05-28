import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Droplet,
  Award
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    // Clear session
    dispatch({ type: 'LOGOUT' });
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { icon: Bell, label: 'Notifikasi', description: 'Pengaturan notifikasi', path: '#' },
    { icon: Shield, label: 'Keamanan', description: 'Pengaturan keamanan akun', path: '#' },
    { icon: Settings, label: 'Pengaturan', description: 'Pengaturan aplikasi', path: '#' },
    { icon: HelpCircle, label: 'Bantuan', description: 'Bantuan dan dukungan', path: '#' },
  ];

  const getTierBadge = (points: number) => {
    if (points >= 2000) return { tier: 'Platinum', color: 'bg-gradient-to-r from-gray-300 to-gray-400', icon: '👑' };
    if (points >= 1000) return { tier: 'Gold', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500', icon: '🏆' };
    if (points >= 500) return { tier: 'Silver', color: 'bg-gradient-to-r from-gray-400 to-gray-500', icon: '🥈' };
    return { tier: 'Bronze', color: 'bg-gradient-to-r from-amber-600 to-amber-700', icon: '🥉' };
  };

  const tierBadge = getTierBadge(state.ecoPoints);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-nav"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00564A] to-[#00796B] pt-12 pb-8 px-6 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white mb-6">Profil</h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-sm rounded-3xl p-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#00564A] text-2xl font-bold shadow-lg">
              {state.user?.name?.charAt(0) || 'E'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{state.user?.name || 'Eco Warrior'}</h2>
              <p className="text-white/70 text-sm">Member sejak {state.user?.memberSince || 'Januari 2024'}</p>
            </div>
            <div className={`${tierBadge.color} px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1`}>
              <span>{tierBadge.icon}</span>
              <span>{tierBadge.tier}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 flex items-center gap-4 border-b border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-[#DFF5F1] flex items-center justify-center">
              <Mail size={18} className="text-[#00564A]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-gray-900 font-medium">{state.user?.email || 'user@ecorefill.com'}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-4 border-b border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-[#DFF5F1] flex items-center justify-center">
              <Phone size={18} className="text-[#00564A]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Nomor Telepon</p>
              <p className="text-gray-900 font-medium">{state.user?.phone || '+62 812-3456-7890'}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#DFF5F1] flex items-center justify-center">
              <Calendar size={18} className="text-[#00564A]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Member Sejak</p>
              <p className="text-gray-900 font-medium">{state.user?.memberSince || 'January 2024'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 text-center shadow-sm"
          >
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[#DFF5F1] flex items-center justify-center">
              <Droplet size={18} className="text-[#00564A]" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {state.transactions.filter(t => t.type === 'refill').length}
            </p>
            <p className="text-xs text-gray-500">Refills</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 text-center shadow-sm"
          >
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[#E8F5E0] flex items-center justify-center">
              <Award size={18} className="text-[#90BE6D]" />
            </div>
            <p className="text-xl font-bold text-gray-900">{state.ecoPoints}</p>
            <p className="text-xs text-gray-500">Eco Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 text-center shadow-sm"
          >
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[#FFF9E6] flex items-center justify-center">
              <span className="text-lg">🍶</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {state.bottles.filter(b => b.status === 'Active').length}
            </p>
            <p className="text-xs text-gray-500">Botol</p>
          </motion.div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <item.icon size={18} className="text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 mt-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-medium"
        >
          <LogOut size={20} />
          Log Out
        </motion.button>
      </div>

      {/* App Info */}
      <div className="px-6 mt-4 text-center">
        <p className="text-gray-400 text-sm">EcoRefill v1.0.0</p>
      </div>
    </motion.div>
  );
};

export default Profile;

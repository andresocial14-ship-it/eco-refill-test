import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatPoints } from '../utils/formatters';
import {
  Wallet,
  Recycle,
  Leaf,
  ChevronRight,
  Droplet,
  QrCode,
  MapPin,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useMemo } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  const recentTransactions = useMemo(() => {
    return state.transactions.slice(0, 3);
  }, [state.transactions]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const quickActions = [
    { icon: QrCode, label: 'Refill Sekarang', color: '#006035', path: '/refill' },
    { icon: Recycle, label: 'Botol Saya', color: '#008045', path: '/bottles' },
    { icon: MapPin, label: 'Cari Mesin', color: '#00B4D8', path: '/machines' },
    { icon: Leaf, label: 'Eco-Impact', color: '#90BE6D', path: '/eco-impact' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#E8F5EF] to-white pb-nav"
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-gray-500 text-sm">Selamat datang,</p>
            <h1 className="text-2xl font-bold text-gray-900">{state.user?.name || 'Eco Warrior'}</h1>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full bg-[#006035] flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer"
          >
            {state.user?.name?.charAt(0) || 'E'}
          </motion.div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#006035] to-[#008045] rounded-3xl p-6 text-white shadow-xl shadow-[#006035]/30 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet size={20} />
                <span className="text-white/80 text-sm font-medium">Saldo Anda</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/wallet')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Top Up
              </motion.button>
            </div>
            <h2 className="text-4xl font-bold mb-6">{formatRupiah(state.walletBalance)}</h2>

            <div className="flex gap-4">
              <div className="flex-1 bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Recycle size={16} className="text-white/80" />
                  <span className="text-white/80 text-xs">Deposit</span>
                </div>
                <p className="font-bold text-lg">{formatRupiah(state.depositBalance)}</p>
              </div>
              <div className="flex-1 bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Leaf size={16} className="text-white/80" />
                  <span className="text-white/80 text-xs">Eco Points</span>
                </div>
                <p className="font-bold text-lg">{formatPoints(state.ecoPoints)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, idx) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  style={{ backgroundColor: `${action.color}20` }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                >
                  <action.icon size={24} style={{ color: action.color }} />
                </div>
                <span className="text-xs text-gray-600 font-medium text-center leading-tight">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Eco Impact Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 mb-6"
      >
        <div className="bg-gradient-to-r from-[#F0FAF5] to-[#E8F5EF] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#006035]" />
              <span className="font-semibold text-gray-900">Eco-Impact Anda</span>
            </div>
            <button
              onClick={() => navigate('/eco-impact')}
              className="text-[#006035] text-sm font-medium flex items-center gap-1"
            >
              Lihat <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#006035]">{state.ecoStats.plasticBottlesSaved}</p>
              <p className="text-xs text-gray-500 mt-1">Botol Tersimpan</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#006035]">{state.ecoStats.plasticWasteReduced}kg</p>
              <p className="text-xs text-gray-500 mt-1">Sampah Berkurang</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#006035]">{state.ecoStats.treesEquiv}</p>
              <p className="text-xs text-gray-500 mt-1">Pohon Diselamatkan</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
          <button
            onClick={() => navigate('/transactions')}
            className="text-[#006035] text-sm font-medium flex items-center gap-1"
          >
            Lihat Semua <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((txn, idx) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  txn.type === 'refill' ? 'bg-[#E8F5EF]' :
                  txn.type === 'topup' ? 'bg-[#E8F5E0]' :
                  txn.type === 'reward' ? 'bg-[#FFF9E6]' :
                  'bg-[#F3F4F6]'
                }`}
              >
                {txn.type === 'refill' && <Droplet size={20} className="text-[#006035]" />}
                {txn.type === 'topup' && <Wallet size={20} className="text-[#90BE6D]" />}
                {txn.type === 'reward' && <Leaf size={20} className="text-[#F9C74F]" />}
                {txn.type === 'deposit' && <Recycle size={20} className="text-gray-600" />}
                {txn.type === 'refund' && <Wallet size={20} className="text-gray-600" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{txn.description}</p>
                <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
              </div>
              <p className={`font-semibold ${
                txn.type === 'topup' || txn.type === 'refund' ? 'text-green-600' : 'text-gray-900'
              }`}>
                {txn.type === 'topup' || txn.type === 'refund' ? '+' : '-'}
                {formatRupiah(txn.amount)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;

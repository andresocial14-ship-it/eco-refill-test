import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Droplet,
  Wallet,
  Recycle,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  Filter
} from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const Transactions = () => {
  const { state } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'refill' | 'topup' | 'refund' | 'reward'>('all');

  const filters = [
    { id: 'all' as const, label: 'All', icon: null },
    { id: 'refill' as const, label: 'Refills', icon: Droplet },
    { id: 'topup' as const, label: 'Top Ups', icon: Wallet },
    { id: 'refund' as const, label: 'Refunds', icon: Recycle },
    { id: 'reward' as const, label: 'Rewards', icon: Gift },
  ];

  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'all') return state.transactions;
    return state.transactions.filter(t => {
      if (activeFilter === 'refund') return t.type === 'refund' || t.type === 'deposit';
      return t.type === activeFilter;
    });
  }, [state.transactions, activeFilter]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof state.transactions } = {};

    filteredTransactions.forEach(txn => {
      const date = new Date(txn.date);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      let groupKey: string;
      if (diffDays === 0) groupKey = 'Today';
      else if (diffDays === 1) groupKey = 'Yesterday';
      else if (diffDays < 7) groupKey = 'This Week';
      else groupKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(txn);
    });

    return groups;
  }, [filteredTransactions]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'refill': return { icon: Droplet, bg: 'bg-[#DFF5F1]', color: 'text-[#00564A]' };
      case 'topup': return { icon: Wallet, bg: 'bg-green-100', color: 'text-green-600' };
      case 'deposit': return { icon: Recycle, bg: 'bg-blue-100', color: 'text-blue-600' };
      case 'refund': return { icon: Recycle, bg: 'bg-blue-100', color: 'text-blue-600' };
      case 'reward': return { icon: Gift, bg: 'bg-yellow-100', color: 'text-yellow-600' };
      default: return { icon: Wallet, bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  const totalSpent = state.transactions
    .filter(t => t.type === 'refill')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTopUp = state.transactions
    .filter(t => t.type === 'topup')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-nav"
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Riwayat Transaksi</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#DFF5F1] to-white rounded-2xl p-4">
            <p className="text-gray-500 text-sm mb-1">Total Pengeluaran</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-4">
            <p className="text-gray-500 text-sm mb-1">Total Top Ups</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalTopUp)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#00564A] text-white'
                  : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              {filter.icon && <filter.icon size={16} />}
              <span className="font-medium">{filter.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          {Object.keys(groupedTransactions).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Filter size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions found</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Object.entries(groupedTransactions).map(([group, txns], groupIdx) => (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.1 }}
                  className="mb-6"
                >
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">{group}</h3>
                  <div className="space-y-3">
                    {txns.map((txn, idx) => {
                      const { icon: Icon, bg, color } = getTransactionIcon(txn.type);
                      const isCredit = txn.type === 'topup' || txn.type === 'refund';

                      return (
                        <motion.div
                          key={txn.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white rounded-2xl p-4 shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                              <Icon size={20} className={color} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{txn.description}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{formatTime(txn.date)}</span>
                                {txn.machine && (
                                  <>
                                    <span className="text-gray-300">|</span>
                                    <span>{txn.machine}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
                                {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                              </p>
                              {txn.volume && (
                                <p className="text-xs text-gray-400">{txn.volume}ml</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Transactions;

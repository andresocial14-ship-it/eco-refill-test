import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  History,
  X
} from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const topUpAmounts = [
  { amount: 50000, bonus: 0 },
  { amount: 100000, bonus: 5000 },
  { amount: 200000, bonus: 15000 },
  { amount: 500000, bonus: 50000 },
];

const WalletPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async () => {
    if (!selectedAmount) return;

    const topUpData = topUpAmounts.find(t => t.amount === selectedAmount);
    if (!topUpData) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add to wallet
    dispatch({ type: 'TOP_UP_WALLET', payload: topUpData.amount + topUpData.bonus });

    // Add transaction record
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: `TXN${Date.now()}`,
        type: 'topup',
        amount: topUpData.amount + topUpData.bonus,
        date: new Date().toISOString(),
        description: `Wallet Top Up (+${formatCurrency(topUpData.bonus)} bonus)`
      }
    });

    setIsProcessing(false);
    setShowTopUp(false);
    setSelectedAmount(null);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-nav"
    >
      {/* Header with Balance Card */}
      <div className="bg-gradient-to-br from-[#00564A] to-[#00796B] pt-12 pb-8 px-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">My Wallet</h1>
          <Shield size={20} className="text-white/80" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-white/70 text-sm mb-2">Current Balance</p>
          <h2 className="text-5xl font-bold text-white">{formatCurrency(state.walletBalance)}</h2>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTopUp(true)}
          className="w-full bg-white text-[#00564A] py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Top Up
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#00564A]">{state.transactions.length}</p>
            <p className="text-xs text-gray-500">Transactions</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(state.transactions.filter(t => t.type === 'topup').reduce((sum, t) => sum + t.amount, 0))}
            </p>
            <p className="text-xs text-gray-500">Total Top Ups</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(state.transactions.filter(t => t.type === 'refill').reduce((sum, t) => sum + t.amount, 0))}
            </p>
            <p className="text-xs text-gray-500">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <History size={18} />
            Recent Transactions
          </h3>
          <button
            onClick={() => navigate('/transactions')}
            className="text-[#00564A] text-sm font-medium"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {state.transactions.slice(0, 5).map((txn, idx) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  txn.type === 'topup' || txn.type === 'refund'
                    ? 'bg-green-100'
                    : txn.type === 'refill'
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}
              >
                {txn.type === 'topup' || txn.type === 'refund' ? (
                  <ArrowDownLeft size={20} className="text-green-600" />
                ) : (
                  <ArrowUpRight size={20} className="text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{txn.description}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(txn.date)} at {formatTime(txn.date)}
                </p>
              </div>
              <p
                className={`font-semibold ${
                  txn.type === 'topup' || txn.type === 'refund'
                    ? 'text-green-600'
                    : 'text-gray-900'
                }`}
              >
                {txn.type === 'topup' || txn.type === 'refund' ? '+' : '-'}
                {formatCurrency(txn.amount)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowTopUp(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Top Up Wallet</h2>
                <button
                  onClick={() => setShowTopUp(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {topUpAmounts.map((topUp, idx) => (
                  <motion.button
                    key={topUp.amount}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAmount(topUp.amount)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedAmount === topUp.amount
                        ? 'border-[#00564A] bg-[#DFF5F1]'
                        : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {formatCurrency(topUp.amount)}
                        </p>
                        {topUp.bonus > 0 && (
                          <p className="text-sm text-green-600 font-medium">
                            +{formatCurrency(topUp.bonus)} bonus
                          </p>
                        )}
                      </div>
                      {selectedAmount === topUp.amount && (
                        <div className="w-6 h-6 rounded-full bg-[#00564A] flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {selectedAmount && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 rounded-xl p-4 mb-4"
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium">{formatCurrency(selectedAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Bonus</span>
                    <span className="font-medium text-green-600">
                      +{formatCurrency(topUpAmounts.find(t => t.amount === selectedAmount)?.bonus || 0)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg text-[#00564A]">
                      {formatCurrency(selectedAmount + (topUpAmounts.find(t => t.amount === selectedAmount)?.bonus || 0))}
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTopUp}
                disabled={!selectedAmount || isProcessing}
                className="w-full bg-[#00564A] text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wallet size={20} />
                    Top Up Now
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Simulated top up - no real payment
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletPage;

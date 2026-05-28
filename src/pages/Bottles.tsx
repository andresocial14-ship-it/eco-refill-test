import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Recycle,
  Droplet,
  Calendar,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Plus,
  X,
  ArrowLeft
} from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const bottleTypes = [
  { type: 'Standard', size: '300ml', deposit: 10000 },
  { type: 'Standard', size: '500ml', deposit: 15000 },
  { type: 'Standard', size: '1000ml', deposit: 25000 },
  { type: 'Premium', size: '500ml', deposit: 20000 },
];

const Bottles = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeBottles = state.bottles.filter(b => b.status === 'Active');
  const returnedBottles = state.bottles.filter(b => b.status !== 'Active');

  const totalDeposit = state.bottles
    .filter(b => b.status === 'Active')
    .reduce((sum, b) => sum + b.depositAmount, 0);

  const handleReturnBottle = async () => {
    if (!selectedBottle) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const bottle = state.bottles.find(b => b.id === selectedBottle);
    if (bottle) {
      // Update bottle status
      dispatch({
        type: 'UPDATE_BOTTLE',
        payload: { id: selectedBottle, updates: { status: 'Returned' as const } }
      });

      // Refund deposit
      dispatch({ type: 'TOP_UP_WALLET', payload: bottle.depositAmount });

      // Add transaction
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: `TXN${Date.now()}`,
          type: 'refund',
          amount: bottle.depositAmount,
          date: new Date().toISOString(),
          description: `Bottle Return Refund (${bottle.type} ${bottle.size})`
        }
      });
    }

    setIsProcessing(false);
    setShowReturnModal(false);
    setSelectedBottle(null);
  };

  const handlePurchaseBottle = async (bottle: typeof bottleTypes[0]) => {
    if (state.walletBalance < bottle.deposit) {
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Deduct from wallet
    dispatch({ type: 'DEDUCT_WALLET', payload: bottle.deposit });

    // Add bottle
    const newBottle = {
      id: `BTL${Date.now()}`,
      type: bottle.type,
      size: bottle.size,
      status: 'Active' as const,
      depositAmount: bottle.deposit,
      purchaseDate: new Date().toISOString().split('T')[0],
      refillsCount: 0
    };
    dispatch({ type: 'ADD_BOTTLE', payload: newBottle });

    // Add transaction
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: `TXN${Date.now()}`,
        type: 'deposit',
        amount: bottle.deposit,
        date: new Date().toISOString(),
        description: `New ${bottle.type} Bottle Deposit (${bottle.size})`
      }
    });

    setIsProcessing(false);
    setShowPurchaseModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Returned': return 'bg-blue-100 text-blue-700';
      case 'Recycled': return 'bg-purple-100 text-purple-700';
      case 'Damaged': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-nav"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#006035] to-[#006035] pt-12 pb-8 px-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Bottle Deposits</h1>
            <p className="text-white/70 text-sm">Manage your reusable bottles</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Recycle size={18} className="text-white/80" />
              <span className="text-white/80 text-sm">Active Bottles</span>
            </div>
            <p className="text-3xl font-bold text-white">{activeBottles.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplet size={18} className="text-white/80" />
              <span className="text-white/80 text-sm">Total Deposit</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalDeposit)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPurchaseModal(true)}
          className="w-full bg-gradient-to-r from-[#006035] to-[#008045] py-4 px-4 rounded-2xl shadow-lg shadow-[#006035]/20 flex items-center justify-center gap-2 text-white font-bold text-lg"
        >
          <Plus size={20} />
          Konfirmasi Deposit Botol Baru
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowReturnModal(true)}
          className="w-full bg-white py-3 px-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 text-[#006035] font-medium"
        >
          <RotateCcw size={18} />
          Kembalikan Botol
        </motion.button>
      </div>

      {/* Active Bottles */}
      {activeBottles.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Active Bottles</h3>
          <div className="space-y-3">
            {activeBottles.map((bottle, idx) => (
              <motion.div
                key={bottle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E8F5EF] to-white flex items-center justify-center">
                    <Droplet size={24} className="text-[#006035]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{bottle.type} Bottle</h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{bottle.size} capacity</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {bottle.purchaseDate}
                      </span>
                      <span>{bottle.refillsCount} refills</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Deposit</p>
                    <p className="font-bold text-[#006035]">{formatCurrency(bottle.depositAmount)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Past Bottles */}
      {returnedBottles.length > 0 && (
        <div className="px-6">
          <h3 className="font-semibold text-gray-900 mb-3">History</h3>
          <div className="space-y-3">
            {returnedBottles.map((bottle, idx) => (
              <motion.div
                key={bottle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm opacity-60"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Recycle size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{bottle.type} {bottle.size}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bottle.status)}`}>
                        {bottle.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{bottle.refillsCount} total refills</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeBottles.length === 0 && (
        <div className="px-6 text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Recycle size={32} className="text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No Active Bottles</h3>
          <p className="text-gray-500 text-sm mb-4">Purchase a reusable bottle to get started</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPurchaseModal(true)}
            className="bg-[#006035] text-white px-6 py-3 rounded-xl font-medium"
          >
            Get a Bottle
          </motion.button>
        </div>
      )}

      {/* Return Modal */}
      <AnimatePresence>
        {showReturnModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowReturnModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Return Bottle</h2>
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                Select the bottle you want to return. Your deposit will be refunded to your wallet.
              </p>

              <div className="space-y-3 mb-6">
                {activeBottles.map((bottle) => (
                  <button
                    key={bottle.id}
                    onClick={() => setSelectedBottle(bottle.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedBottle === bottle.id
                        ? 'border-[#006035] bg-[#E8F5EF]'
                        : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{bottle.type} {bottle.size}</p>
                        <p className="text-sm text-gray-500">Deposit: {formatCurrency(bottle.depositAmount)}</p>
                      </div>
                      {selectedBottle === bottle.id && (
                        <CheckCircle size={24} className="text-[#006035]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReturnBottle}
                disabled={!selectedBottle || isProcessing}
                className="w-full bg-[#006035] text-white py-4 rounded-2xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RotateCcw size={20} />
                    Return & Get Refund
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Purchase Bottle</h2>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                Choose a bottle type. Deposit is refundable when you return the bottle.
              </p>

              <div className="space-y-3 mb-4">
                {bottleTypes.map((bottle, idx) => {
                  const canAfford = state.walletBalance >= bottle.deposit;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={canAfford ? { scale: 1.02 } : {}}
                      whileTap={canAfford ? { scale: 0.98 } : {}}
                      onClick={() => canAfford && handlePurchaseBottle(bottle)}
                      disabled={!canAfford || isProcessing}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                        canAfford ? 'border-gray-100' : 'border-gray-100 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{bottle.type} {bottle.size}</p>
                          <p className="text-sm text-gray-500">Deposit: {formatCurrency(bottle.deposit)}</p>
                          {!canAfford && (
                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertTriangle size={12} />
                              Insufficient balance
                            </p>
                          )}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[#E8F5EF] flex items-center justify-center">
                          <Droplet size={20} className="text-[#006035]" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-xs text-gray-400 text-center">
                Wallet: {formatCurrency(state.walletBalance)}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Bottles;

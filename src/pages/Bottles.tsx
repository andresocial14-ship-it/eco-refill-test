import { useState, useEffect } from 'react';
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
  ArrowLeft,
  QrCode,
  Scan
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
  const [qrVerification, setQrVerification] = useState<{
    type: 'purchase' | 'return';
    status: 'pending' | 'success';
    bottle?: typeof bottleTypes[0];
    bottleId?: string;
  } | null>(null);

  useEffect(() => {
    if (qrVerification?.status === 'pending') {
      const timer = setTimeout(() => {
        executeVerification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [qrVerification?.status]);

  const activeBottles = state.bottles.filter(b => b.status === 'Aktif');
  const returnedBottles = state.bottles.filter(b => b.status !== 'Aktif');

  const totalDeposit = state.bottles
    .filter(b => b.status === 'Aktif')
    .reduce((sum, b) => sum + b.depositAmount, 0);

  const handleReturnBottle = () => {
    if (!selectedBottle) return;
    setShowReturnModal(false);
    setQrVerification({ type: 'return', status: 'pending', bottleId: selectedBottle });
  };

  const handlePurchaseBottle = (bottle: typeof bottleTypes[0]) => {
    if (state.walletBalance < bottle.deposit) {
      return;
    }
    setShowPurchaseModal(false);
    setQrVerification({ type: 'purchase', status: 'pending', bottle });
  };

  const executeVerification = async () => {
    if (!qrVerification) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (qrVerification.type === 'return' && qrVerification.bottleId) {
      const bottle = state.bottles.find(b => b.id === qrVerification.bottleId);
      if (bottle) {
        dispatch({
          type: 'UPDATE_BOTTLE',
          payload: { id: qrVerification.bottleId, updates: { status: 'Dikembalikan' as any } }
        });
        dispatch({ type: 'TOP_UP_WALLET', payload: bottle.depositAmount });
        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            id: `TXN${Date.now()}`,
            type: 'refund',
            amount: bottle.depositAmount,
            date: new Date().toISOString(),
            description: `Refund Deposit Botol (${bottle.type} ${bottle.size})`
          }
        });
      }
      setSelectedBottle(null);
    } else if (qrVerification.type === 'purchase' && qrVerification.bottle) {
      const bottle = qrVerification.bottle;
      dispatch({ type: 'DEDUCT_WALLET', payload: bottle.deposit });
      const newBottle = {
        id: `BTL${Date.now()}`,
        type: bottle.type,
        size: bottle.size,
        status: 'Aktif' as any,
        depositAmount: bottle.deposit,
        purchaseDate: new Date().toISOString().split('T')[0],
        refillsCount: 0
      };
      dispatch({ type: 'ADD_BOTTLE', payload: newBottle });
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: `TXN${Date.now()}`,
          type: 'deposit',
          amount: bottle.deposit,
          date: new Date().toISOString(),
          description: `Deposit Botol Baru (${bottle.type} ${bottle.size})`
        }
      });
    }

    setIsProcessing(false);
    setQrVerification(prev => prev ? { ...prev, status: 'success' } : null);
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
            <h1 className="text-xl font-bold text-white mb-1">Deposit Botol</h1>
            <p className="text-white/70 text-sm">Kelola Botol Deposit Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Recycle size={18} className="text-white/80" />
              <span className="text-white/80 text-sm">Botol Aktif</span>
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
          Deposit Botol Baru
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
          <h3 className="font-semibold text-gray-900 mb-3">Botol Aktif</h3>
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
                <h2 className="text-xl font-bold text-gray-900">Pengembalian Botol</h2>
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                Pilih botol yang ingin dikembalikan. Deposit Anda akan dikembalikan ke dompet Anda.
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
                    Konfirmasi
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

      {/* QR Verification Modal */}
      <AnimatePresence>
        {qrVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-6"
          >
            {qrVerification.status === 'pending' && (
              <>
                <button
                  onClick={() => setQrVerification(null)}
                  className="absolute top-12 left-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={20} className="text-gray-600" />
                </button>
                
                <div className="text-center w-full max-w-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Transaksi</h2>
                  <p className="text-gray-500 mb-8">
                    Pindai QR code ini pada sensor mesin Eco Vending Machine untuk memverifikasi deposit/pengembalian botol Anda
                  </p>

                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 mb-8 aspect-square relative flex items-center justify-center border-4 border-[#006035]">
                    {/* Dummy QR Code Pattern */}
                    <div className="absolute inset-4 grid grid-cols-5 gap-2 opacity-20">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`bg-[#006035] ${i % 2 === 0 ? 'rounded-tl-lg rounded-br-lg' : 'rounded-tr-lg rounded-bl-lg'}`} />
                      ))}
                    </div>
                    <QrCode size={120} className="text-[#006035] relative z-10" />
                    
                    {/* Scanning overlay animation */}
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#006035] to-transparent z-20 opacity-50"
                    />
                  </div>

                  {/* Automated Scanner Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 rounded-2xl p-4 mb-8"
                  >
                    <div className="flex items-center gap-3 justify-center text-[#006035] font-medium">
                      <div className="w-5 h-5 border-2 border-[#006035]/30 border-t-[#006035] rounded-full animate-spin" />
                      <span>Mensimulasikan Pemindaian...</span>
                    </div>
                  </motion.div>
                </div>
              </>
            )}

            {qrVerification.status === 'success' && (
              <div className="text-center w-full max-w-sm relative z-10">
                {/* Confetti Particles Background */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, y: 0, x: 0, scale: 0 }}
                      animate={{ 
                        opacity: 0, 
                        y: -200 - Math.random() * 200, 
                        x: (Math.random() - 0.5) * 300, 
                        scale: Math.random() * 1.5 + 0.5,
                        rotate: Math.random() * 360
                      }}
                      transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
                      className={`absolute top-1/2 left-1/2 w-3 h-3 ${i % 2 === 0 ? 'bg-[#006035]' : 'bg-[#90BE6D]'} rounded-sm`}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-32 h-32 mx-auto mb-6 bg-[#E8F5EF] rounded-full flex items-center justify-center shadow-xl"
                >
                  <CheckCircle size={64} className="text-[#006035]" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {qrVerification.type === 'purchase' ? 'Deposit Berhasil!' : 'Pengembalian Berhasil!'}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-500 mb-8"
                >
                  {qrVerification.type === 'purchase' ? 'Botol baru Anda siap digunakan.' : 'Deposit botol telah dikembalikan ke dompet Anda.'}
                </motion.p>

                {/* Animated Eco Metrics */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 mb-8 border border-gray-100"
                >
                  <div className="flex justify-around items-center">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm mb-2">Eco Points</p>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-2xl font-bold text-[#90BE6D]"
                      >
                        +100 Points
                      </motion.p>
                    </div>
                    <div className="w-px h-12 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-gray-500 text-sm mb-2">Botol Plastik Terselamatkan</p>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-2xl font-bold text-[#006035]"
                      >
                        +1 Botol
                      </motion.p>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setQrVerification(null)}
                  className="w-full bg-[#006035] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-[#006035]/20"
                >
                  Selesai
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Bottles;

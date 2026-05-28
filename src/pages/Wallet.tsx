import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatRupiah, formatDate, formatTime } from '../utils/formatters';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Minus,
  CreditCard,
  Building2,
  Smartphone,
  X,
  History,
  ChevronRight
} from 'lucide-react';

const topUpAmounts = [
  { amount: 25000, bonus: 0, label: 'Rp25.000' },
  { amount: 50000, bonus: 2500, label: 'Rp50.000' },
  { amount: 100000, bonus: 7500, label: 'Rp100.000' },
  { amount: 200000, bonus: 20000, label: 'Rp200.000' },
  { amount: 500000, bonus: 75000, label: 'Rp500.000' },
];

const paymentMethods = [
  { id: 'gopay', name: 'GoPay', icon: Smartphone, color: '#00AA13' },
  { id: 'ovo', name: 'OVO', icon: CreditCard, color: '#4C3494' },
  { id: 'dana', name: 'DANA', icon: Wallet, color: '#118EEA' },
  { id: 'bank', name: 'Transfer Bank', icon: Building2, color: '#006035' },
];

const WithdrawPage = () => {
  const navigate = useNavigate();
};

const WalletPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPayment, setWithdrawPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleTopUp = async () => {
    const amount = showCustomInput ? parseInt(customAmount) : selectedAmount;
    if (!amount || amount < 10000 || !selectedPayment) return;

    const bonus = topUpAmounts.find(t => t.amount === amount)?.bonus || 0;
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const totalAmount = amount + bonus;
    dispatch({ type: 'TOP_UP_WALLET', payload: totalAmount });

    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: `TXN${Date.now()}`,
        type: 'topup',
        amount: totalAmount,
        date: new Date().toISOString(),
        description: `Top Up Dompet ${bonus > 0 ? `(+Rp${bonus.toLocaleString()} bonus)` : ''}`
      }
    });

    setIsProcessing(false);
    setShowTopUp(false);
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedPayment(null);
    setShowCustomInput(false);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawPayment) return;
    const amount = parseInt(withdrawAmount);
    if (amount > state.walletBalance) return;

    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    dispatch({ type: 'WITHDRAW_WALLET', payload: amount });

    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: `TXN${Date.now()}`,
        type: 'refund',
        amount: amount,
        date: new Date().toISOString(),
        description: `Penarikan Saldo ke ${paymentMethods.find(p => p.id === withdrawPayment)?.name}`
      }
    });

    setIsProcessing(false);
    setShowWithdraw(false);
    setWithdrawAmount('');
    setWithdrawPayment(null);
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
      {/* Header with Balance Card */}
      <div className="bg-gradient-to-br from-[#006035] to-[#008045] pt-12 pb-8 px-6 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white mb-6">Dompet Saya</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-white/70 text-sm mb-2">Saldo Saat Ini</p>
          <h2 className="text-5xl font-bold text-white">{formatRupiah(state.walletBalance)}</h2>
        </motion.div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTopUp(true)}
            className="flex-1 bg-white text-[#006035] py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Top Up
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowWithdraw(true)}
            className="flex-1 bg-white/20 backdrop-blur-sm text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Minus size={20} />
            Tarik Saldo
          </motion.button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Total Top Up</p>
            <p className="text-xl font-bold text-green-600">{formatRupiah(totalTopUp)}</p>
          </div>
          <div className="text-center border-l border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total Pengeluaran</p>
            <p className="text-xl font-bold text-gray-900">{formatRupiah(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <History size={18} />
            Transaksi Terbaru
          </h3>
          <button
            onClick={() => navigate('/transactions')}
            className="text-[#006035] text-sm font-medium flex items-center gap-1"
          >
            Lihat Semua <ChevronRight size={16} />
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
                    ? 'bg-[#E8F5EF]'
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
                  {formatDate(txn.date)} {formatTime(txn.date)}
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
                {formatRupiah(txn.amount)}
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
              className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Top Up Dompet</h2>
                <button
                  onClick={() => setShowTopUp(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                {/* Preset Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {topUpAmounts.map((topUp, idx) => (
                    <motion.button
                      key={topUp.amount}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedAmount(topUp.amount);
                        setShowCustomInput(false);
                      }}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedAmount === topUp.amount && !showCustomInput
                          ? 'border-[#006035] bg-[#E8F5EF]'
                          : 'border-gray-100'
                      }`}
                    >
                      <p className="font-bold text-gray-900 text-sm">{topUp.label}</p>
                      {topUp.bonus > 0 && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          +Rp{topUp.bonus.toLocaleString()}
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setShowCustomInput(true);
                      setSelectedAmount(null);
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      showCustomInput ? 'border-[#006035] bg-[#E8F5EF]' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Nominal Lainnya</p>
                        <p className="text-xs text-gray-400">Masukkan jumlah custom</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </button>

                  {showCustomInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                        <input
                          type="number"
                          placeholder="Masukkan nominal"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#006035] focus:ring-2 focus:ring-[#006035]/20 outline-none"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Minimum Rp10.000</p>
                    </motion.div>
                  )}
                </div>

                {/* Payment Methods */}
                <h3 className="font-semibold text-gray-900 mb-3">Metode Pembayaran</h3>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        selectedPayment === method.id
                          ? 'border-[#006035] bg-[#E8F5EF]'
                          : 'border-gray-100'
                      }`}
                    >
                      <div
                        style={{ backgroundColor: `${method.color}20` }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                      >
                        <method.icon size={24} style={{ color: method.color }} />
                      </div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      {selectedPayment === method.id && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-[#006035] flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Summary Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTopUp}
                  disabled={isProcessing || !selectedPayment || (!selectedAmount && !customAmount)}
                  className="w-full bg-[#006035] text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50	flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    `Top Up ${formatRupiah(parseInt(customAmount) || selectedAmount || 0)}`
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowWithdraw(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tarik Saldo</h2>
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              {/* Balance */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-500">Saldo Tersedia</p>
                <p className="text-2xl font-bold text-[#006035]">{formatRupiah(state.walletBalance)}</p>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Jumlah Penarikan
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                  <input
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:border-[#006035] focus:ring-2 focus:ring-[#006035]/20 outline-none"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setWithdrawAmount(amt.toString())}
                      className="flex-1 py-2 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200"
                    >
                      Rp{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <h3 className="font-medium text-gray-900 mb-2">Tujuan Penarikan</h3>
              <div className="space-y-2 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setWithdrawPayment(method.id)}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                      withdrawPayment === method.id
                        ? 'border-[#006035] bg-[#E8F5EF]'
                        : 'border-gray-100'
                    }`}
                  >
                    <method.icon size={20} style={{ color: method.color }} />
                    <span className="text-sm font-medium text-gray-900">{method.name}</span>
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWithdraw}
                disabled={isProcessing || !withdrawPayment || !withdrawAmount}
                className="w-full bg-[#006035] text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  `Tarik ${formatRupiah(parseInt(withdrawAmount) || 0)}`
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletPage;

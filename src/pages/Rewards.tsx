import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { rewards } from '../data/mockData';
import { ArrowLeft, Gift, Star, Lock, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Rewards = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedReward, setSelectedReward] = useState<typeof rewards[0] | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getTierInfo = (points: number) => {
    if (points >= 2000) return { tier: 'Platinum', color: '#6B7280', icon: '👑' };
    if (points >= 1000) return { tier: 'Gold', color: '#F59E0B', icon: '🏆' };
    if (points >= 500) return { tier: 'Silver', color: '#9CA3AF', icon: '🥈' };
    return { tier: 'Bronze', color: '#CD7F32', icon: '🥉' };
  };

  const tierInfo = getTierInfo(state.ecoPoints);

  const handleRedeem = async (reward: typeof rewards[0]) => {
    if (state.ecoPoints < reward.pointsCost) return;

    setIsRedeeming(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    dispatch({ type: 'SET_ECO_POINTS', payload: state.ecoPoints - reward.pointsCost });

    if (reward.category === 'discount' || reward.category === 'freeRefill') {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: `TXN${Date.now()}`,
          type: 'reward',
          amount: 0,
          date: new Date().toISOString(),
          description: `Redeemed: ${reward.name}`
        }
      });
    }

    setIsRedeeming(false);
    setSelectedReward(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-nav"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#006035] to-[#008045] pt-12 pb-6 px-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Rewards</h1>
        </div>

        {/* Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{tierInfo.icon}</div>
              <div>
                <p className="text-white/70 text-sm">{tierInfo.tier} Member</p>
                <p className="text-3xl font-bold text-white">{state.ecoPoints.toLocaleString()} pts</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">Eco Points</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Available Rewards */}
      <div className="px-6 py-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Gift size={18} className="text-[#006035]" />
          Tukar Rewards
        </h3>

        <div className="space-y-3">
          {rewards.map((reward, idx) => {
            const canRedeem = state.ecoPoints >= reward.pointsCost;

            return (
              <motion.button
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={canRedeem ? { scale: 1.01 } : {}}
                whileTap={canRedeem ? { scale: 0.99 } : {}}
                onClick={() => canRedeem && setSelectedReward(reward)}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm text-left ${
                  !canRedeem && 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#E8F5EF] flex items-center justify-center text-2xl">
                    {reward.image}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{reward.name}</p>
                    <p className="text-sm text-gray-500">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${canRedeem ? 'text-[#006035]' : 'text-gray-400'}`}>
                      {reward.pointsCost} pts
                    </p>
                    {!canRedeem && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <Lock size={12} />
                        {reward.pointsCost - state.ecoPoints} pts lagi
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* How to Earn */}
      <div className="px-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star size={18} className="text-yellow-500" />
          Cara Mendapatkan Poin
        </h3>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5EF] flex items-center justify-center text-sm">
                  💧
                </div>
                <span className="text-gray-600">Selesaikan refill</span>
              </div>
              <span className="font-semibold text-[#006035]">1 pts/Rp100</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5EF] flex items-center justify-center text-sm">
                  🎁
                </div>
                <span className="text-gray-600">Kembalikan botol</span>
              </div>
              <span className="font-semibold text-[#006035]">+50 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5EF] flex items-center justify-center text-sm">
                  📱
                </div>
                <span className="text-gray-600">Ajak teman</span>
              </div>
              <span className="font-semibold text-[#006035]">+200 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Modal */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Tukar Reward</h2>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#E8F5EF] flex items-center justify-center text-4xl">
                  {selectedReward.image}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedReward.name}</h3>
                <p className="text-gray-500 text-sm">{selectedReward.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Poin Diperlukan</span>
                  <span className="font-semibold">{selectedReward.pointsCost} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Poin Anda</span>
                  <span className="font-semibold text-[#006035]">{state.ecoPoints} pts</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                  <span className="font-semibold">Sisa Poin</span>
                  <span className="font-bold text-lg">{state.ecoPoints - selectedReward.pointsCost} pts</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRedeem(selectedReward)}
                disabled={isRedeeming}
                className="w-full bg-[#006035] text-white py-4 rounded-2xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRedeeming ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Tukar Sekarang
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-6 right-6 bg-[#006035] text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg z-50"
          >
            <span className="text-2xl">✅</span>
            <p className="font-medium">Reward berhasil ditukar!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Rewards;

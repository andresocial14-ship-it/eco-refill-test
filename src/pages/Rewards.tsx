import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { rewards, achievements } from '../data/mockData';
import {
  Gift,
  Star,
  Trophy,
  CheckCircle,
  Lock,
  X,
  Sparkles,
  Award
} from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const Rewards = () => {
  const { state, dispatch } = useApp();
  const [selectedReward, setSelectedReward] = useState<typeof rewards[0] | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRedeem = async (reward: typeof rewards[0]) => {
    if (state.ecoPoints < reward.pointsCost) return;

    setIsRedeeming(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Deduct points
    dispatch({ type: 'SET_ECO_POINTS', payload: state.ecoPoints - reward.pointsCost });

    // Add transaction if it's a discount
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
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const getTierInfo = (points: number) => {
    if (points >= 2000) return { tier: 'Platinum', color: '#6B7280', icon: '👑' };
    if (points >= 1000) return { tier: 'Gold', color: '#F9C74F', icon: '🏆' };
    if (points >= 500) return { tier: 'Silver', color: '#9CA3AF', icon: '🥈' };
    return { tier: 'Bronze', color: '#CD7F32', icon: '🥉' };
  };

  const tierInfo = getTierInfo(state.ecoPoints);
  const pointsToNextTier = state.ecoPoints >= 2000 ? 0 :
    state.ecoPoints >= 1000 ? 2000 - state.ecoPoints :
    state.ecoPoints >= 500 ? 1000 - state.ecoPoints :
    500 - state.ecoPoints;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-nav"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00564A] to-[#00796B] pt-12 pb-6 px-6 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white mb-4">Rewards & Achievements</h1>

        {/* Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{tierInfo.icon}</div>
              <div>
                <p className="text-white/70 text-sm">{tierInfo.tier} Member</p>
                <p className="text-3xl font-bold text-white">{state.ecoPoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">Eco Points</p>
              <p className="text-white text-sm font-medium">
                {pointsToNextTier > 0 ? `${pointsToNextTier} to next tier` : 'Max tier!'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((state.ecoPoints / 2000) * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="px-6 py-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Trophy size={18} className="text-[#F9C74F]" />
          Achievements
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex-shrink-0 w-28 p-3 rounded-2xl text-center ${
                achievement.unlocked ? 'bg-[#DFF5F1]' : 'bg-gray-100 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <p className="font-medium text-gray-900 text-sm mb-1">{achievement.title}</p>
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00564A] rounded-full"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{achievement.progress}%</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div className="px-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Gift size={18} className="text-[#00564A]" />
          Redeem Rewards
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
                whileHover={canRedeem ? { scale: 1.02 } : {}}
                whileTap={canRedeem ? { scale: 0.98 } : {}}
                onClick={() => canRedeem && setSelectedReward(reward)}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm text-left ${
                  !canRedeem && 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#DFF5F1] flex items-center justify-center text-2xl">
                    {reward.image}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{reward.name}</p>
                    <p className="text-sm text-gray-500">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${canRedeem ? 'text-[#00564A]' : 'text-gray-400'}`}>
                      {reward.pointsCost} pts
                    </p>
                    {!canRedeem && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Lock size={12} />
                        {reward.pointsCost - state.ecoPoints} more
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
      <div className="px-6 mt-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star size={18} className="text-[#F9C74F]" />
          How to Earn Points
        </h3>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DFF5F1] flex items-center justify-center text-sm">
                  🔄
                </div>
                <span className="text-gray-600">Complete a refill</span>
              </div>
              <span className="font-semibold text-[#00564A]">1 pt/Rp100</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DFF5F1] flex items-center justify-center text-sm">
                  🎁
                </div>
                <span className="text-gray-600">Return a bottle</span>
              </div>
              <span className="font-semibold text-[#00564A]">+50 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DFF5F1] flex items-center justify-center text-sm">
                  📱
                </div>
                <span className="text-gray-600">Refer a friend</span>
              </div>
              <span className="font-semibold text-[#00564A]">+200 pts</span>
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
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
                <h2 className="text-xl font-bold text-gray-900">Redeem Reward</h2>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#DFF5F1] flex items-center justify-center text-4xl">
                  {selectedReward.image}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedReward.name}</h3>
                <p className="text-gray-500 text-sm">{selectedReward.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Points Required</span>
                  <span className="font-semibold">{selectedReward.pointsCost} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Your Points</span>
                  <span className="font-semibold text-[#00564A]">{state.ecoPoints} pts</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                  <span className="font-semibold">Remaining Points</span>
                  <span className="font-bold text-lg">
                    {state.ecoPoints - selectedReward.pointsCost} pts
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRedeem(selectedReward)}
                disabled={isRedeeming}
                className="w-full bg-[#00564A] text-white py-4 rounded-2xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRedeeming ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Redeem Now
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
            className="fixed bottom-24 left-6 right-6 bg-green-600 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg z-50"
          >
            <CheckCircle size={20} />
            <p className="font-medium">Reward redeemed successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Rewards;

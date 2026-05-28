import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { achievements } from '../data/mockData';
import { formatPoints } from '../utils/formatters';
import {
  Recycle,
  Leaf,
  Droplet,
  TreePine,
  TrendingUp,
  Award,
  Globe2,
  Sparkles,
  ArrowLeft,
  Trophy
} from 'lucide-react';

const AnimatedNumber = ({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const CircularProgress = ({ value, max, size = 120, strokeWidth = 10, color = '#006035' }: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
};

const EcoImpact = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const stats = state.ecoStats;

  const impactCards = [
    {
      icon: Recycle,
      label: 'Botol Tersimpan',
      value: stats.plasticBottlesSaved,
      maxValue: 5000,
      color: '#006035',
      bg: 'from-[#E8F5EF] to-white',
      impact: `${(stats.plasticBottlesSaved * 30).toLocaleString()}g plastik`
    },
    {
      icon: Leaf,
      label: 'Sampah Berkurang',
      value: stats.plasticWasteReduced,
      maxValue: 100,
      suffix: 'kg',
      color: '#90BE6D',
      bg: 'from-[#E8F5E0] to-white',
      impact: 'Pengurangan diperkirakan'
    },
    {
      icon: Droplet,
      label: 'Air Tersimpan',
      value: stats.waterSaved,
      maxValue: 10000,
      suffix: 'L',
      color: '#00B4D8',
      bg: 'from-[#E0F7F7] to-white',
      impact: 'Dibanding produksi baru'
    },
    {
      icon: TreePine,
      label: 'Pohon Setara',
      value: stats.treesEquiv,
      maxValue: 20,
      suffix: '',
      color: '#10B981',
      bg: 'from-[#E6F5E9] to-white',
      impact: 'CO2 yang diserap'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-nav"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#006035] to-[#008045] pt-12 pb-8 px-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Eco Impact</h1>
            <p className="text-white/70 text-sm">Kontribusi Anda untuk bumi</p>
          </div>
        </div>

        {/* Main Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-sm rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">CO2 Berkurang</p>
              <p className="text-4xl font-bold text-white mt-1">
                <AnimatedNumber value={stats.carbonFootprintReduced} suffix="kg" />
              </p>
              <p className="text-white/60 text-xs mt-1">Setara CO2</p>
            </div>
            <div className="relative">
              <CircularProgress
                value={stats.carbonFootprintReduced}
                max={200}
                size={100}
                strokeWidth={8}
                color="#fff"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe2 size={28} className="text-white/80" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/80 text-sm">
            <TrendingUp size={16} />
            <span>Anda membuat perubahan nyata!</span>
          </div>
        </motion.div>
      </div>

      {/* Impact Cards Grid */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dampak Lingkungan</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {impactCards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${card.bg} rounded-2xl p-4`}
            >
              <div className="flex items-center gap-2 mb-3">
                <card.icon size={18} style={{ color: card.color }} />
                <span className="text-xs text-gray-500">{card.label}</span>
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-1">
                <AnimatedNumber value={card.value} suffix={card.suffix} />
              </p>

              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(card.value / card.maxValue) * 100}%` }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: card.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy size={20} className="text-yellow-500" />
              Achievements
            </h2>
            <span className="text-sm text-gray-500">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} terbuka
            </span>
          </div>

          <div className="space-y-3">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`bg-white rounded-2xl p-4 shadow-sm ${
                  !achievement.unlocked && 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      achievement.unlocked ? 'bg-[#E8F5EF]' : 'bg-gray-100'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      {achievement.unlocked && (
                        <Sparkles size={14} className="text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{achievement.description}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                          className="h-full bg-gradient-to-r from-[#006035] to-[#008045] rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {achievement.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Eco Tips */}
        <div className="bg-gradient-to-br from-[#E8F5EF] to-white rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Leaf size={18} className="text-[#006035]" />
            Tahukah Anda?
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Satu refill botol 500ml menghemat sekitar 30g plastik dari masuk ke lingkungan.
            Itu setara dengan menghemat 150ml air dibandingkan memproduksi botol baru.
          </p>
          <div className="mt-4 pt-4 border-t border-green-100">
            <p className="text-[#006035] font-medium text-sm">
              Refill selanjutnya bisa menyelamatkan botol lain! 🌱
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EcoImpact;

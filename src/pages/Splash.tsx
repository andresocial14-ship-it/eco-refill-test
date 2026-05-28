import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Droplet } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.isAuthenticated) {
        navigate('/home', { replace: true });
      } else if (state.hasSeenOnboarding) {
        navigate('/login', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, state.isAuthenticated, state.hasSeenOnboarding]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#DFF5F1] via-[#E8F5F2] to-white"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-24 h-24 bg-[#00564A] rounded-3xl flex items-center justify-center shadow-lg shadow-[#00564A]/30"
          >
            <Droplet size={48} className="text-white" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#00796B] rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">ECO</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-bold text-[#00564A] mb-2"
      >
        EcoRefill
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 text-lg font-light"
      >
        Refill smarter. Waste less.
      </motion.p>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2.5 h-2.5 bg-[#00564A] rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* Version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-gray-400 text-sm"
      >
        Version 1.0.0
      </motion.p>
    </motion.div>
  );
};

export default Splash;

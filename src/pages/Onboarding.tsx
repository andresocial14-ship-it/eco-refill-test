import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Droplet, Recycle, Leaf, QrCode, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    icon: Droplet,
    title: 'Refill, Don\'t Replace',
    description: 'Bring your reusable bottles to our smart vending machines and refill your favorite household products.',
    color: '#00B4D8',
    bg: 'from-[#DFF5F1] to-white'
  },
  {
    id: 2,
    icon: Recycle,
    title: 'Reduce Plastic Waste',
    description: 'Every refill saves plastic bottles from landfills. Join our mission to eliminate single-use plastics.',
    color: '#90BE6D',
    bg: 'from-[#E8F5E0] to-white'
  },
  {
    id: 3,
    icon: Leaf,
    title: 'Track Your Impact',
    description: 'See your eco contributions in real-time. Watch your positive environmental impact grow with every refill.',
    color: '#00564A',
    bg: 'from-[#E8F5F2] to-white'
  },
  {
    id: 4,
    icon: QrCode,
    title: 'Quick QR Checkout',
    description: 'Simply generate a QR code, show it to the machine, and watch your bottle fill up automatically.',
    color: '#F9C74F',
    bg: 'from-[#FFF9E6] to-white'
  }
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const constraintsRef = useRef(null);
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (info.offset.x < -threshold && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    dispatch({ type: 'SET_ONBOARDING_COMPLETE' });
    navigate('/login', { replace: true });
  };

  const slide = slides[currentSlide];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-gradient-to-b ${slide.bg} relative overflow-hidden`}
    >
      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleComplete}
        className="absolute top-12 right-6 text-gray-400 font-medium z-10"
      >
        Skip
      </motion.button>

      {/* Content */}
      <div
        ref={constraintsRef}
        className="min-h-screen flex flex-col items-center justify-center px-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center text-center max-w-md"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div
                style={{ backgroundColor: `${slide.color}20` }}
                className="w-36 h-36 rounded-full flex items-center justify-center"
              >
                <slide.icon size={64} style={{ color: slide.color }} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {slide.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination & Button */}
      <div className="absolute bottom-16 left-0 right-0 px-8">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="h-2 rounded-full transition-all duration-300"
              initial={false}
              animate={{
                width: idx === currentSlide ? 24 : 8,
                backgroundColor: idx === currentSlide ? '#00564A' : '#D1D5DB'
              }}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full bg-[#00564A] text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#00564A]/20"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Onboarding;

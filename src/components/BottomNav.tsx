import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Droplet, Receipt, Gift, User } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/refill', icon: Droplet, label: 'Refill' },
  { path: '/transactions', icon: Receipt, label: 'History' },
  { path: '/rewards', icon: Gift, label: 'Rewards' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="max-w-[430px] mx-auto px-4 pb-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg shadow-black/5 px-2 py-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path === '/refill' && location.pathname.startsWith('/refill'));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center py-2 px-4 rounded-2xl transition-colors relative"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`p-2 rounded-xl ${isActive ? 'bg-[#00564A]' : ''}`}
                  >
                    <item.icon
                      size={22}
                      className={isActive ? 'text-white' : 'text-gray-400'}
                    />
                  </motion.div>
                  <span
                    className={`text-xs mt-1 font-medium ${
                      isActive ? 'text-[#00564A]' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNav;

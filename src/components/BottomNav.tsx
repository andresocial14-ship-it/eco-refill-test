import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Droplet, Gift, Receipt, User } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/refill', icon: Droplet, label: 'Refill' },
  { path: '/rewards', icon: Gift, label: 'Rewards' },
  { path: '/transactions', icon: Receipt, label: 'Riwayat' },
  { path: '/profile', icon: User, label: 'Profil' },
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
      <div className="max-w-[430px] mx-auto px-4 pb-5">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg shadow-black/5 px-2 py-2.5">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path === '/refill' && location.pathname.startsWith('/refill'));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors relative"
                >
                  <motion.div
                    animate={{ scale: isActive ? 1.05 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`p-2 rounded-xl ${isActive ? 'bg-[#006035]' : ''}`}
                  >
                    <item.icon
                      size={20}
                      className={isActive ? 'text-white' : 'text-gray-400'}
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] mt-0.5 font-medium ${
                      isActive ? 'text-[#006035]' : 'text-gray-400'
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

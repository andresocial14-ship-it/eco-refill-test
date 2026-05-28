import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';

// Pages
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RefillFlow from './pages/RefillFlow';
import QRTransaction from './pages/QRTransaction';
import Wallet from './pages/Wallet';
import Bottles from './pages/Bottles';
import Transactions from './pages/Transactions';
import Rewards from './pages/Rewards';
import Machines from './pages/Machines';
import EcoImpact from './pages/EcoImpact';
import Profile from './pages/Profile';

function App() {
  const { state } = useApp();
  const location = useLocation();

  // Routes that should show bottom navigation
  const showNavRoutes = ['/home', '/refill', '/wallet', '/bottles', '/transactions', '/rewards', '/machines', '/eco-impact', '/profile'];
  const showNav = showNavRoutes.includes(location.pathname);

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!state.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<Navigate to={state.isAuthenticated ? "/home" : "/splash"} replace />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/refill/*" element={<ProtectedRoute><RefillFlow /></ProtectedRoute>} />
          <Route path="/qr-transaction" element={<ProtectedRoute><QRTransaction /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/bottles" element={<ProtectedRoute><Bottles /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/machines" element={<ProtectedRoute><Machines /></ProtectedRoute>} />
          <Route path="/eco-impact" element={<ProtectedRoute><EcoImpact /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>

      {/* Bottom Navigation */}
      {showNav && <BottomNav />}
    </div>
  );
}

export default App;

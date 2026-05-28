import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Droplet, Phone } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock registration - accepts any input
    const user = {
      id: 'USR' + Date.now(),
      name: name || 'Eco Warrior',
      email: email || 'user@ecorefill.com',
      phone: phone || '+62 812-3456-7890',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    dispatch({ type: 'LOGIN', payload: user });
    setIsLoading(false);
    navigate('/home', { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#DFF5F1] to-white"
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm z-10"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </motion.button>

      <div className="px-8 pt-24 pb-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 bg-[#00564A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00564A]/30">
            <Droplet size={32} className="text-white" />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join the eco revolution today</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleRegister}
          className="space-y-4"
        >
          {/* Name Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={20} />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 focus:border-[#00564A] focus:ring-2 focus:ring-[#00564A]/20 outline-none transition-all shadow-sm text-gray-900"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 focus:border-[#00564A] focus:ring-2 focus:ring-[#00564A]/20 outline-none transition-all shadow-sm text-gray-900"
            />
          </div>

          {/* Phone Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone size={20} />
            </div>
            <input
              type="tel"
              placeholder="Nomor Telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 focus:border-[#00564A] focus:ring-2 focus:ring-[#00564A]/20 outline-none transition-all shadow-sm text-gray-900"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-100 focus:border-[#00564A] focus:ring-2 focus:ring-[#00564A]/20 outline-none transition-all shadow-sm text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center px-4">
            By signing up, you agree to our{' '}
            <span className="text-[#00564A] font-medium">Terms of Service</span>
            {' '}and{' '}
            <span className="text-[#00564A] font-medium">Privacy Policy</span>
          </p>

          {/* Register Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-[#00564A] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-[#00564A]/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 my-6"
        >
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00564A] font-semibold">
              Sign In
            </Link>
          </p>
        </motion.div>

        {/* Demo Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-400 text-sm mt-6"
        >
          Demo: Click Create Account with any input
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Register;

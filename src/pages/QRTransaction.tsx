import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle2, AlertTriangle, Home, RefreshCw } from 'lucide-react';

const QRTransaction = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [status, setStatus] = useState<'pending' | 'success' | 'expired'>('pending');

  const refill = state.activeRefill;

  useEffect(() => {
    if (!refill) {
      navigate('/home');
      return;
    }

    if (countdown <= 0) {
      setStatus('expired');
      return;
    }

    if (status === 'pending') {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown, status, refill, navigate]);

  const handleSimulateScan = () => {
    // Simulate machine scanning the QR
    setStatus('success');
    dispatch({ type: 'COMPLETE_REFILL' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!refill) {
    return null;
  }

  const qrData = JSON.stringify({
    txn: refill.transactionId,
    machine: refill.machineId,
    product: refill.productId,
    vol: refill.volume,
    price: refill.totalPrice,
    ts: new Date().toISOString()
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#00564A] to-[#00796B] flex flex-col items-center justify-center p-6"
    >
      {status === 'pending' && (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold text-white mb-2">Ready to Refill</h1>
            <p className="text-white/80">Show this QR code to the vending machine</p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-6"
          >
            <Clock size={20} className="text-white/80" />
            <span className="text-white font-mono text-xl">{formatTime(countdown)}</span>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="relative mb-6"
          >
            <div className="qr-animate bg-white p-6 rounded-3xl">
              <QRCodeSVG
                value={qrData}
                size={220}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: '',
                  height: 0,
                  width: 0,
                  excavate: false
                }}
              />
            </div>

            {/* Decorative ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-white/20"
              style={{ margin: -30 }}
            />
          </motion.div>

          {/* Transaction Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 w-full max-w-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">Transaction ID</span>
              <span className="text-white font-mono text-sm">{refill.transactionId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">Product</span>
              <span className="text-white">{refill.productName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">Volume</span>
              <span className="text-white">{refill.volume}ml</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">Price</span>
              <span className="text-white font-semibold">{formatCurrency(refill.totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Machine</span>
              <span className="text-white text-sm">{refill.machineName}</span>
            </div>
          </motion.div>

          {/* Simulate Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSimulateScan}
            className="mt-6 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 border border-white/30"
          >
            <RefreshCw size={18} />
            Simulate Machine Scan
          </motion.button>

          {/* Debug Info */}
          <p className="text-white/40 text-xs mt-3 text-center">
            Debug: Click simulate to test the success flow
          </p>
        </>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center"
          >
            <CheckCircle2 size={64} className="text-green-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Refill Successful!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 mb-2"
          >
            Your {refill.productName} is ready
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8"
          >
            <div className="flex justify-center items-center gap-4 text-white">
              <div className="text-center">
                <p className="text-white/60 text-sm">Volume</p>
                <p className="text-xl font-bold">{refill.volume}ml</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-white/60 text-sm">Points Earned</p>
                <p className="text-xl font-bold text-[#90BE6D]">+{Math.floor(refill.totalPrice / 100)}</p>
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/home')}
            className="bg-white text-[#00564A] px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl flex items-center gap-3 mx-auto"
          >
            <Home size={20} />
            Back to Home
          </motion.button>
        </motion.div>
      )}

      {status === 'expired' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-orange-500" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">QR Code Expired</h2>
          <p className="text-white/80 mb-8">The transaction has timed out. Please try again.</p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/refill')}
              className="bg-white text-[#00564A] px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl"
            >
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/home')}
              className="text-white/80 font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QRTransaction;

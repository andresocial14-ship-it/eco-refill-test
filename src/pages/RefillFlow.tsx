import { useState, useMemo } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { machines, products } from '../data/mockData';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Droplet,
  ChevronRight,
  Check,
  AlertCircle,
  Wine
} from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Step 1: Select Machine
const SelectMachine = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (machineId: string) => {
    setSelectedId(machineId);
    setTimeout(() => {
      navigate(`/refill/product/${machineId}`);
    }, 300);
  };

  const availableMachines = machines.filter(m => m.status === 'Available');
  const otherMachines = machines.filter(m => m.status !== 'Available');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-8"
    >
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Select Machine</h1>
            <p className="text-sm text-gray-500">Choose a nearby EcoStation</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Available Machines */}
        <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Available Now
        </h3>
        <div className="space-y-3 mb-6">
          {availableMachines.map((machine) => (
            <motion.button
              key={machine.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(machine.id)}
              className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 text-left transition-all ${
                selectedId === machine.id ? 'border-[#00564A]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00564A] to-[#00796B] flex items-center justify-center text-white font-bold">
                  ES
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{machine.name}</h4>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin size={14} />
                    <span>{machine.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-[#00564A] font-medium">{machine.distance}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">{machine.products.length} products</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Other Machines */}
        {otherMachines.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Other Locations</h3>
            <div className="space-y-3">
              {otherMachines.map((machine) => (
                <div
                  key={machine.id}
                  className="bg-gray-50 rounded-2xl p-4 opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                      ES
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{machine.name}</h4>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={14} />
                        <span>{machine.location}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      machine.status === 'Busy' ? 'bg-yellow-100 text-yellow-700' :
                      machine.status === 'Offline' ? 'bg-red-100 text-red-600' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {machine.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Step 2: Select Product
const SelectProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const machineId = location.pathname.split('/').pop() || '';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const machine = machines.find(m => m.id === machineId);
  const availableProducts = products.filter(p =>
    machine?.products.includes(p.id)
  );

  const handleSelect = (productId: string) => {
    setSelectedId(productId);
    setTimeout(() => {
      navigate(`/refill/volume/${machineId}/${productId}`);
    }, 300);
  };

  if (!machine) {
    return <div className="p-6">Machine not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-8"
    >
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/refill')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Select Product</h1>
            <p className="text-sm text-gray-500">{machine.name}</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="space-y-3">
          {availableProducts.map((product, idx) => (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(product.id)}
              className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 text-left transition-all ${
                selectedId === product.id ? 'border-[#00564A]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  style={{ backgroundColor: `${product.color}20` }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                >
                  {product.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#00564A]">
                    {formatCurrency(product.pricePerMl * 100)}
                  </p>
                  <p className="text-xs text-gray-400">per 100ml</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Step 3: Select Volume
const SelectVolume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [volume, setVolume] = useState(300);
  const { state } = useApp();

  const pathParts = location.pathname.split('/');
  const machineId = pathParts[4] || '';
  const productId = pathParts[5] || '';

  const machine = machines.find(m => m.id === machineId);
  const product = products.find(p => p.id === productId);

  const totalPrice = useMemo(() => {
    return product ? product.pricePerMl * volume : 0;
  }, [product, volume]);

  const handleContinue = () => {
    navigate('/refill/confirm', {
      state: {
        machineId,
        machineName: machine?.name,
        productId,
        productName: product?.name,
        volume,
        totalPrice
      }
    });
  };

  if (!machine || !product) {
    return <div className="p-6">Product not found</div>;
  }

  const volumeOptions = [100, 200, 300, 400, 500, 750, 1000];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-8"
    >
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Select Volume</h1>
            <p className="text-sm text-gray-500">{product.name}</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Product Card */}
        <div className="bg-gradient-to-br from-[#DFF5F1] to-white rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              style={{ backgroundColor: `${product.color}20` }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            >
              {product.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{machine.name}</p>
            </div>
          </div>

          {/* Volume Display */}
          <div className="bg-white/80 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500">Volume</span>
              <span className="text-2xl font-bold text-[#00564A]">{volume}ml</span>
            </div>

            {/* Visual Bottle */}
            <div className="relative h-32 bg-gray-100 rounded-xl overflow-hidden">
              <motion.div
                initial={false}
                animate={{ height: `${Math.min((volume / 1000) * 100, 100)}%` }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00564A] to-[#00796B]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Wine size={40} className="text-gray-400 opacity-30" />
              </div>
            </div>
          </div>

          {/* Volume Options */}
          <div className="flex flex-wrap gap-2">
            {volumeOptions.map((v) => (
              <button
                key={v}
                onClick={() => setVolume(v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  volume === v
                    ? 'bg-[#00564A] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {v}ml
              </button>
            ))}
          </div>
        </div>

        {/* Custom Slider */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 mb-3 block">
            Or adjust volume
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#00564A]"
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-xs text-gray-400">{formatCurrency(product.pricePerMl)}/ml</p>
            </div>
            <p className="text-2xl font-bold text-[#00564A]">{formatCurrency(totalPrice)}</p>
          </div>

          {state.walletBalance < totalPrice && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-50 rounded-xl">
              <AlertCircle size={16} className="text-yellow-600" />
              <p className="text-sm text-yellow-700">Insufficient balance. Please top up your wallet.</p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full bg-[#00564A] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-[#00564A]/20"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

// Step 4: Confirm Order
const ConfirmOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    machineId,
    machineName,
    productId,
    productName,
    volume,
    totalPrice
  } = (location.state as {
    machineId: string;
    machineName: string;
    productId: string;
    productName: string;
    volume: number;
    totalPrice: number;
  }) || {};

  const handlePayment = async () => {
    if (!state.walletBalance || state.walletBalance < totalPrice) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Deduct from wallet
    dispatch({ type: 'DEDUCT_WALLET', payload: totalPrice });

    // Create active refill transaction
    const transactionId = `TXN${Date.now()}`;
    dispatch({
      type: 'SET_ACTIVE_REFILL',
      payload: {
        transactionId,
        machineId,
        machineName,
        productId,
        productName,
        volume,
        totalPrice,
        createdAt: new Date()
      }
    });

    setIsProcessing(false);
    navigate('/qr-transaction');
  };

  if (!machineName || !productName) {
    return <div className="p-6">Order information missing</div>;
  }

  const product = products.find(p => p.id === productId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-8"
    >
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Confirm Order</h1>
            <p className="text-sm text-gray-500">Review your refill details</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div
              style={{ backgroundColor: `${product?.color}20` }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            >
              {product?.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{productName}</h3>
              <p className="text-sm text-gray-500">{volume}ml</p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Machine</span>
              <span className="font-medium text-gray-900">{machineName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Volume</span>
              <span className="font-medium text-gray-900">{volume}ml</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Machine ID</span>
              <span className="font-mono text-sm text-gray-600">{machineId}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Eco Reward Points</span>
              <span className="text-green-600">+{Math.floor(totalPrice / 100)} pts</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-xl text-[#00564A]">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-[#00564A] to-[#00796B] rounded-3xl p-5 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pay with Wallet</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(state.walletBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Droplet size={24} />
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={isProcessing || state.walletBalance < totalPrice}
          className="w-full bg-[#00564A] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-[#00564A]/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : state.walletBalance < totalPrice ? (
            'Insufficient Balance'
          ) : (
            <>
              <Check size={20} />
              Pay {formatCurrency(totalPrice)}
            </>
          )}
        </motion.button>

        {state.walletBalance < totalPrice && (
          <button
            onClick={() => navigate('/wallet')}
            className="w-full mt-3 text-[#00564A] font-medium text-center"
          >
            Top up my wallet
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Main Refill Flow Router
const RefillFlow = () => {
  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        <Routes>
          <Route index element={<SelectMachine />} />
          <Route path="product/:machineId" element={<SelectProduct />} />
          <Route path="volume/:prefix/:machineId/:productId" element={<SelectVolume />} />
          <Route path="confirm" element={<ConfirmOrder />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default RefillFlow;

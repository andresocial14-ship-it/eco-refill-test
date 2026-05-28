import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  STATIC_MACHINES,
  getProductByCategory,
  getProductById,
  getMachineById,
  PAYMENT_METHODS,
  VOLUME_CONFIG,
  formatPrice,
  calculateTotalPrice,
  generateTransactionId,
  StaticMachine,
  StaticProduct
} from '../data/staticRefillData';
import {
  ArrowLeft,
  MapPin,
  Droplet,
  ChevronRight,
  Check,
  AlertCircle,
  CreditCard,
  Smartphone,
  Wifi
} from 'lucide-react';

// ============================================
// REFILL ORDER STATE - Tracks entire flow
// ============================================
interface RefillOrder {
  step: number;
  selectedMachine: StaticMachine | null;
  selectedCategory: string | null;
  selectedProduct: StaticProduct | null;
  selectedVolume: number;
  selectedPaymentMethod: string | null;
  totalPrice: number;
  transactionId: string | null;
}

// Initialize with safe defaults - NEVER undefined
const INITIAL_ORDER: RefillOrder = {
  step: 1,
  selectedMachine: null,
  selectedCategory: null,
  selectedProduct: null,
  selectedVolume: VOLUME_CONFIG.DEFAULT, // Always has value
  selectedPaymentMethod: null,
  totalPrice: 0,
  transactionId: null
};

// ============================================
// STEP 1: MACHINE SELECTION
// ============================================
const SelectMachine = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (machine: StaticMachine) => {
    setSelectedId(machine.id);
    // Smooth transition delay
    setTimeout(() => {
      navigate('/refill/category', { state: { machineId: machine.id } });
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#DFF5F1] to-white pb-24"
    >
      {/* Header */}
      <div className="bg-[#00564A] pt-12 pb-6 px-6 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-4"
        >
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Select Machine</h1>
            <p className="text-white/70 text-sm">Step 1 of 4</p>
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                step === 1 ? 'bg-[#00564A]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Machine List */}
      <div className="px-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Available Machines</h2>
        <div className="space-y-4">
          {STATIC_MACHINES.map((machine, idx) => (
            <motion.button
              key={machine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(machine)}
              className={`w-full bg-white rounded-2xl p-5 shadow-md border-2 text-left transition-all ${
                selectedId === machine.id ? 'border-[#00564A]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Machine Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00564A] to-[#00796B] flex items-center justify-center text-white">
                  <Droplet size={24} />
                </div>

                {/* Machine Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{machine.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                    <MapPin size={14} />
                    <span>{machine.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                      {machine.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      Categories: {machine.availableCategories.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight size={24} className="text-gray-300" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// STEP 2: CATEGORY SELECTION
// ============================================
const SelectCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get machineId from navigation state with fallback
  const machineId = (location.state as { machineId?: string })?.machineId || STATIC_MACHINES[0].id;
  const machine = getMachineById(machineId);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setTimeout(() => {
      navigate('/refill/product', {
        state: { machineId: machine.id, category: category }
      });
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#DFF5F1] to-white pb-24"
    >
      {/* Header */}
      <div className="bg-[#00564A] pt-12 pb-6 px-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/refill')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Select Category</h1>
            <p className="text-white/70 text-sm">Step 2 of 4</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                step <= 2 ? 'bg-[#00564A]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Machine Badge */}
      <div className="px-6 mb-4">
        <div className="bg-[#DFF5F1] rounded-xl p-3 flex items-center gap-3">
          <Droplet size={18} className="text-[#00564A]" />
          <span className="text-sm text-gray-700 font-medium">{machine.name}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Available Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {machine.availableCategories.map((category, idx) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectCategory(category)}
              className={`p-5 rounded-2xl text-center transition-all ${
                selectedCategory === category
                  ? 'bg-[#00564A] text-white shadow-lg'
                  : 'bg-white shadow-md border border-gray-100'
              }`}
            >
              <div className="text-3xl mb-2">
                {category === 'Shampoo' ? '🧴' : category === 'Soap' ? '🧼' : category === 'Detergent' ? '🫧' : '💆'}
              </div>
              <p className="font-semibold">{category}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// STEP 3: PRODUCT SELECTION
// ============================================
const SelectProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Get state with fallbacks - NEVER undefined
  const state = location.state as {
    machineId?: string;
    category?: string;
  } | null;

  const machineId = state?.machineId || STATIC_MACHINES[0].id;
  const category = state?.category || 'Shampoo';

  const machine = getMachineById(machineId);
  const products = getProductByCategory(category);

  const handleSelectProduct = (product: StaticProduct) => {
    setSelectedProductId(product.id);
    setTimeout(() => {
      navigate('/refill/volume', {
        state: {
          machineId: machine.id,
          productId: product.id
        }
      });
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#DFF5F1] to-white pb-24"
    >
      {/* Header */}
      <div className="bg-[#00564A] pt-12 pb-6 px-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/refill/category', { state: { machineId: machine.id } })}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{category} Products</h1>
            <p className="text-white/70 text-sm">Step 2 of 4</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                step <= 2 ? 'bg-[#00564A]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Machine Badge */}
      <div className="px-6 mb-4">
        <div className="bg-[#DFF5F1] rounded-xl p-3 flex items-center gap-3">
          <Droplet size={18} className="text-[#00564A]" />
          <span className="text-sm text-gray-700 font-medium">{machine.name}</span>
        </div>
      </div>

      {/* Products List - ALWAYS has data due to fallback */}
      <div className="px-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Select Product</h2>
        <div className="space-y-3">
          {products.map((product, idx) => (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectProduct(product)}
              className={`w-full bg-white rounded-2xl p-5 shadow-md border-2 text-left transition-all ${
                selectedProductId === product.id ? 'border-[#00564A]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Product Icon */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${product.color}20` }}
                >
                  {product.icon}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00564A] font-bold">{formatPrice(product.pricePerMl)}/ml</span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight size={24} className="text-gray-300" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// STEP 4: VOLUME SELECTION WITH SLIDER
// ============================================
const SelectVolume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [volume, setVolume] = useState(VOLUME_CONFIG.DEFAULT); // Always initialized

  // Get state with fallbacks
  const state = location.state as {
    machineId?: string;
    productId?: string;
  } | null;

  const machineId = state?.machineId || STATIC_MACHINES[0].id;
  const productId = state?.productId || getProductByCategory('Shampoo')[0].id;

  const machine = getMachineById(machineId);
  const product = getProductById(productId);

  // SAFETY CHECK: If product is somehow null, show fallback
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-4">The selected product is not available.</p>
          <button
            onClick={() => navigate('/refill')}
            className="bg-[#00564A] text-white px-6 py-3 rounded-xl font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate price in real-time
  const totalPrice = useMemo(() => {
    return calculateTotalPrice(volume, product.pricePerMl);
  }, [volume, product.pricePerMl]);

  const handleContinueToPayment = () => {
    navigate('/refill/payment', {
      state: {
        machineId: machine.id,
        productId: product.id,
        volume: volume,
        totalPrice: totalPrice
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#DFF5F1] to-white pb-24"
    >
      {/* Header */}
      <div className="bg-[#00564A] pt-12 pb-6 px-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/refill/product', { state: { machineId: machine.id } })}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Select Volume</h1>
            <p className="text-white/70 text-sm">Step 3 of 4</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                step <= 3 ? 'bg-[#00564A]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Product Summary */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${product.color}20` }}
            >
              {product.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{machine.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Slider Section */}
      <div className="px-6">
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Adjust Volume</h3>

          {/* Volume Display */}
          <div className="text-center mb-6">
            <motion.p
              key={volume}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold text-[#00564A]"
            >
              {volume}<span className="text-2xl text-gray-400 ml-1">ml</span>
            </motion.p>
          </div>

          {/* Visual Bottle Fill */}
          <div className="relative h-36 bg-gray-100 rounded-2xl overflow-hidden mb-6">
            <motion.div
              initial={false}
              animate={{ height: `${(volume / VOLUME_CONFIG.MAX) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00564A] to-[#00796B]"
            />
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min={VOLUME_CONFIG.MIN}
              max={VOLUME_CONFIG.MAX}
              step={VOLUME_CONFIG.STEP}
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-200"
              style={{
                background: `linear-gradient(to right, #00564A 0%, #00564A ${((volume - VOLUME_CONFIG.MIN) / (VOLUME_CONFIG.MAX - VOLUME_CONFIG.MIN)) * 100}%, #E5E7EB ${((volume - VOLUME_CONFIG.MIN) / (VOLUME_CONFIG.MAX - VOLUME_CONFIG.MIN)) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{VOLUME_CONFIG.MIN}ml</span>
              <span>{VOLUME_CONFIG.MAX}ml</span>
            </div>
          </div>
        </div>

        {/* Price Calculation */}
        <div className="bg-[#DFF5F1] rounded-2xl p-5 mb-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price per ml</span>
              <span className="font-medium">{formatPrice(product.pricePerMl)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Volume</span>
              <span className="font-medium">{volume} ml</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total Price</span>
              <motion.span
                key={totalPrice}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-[#00564A]"
              >
                {formatPrice(totalPrice)}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinueToPayment}
          className="w-full bg-[#00564A] text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
        >
          Continue to Payment
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// STEP 5: PAYMENT SELECTION
// ============================================
const SelectPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get state with fallbacks
  const state = location.state as {
    machineId?: string;
    productId?: string;
    volume?: number;
    totalPrice?: number;
  } | null;

  const machineId = state?.machineId || STATIC_MACHINES[0].id;
  const productId = state?.productId || getProductByCategory('Shampoo')[0].id;
  const volume = state?.volume || VOLUME_CONFIG.DEFAULT;
  const totalPrice = state?.totalPrice || 0;

  const machine = getMachineById(machineId);
  const product = getProductById(productId);

  // SAFETY CHECK
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-500 mb-4">Unable to process payment.</p>
          <button
            onClick={() => navigate('/refill')}
            className="bg-[#00564A] text-white px-6 py-3 rounded-xl font-medium"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const transactionId = generateTransactionId();

    setIsProcessing(false);
    navigate('/refill/qr', {
      state: {
        machineId: machine.id,
        productId: product.id,
        volume,
        totalPrice,
        transactionId,
        paymentMethod: selectedPayment
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#DFF5F1] to-white pb-24"
    >
      {/* Header */}
      <div className="bg-[#00564A] pt-12 pb-6 px-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/refill/volume', {
              state: { machineId: machine.id, productId: product.id }
            })}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Select Payment</h1>
            <p className="text-white/70 text-sm">Step 4 of 4</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full bg-[#00564A]`}
            />
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-4 mb-3 pb-3 border-b">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${product.color}20` }}
            >
              {product.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{volume}ml - {machine.name}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-[#00564A]">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Payment Method</h2>
        <div className="space-y-3 mb-6">
          {PAYMENT_METHODS.map((method, idx) => (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPayment(method.id)}
              className={`w-full bg-white rounded-2xl p-4 shadow-md border-2 text-left transition-all ${
                selectedPayment === method.id ? 'border-[#00564A]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#DFF5F1] flex items-center justify-center text-2xl">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                {selectedPayment === method.id && (
                  <div className="w-6 h-6 rounded-full bg-[#00564A] flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Pay Button */}
        <motion.button
          whileHover={{ scale: selectedPayment ? 1.02 : 1 }}
          whileTap={{ scale: selectedPayment ? 0.98 : 1 }}
          onClick={handlePayment}
          disabled={!selectedPayment || isProcessing}
          className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg ${
            selectedPayment
              ? 'bg-[#00564A] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Pay {formatPrice(totalPrice)}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// STEP 6: QR CODE DISPLAY
// ============================================
const ShowQR = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get state with fallbacks
  const state = location.state as {
    machineId?: string;
    productId?: string;
    volume?: number;
    totalPrice?: number;
    transactionId?: string;
    paymentMethod?: string;
  } | null;

  const machineId = state?.machineId || STATIC_MACHINES[0].id;
  const productId = state?.productId || getProductByCategory('Shampoo')[0].id;
  const volume = state?.volume || VOLUME_CONFIG.DEFAULT;
  const totalPrice = state?.totalPrice || 0;
  const transactionId = state?.transactionId || generateTransactionId();
  const paymentMethod = state?.paymentMethod || 'QRIS';

  const machine = getMachineById(machineId);
  const product = getProductById(productId);

  // SAFETY CHECK
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Transaction Error</h2>
          <button
            onClick={() => navigate('/home')}
            className="bg-[#00564A] text-white px-6 py-3 rounded-xl font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#00564A] to-[#00796B] flex flex-col"
    >
      {/* Header */}
      <div className="pt-12 px-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Wifi size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Payment Success</h1>
          </div>
        </div>
      </div>

      {/* QR Card */}
      <div className="flex-1 px-6 mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
          className="bg-white rounded-3xl p-6 shadow-2xl"
        >
          {/* QR Code Placeholder */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-8 mb-6 flex items-center justify-center">
            <div className="w-48 h-48 bg-white rounded-xl shadow-inner flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded mx-auto mb-3 flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-1">
                    {[...Array(25)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-800 rounded-sm" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">Scan QR at Machine</p>
              </div>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="text-center mb-4 pb-4 border-b">
            <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
            <p className="font-mono font-bold text-gray-900 text-sm">{transactionId}</p>
          </div>

          {/* Order Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Machine</span>
              <span className="font-medium text-gray-900">{machine.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Product</span>
              <span className="font-medium text-gray-900">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Volume</span>
              <span className="font-medium text-gray-900">{volume} ml</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium text-gray-900">{paymentMethod}</span>
            </div>
            <div className="pt-3 border-t flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-xl text-[#00564A]">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Done Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/home')}
            className="w-full bg-[#00564A] text-white py-4 rounded-xl font-semibold text-lg"
          >
            Done
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN ROUTER COMPONENT
// ============================================
const RefillFlow = () => {
  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        <Routes>
          <Route index element={<SelectMachine />} />
          <Route path="category" element={<SelectCategory />} />
          <Route path="product" element={<SelectProduct />} />
          <Route path="volume" element={<SelectVolume />} />
          <Route path="payment" element={<SelectPayment />} />
          <Route path="qr" element={<ShowQR />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default RefillFlow;

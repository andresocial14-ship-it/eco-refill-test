import { useState, useMemo } from 'react';
import { useNavigate, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { machines, products } from '../data/mockData';
import { formatRupiah } from '../utils/formatters';
import {
  ArrowLeft,
  MapPin,
  Droplet,
  ChevronRight,
  Check,
  AlertCircle,
  Wine,
  Smartphone,
  CreditCard,
  Building2,
  Wallet as WalletIcon
} from 'lucide-react';

const paymentMethods = [
  { id: 'wallet', name: 'Dompet Saya', icon: WalletIcon, color: '#006035' },
  { id: 'gopay', name: 'GoPay', icon: Smartphone, color: '#00AA13' },
  { id: 'ovo', name: 'OVO', icon: CreditCard, color: '#4C3494' },
  { id: 'dana', name: 'DANA', icon: WalletIcon, color: '#118EEA' },
  { id: 'bank', name: 'Transfer Bank', icon: Building2, color: '#006035' },
];

// Step 0: Container Option Screen
const ContainerOption = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleSelect = (type: 'own' | 'deposit') => {
    dispatch({ type: 'SET_CONTAINER', payload: type });
    navigate('/refill/machine');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-8"
    >
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pilih Wadah</h1>
            <p className="text-sm text-gray-500">Bagaimana Anda akan mengisi ulang?</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('own')}
          className="w-full bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-[#006035] transition-all text-left"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#E8F5EF] flex items-center justify-center text-3xl">
              🍶
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">Bawa Botol Sendiri</h3>
              <p className="text-sm text-gray-500">Gunakan botol Anda yang sudah ada untuk refill</p>
            </div>
            <ChevronRight size={24} className="text-gray-400 mt-4" />
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('deposit')}
          className="w-full bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-[#006035] transition-all text-left"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#FFF9E6] flex items-center justify-center text-3xl">
              🎁
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">Deposit Botol</h3>
              <p className="text-sm text-gray-500">Sewa botol baru dengan sistem deposit</p>
              <p className="text-xs text-[#006035] mt-2 font-medium">Deposit mulai dari Rp15.000</p>
            </div>
            <ChevronRight size={24} className="text-gray-400 mt-4" />
          </div>
        </motion.button>
      </div>

      <div className="px-6 mt-8">
        <div className="bg-[#E8F5EF] rounded-xl p-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-[#006035]">💡 Tips:</span> Bawa botol sendiri lebih hemat dan ramah lingkungan!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Step 1: Select Machine
const SelectMachine = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(state.selectedMachine);

  const handleSelect = (machineId: string) => {
    setSelectedId(machineId);
    dispatch({ type: 'SET_SELECTED_MACHINE', payload: machineId });
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
            onClick={() => navigate('/refill')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pilih Mesin</h1>
            <p className="text-sm text-gray-500">{machines.length} EcoStation tersedia</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Available Machines */}
        <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Tersedia Sekarang ({availableMachines.length})
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
                selectedId === machine.id ? 'border-[#006035]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006035] to-[#008045] flex items-center justify-center text-white font-bold">
                  ES
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{machine.name}</h4>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin size={14} />
                    <span>{machine.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-[#006035] font-medium">{machine.distance}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">{machine.products.length} produk</span>
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
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Lokasi Lainnya</h3>
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
                      {machine.status === 'Busy' ? 'Sibuk' :
                       machine.status === 'Offline' ? 'Offline' :
                       'Perbaikan'}
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
  const availableProducts = products.filter(p => machine?.products.includes(p.id));

  const handleSelect = (productId: string) => {
    setSelectedId(productId);
    setTimeout(() => {
      navigate(`/refill/brand/${machineId}/${productId}`);
    }, 300);
  };

  if (!machine) {
    return <div className="p-6">Mesin tidak ditemukan</div>;
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
            onClick={() => navigate('/refill/machine')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pilih Produk</h1>
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
                selectedId === product.id ? 'border-[#006035]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  style={{ backgroundColor: `${product.color}20` }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                >
                  {product.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-xs text-gray-400">{product.nameId}</p>
                  <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#006035]">
                    {formatRupiah(product.pricePerMl * 100)}
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

// Step 2.5: Select Brand
const SelectBrand = () => {
  const navigate = useNavigate();
  const { machineId, productId } = useParams<{ machineId: string, productId: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const machine = machines.find(m => m.id === machineId);
  const product = products.find(p => p.id === productId);

  const handleSelect = (brandId: string) => {
    setSelectedId(brandId);
    setTimeout(() => {
      navigate(`/refill/volume/${machineId}/${productId}/${brandId}`);
    }, 300);
  };

  if (!machine || !product) {
    return <div className="p-6">Produk tidak ditemukan</div>;
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
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pilih Merek</h1>
            <p className="text-sm text-gray-500">{product.name}</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="space-y-3">
          {product.brands?.map((brand, idx) => (
            <motion.button
              key={brand.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(brand.id)}
              className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 text-left transition-all ${
                selectedId === brand.id ? 'border-[#006035]' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#006035]">
                    {formatRupiah(brand.pricePerMl * 100)}
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
  const { machineId, productId, brandId } = useParams<{ machineId: string, productId: string, brandId: string }>();
  const [volume, setVolume] = useState(300);
  const { state } = useApp();

  const machine = machines.find(m => m.id === machineId);
  const product = products.find(p => p.id === productId);
  const brand = product?.brands?.find(b => b.id === brandId);

  const activePricePerMl = brand ? brand.pricePerMl : (product?.pricePerMl || 0);
  const activeProductName = brand ? `${product?.name} - ${brand.name}` : product?.name;

  const totalPrice = useMemo(() => {
    return activePricePerMl * volume;
  }, [activePricePerMl, volume]);

  const handleContinue = () => {
    navigate('/refill/confirm', {
      state: {
        machineId,
        machineName: machine?.name,
        productId,
        productName: activeProductName,
        volume,
        totalPrice
      }
    });
  };

  if (!machine || !product) {
    return <div className="p-6">Produk tidak ditemukan</div>;
  }

  const volumeOptions = [100, 200, 300, 400, 500, 750, 1000];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-28"
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
            <h1 className="text-xl font-bold text-gray-900">Pilih Volume</h1>
            <p className="text-sm text-gray-500">{activeProductName}</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Product Card */}
        <div className="bg-gradient-to-br from-[#E8F5EF] to-white rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              style={{ backgroundColor: `${product.color}20` }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            >
              {product.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{activeProductName}</h3>
              <p className="text-sm text-gray-500">{machine.name}</p>
            </div>
          </div>

          {/* Volume Display */}
          <div className="bg-white/80 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500">Volume</span>
              <span className="text-2xl font-bold text-[#006035]">{volume}ml</span>
            </div>

            {/* Visual Bottle */}
            <div className="relative h-32 bg-gray-100 rounded-xl overflow-hidden">
              <motion.div
                initial={false}
                animate={{ height: `${Math.min((volume / 1000) * 100, 100)}%` }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#006035] to-[#008045]"
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
                    ? 'bg-[#006035] text-white'
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
            Atau sesuaikan volume
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value) || 100)}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#006035]"
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Harga</p>
              <p className="text-xs text-gray-400">{formatRupiah(activePricePerMl * 100)}/100ml</p>
            </div>
            <p className="text-2xl font-bold text-[#006035]">{formatRupiah(totalPrice)}</p>
          </div>

          {state.walletBalance < totalPrice && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-50 rounded-xl">
              <AlertCircle size={16} className="text-yellow-600" />
              <p className="text-sm text-yellow-700">Saldo tidak mencukupi. Silakan top up dompet Anda.</p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full bg-[#006035] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-[#006035]/20"
        >
          Lanjutkan
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
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

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
    if (!selectedPayment) return;
    if (selectedPayment === 'wallet' && (!state.walletBalance || state.walletBalance < totalPrice)) {
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (selectedPayment === 'wallet') {
      dispatch({ type: 'DEDUCT_WALLET', payload: totalPrice });
    }

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
    return <div className="p-6">Informasi pesanan tidak lengkap</div>;
  }

  const product = products.find(p => p.id === productId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-28"
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
            <h1 className="text-xl font-bold text-gray-900">Konfirmasi Pesanan</h1>
            <p className="text-sm text-gray-500">Periksa detail refill Anda</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div
              style={{ backgroundColor: `${product?.color}20` }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
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
              <span className="text-gray-500">Mesin</span>
              <span className="font-medium text-gray-900">{machineName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Volume</span>
              <span className="font-medium text-gray-900">{volume}ml</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ID Mesin</span>
              <span className="font-mono text-sm text-gray-600">{machineId}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Detail Pembayaran</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">{formatRupiah(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Poin Eco Reward</span>
              <span className="text-green-600">+{Math.floor(totalPrice / 100)} pts</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-xl text-[#006035]">{formatRupiah(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Metode Pembayaran</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const isWallet = method.id === 'wallet';
              const disabled = isWallet && state.walletBalance < totalPrice;

              return (
                <motion.button
                  key={method.id}
                  whileHover={!disabled ? { scale: 1.01 } : {}}
                  whileTap={!disabled ? { scale: 0.99 } : {}}
                  onClick={() => !disabled && setSelectedPayment(method.id)}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                    selectedPayment === method.id
                      ? 'border-[#006035] bg-[#E8F5EF]'
                      : disabled ? 'border-gray-100 opacity-50' : 'border-gray-100'
                  }`}
                >
                  <div
                    style={{ backgroundColor: `${method.color}20` }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                  >
                    <method.icon size={24} style={{ color: method.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    {isWallet && (
                      <p className={`text-xs ${disabled ? 'text-red-500' : 'text-gray-500'}`}>
                        Saldo: {formatRupiah(state.walletBalance)}
                      </p>
                    )}
                  </div>
                  {selectedPayment === method.id && (
                    <div className="w-6 h-6 rounded-full bg-[#006035] flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Pay Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={isProcessing || !selectedPayment || (selectedPayment === 'wallet' && state.walletBalance < totalPrice)}
          className="w-full bg-[#006035] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-[#006035]/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Memproses...
            </>
          ) : !selectedPayment ? (
            'Pilih Pembayaran'
          ) : selectedPayment === 'wallet' && state.walletBalance < totalPrice ? (
            'Saldo Tidak Cukup'
          ) : (
            <>
              <Check size={20} />
              Bayar {formatRupiah(totalPrice)}
            </>
          )}
        </motion.button>

        {selectedPayment === 'wallet' && state.walletBalance < totalPrice && (
          <button
            onClick={() => navigate('/wallet')}
            className="w-full mt-3 text-[#006035] font-medium text-center"
          >
            Top up dompet saya
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
          <Route index element={<ContainerOption />} />
          <Route path="machine" element={<SelectMachine />} />
          <Route path="product/:machineId" element={<SelectProduct />} />
          <Route path="brand/:machineId/:productId" element={<SelectBrand />} />
          <Route path="volume/:machineId/:productId/:brandId" element={<SelectVolume />} />
          <Route path="confirm" element={<ConfirmOrder />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default RefillFlow;

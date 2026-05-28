import { useState } from 'react';
import { useRouterNavigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { machines } from '../data/mockData';
import {
  MapPin,
  ArrowLeft,
  X,
  Navigation
} from 'lucide-react';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Available':
      return { text: 'Tersedia', color: 'bg-green-100 text-green-700 border-green-200' };
    case 'Busy':
      return { text: 'Sibuk', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    case 'Offline':
      return { text: 'Offline', color: 'bg-red-100 text-red-700 border-red-200' };
    case 'Maintenance':
      return { text: 'Perbaikan', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    default:
      return { text: status, color: 'bg-gray-100 text-gray-700' };
  }
};

const Machines = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMachine, setSelectedMachine] = useState<typeof machines[0] | null>(null);

  const handleRefillNow = (machineId: string) => {
    dispatch({ type: 'SET_SELECTED_MACHINE', payload: machineId });
    navigate('/refill/machine');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-nav"
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Lokasi Mesin</h1>
            <p className="text-gray-500 text-sm">{machines.length} EcoStation tersedia</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'list' ? 'bg-[#006035] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'map' ? 'bg-[#006035] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-medium text-sm">
                {machines.filter(m => m.status === 'Available').length} Tersedia
              </span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-yellow-700 font-medium text-sm">
                {machines.filter(m => m.status === 'Busy').length} Sibuk
              </span>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <div className="px-6 py-4">
          {/* Available Machines */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Tersedia Sekarang
            </h3>
            <div className="space-y-3">
              {machines
                .filter(m => m.status === 'Available')
                .map((machine, idx) => (
                  <motion.div
                    key={machine.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#006035] to-[#008045] flex items-center justify-center text-white font-bold text-sm">
                        ES
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{machine.name}</h4>
                          <span className="text-[#006035] font-semibold text-sm">{machine.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                          <MapPin size={14} />
                          <span>{machine.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">
                              {getStatusBadge(machine.status).text}
                            </span>
                            <span className="text-xs text-gray-400">{machine.products.length} produk</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRefillNow(machine.id)}
                        className="flex-1 bg-[#006035] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">💧</span>
                        Refill Sekarang
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <Navigation size={16} />
                        Arah
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Other Machines */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Lokasi Lainnya</h3>
            <div className="space-y-3">
              {machines
                .filter(m => m.status !== 'Available')
                .map((machine, idx) => (
                  <motion.div
                    key={machine.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm opacity-70"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                        ES
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{machine.name}</h4>
                          <span className="text-gray-400 text-sm">{machine.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
                          <MapPin size={14} />
                          <span>{machine.location}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(machine.status).color}`}>
                          {getStatusBadge(machine.status).text}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* Map View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-4"
        >
          <div className="bg-gradient-to-br from-[#E8F5EF] to-[#F0FAF5] rounded-2xl h-80 flex items-center justify-center relative overflow-hidden shadow-inner">
            {/* Map grid pattern */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(10)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 h-px bg-[#006035]/20"
                  style={{ top: `${(i + 1) * 10}%` }}
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 w-px bg-[#006035]/20"
                  style={{ left: `${(i + 1) * 10}%` }}
                />
              ))}
            </div>

            {/* Machine markers */}
            {machines.map((machine, idx) => {
              const positions = [
                { top: '25%', left: '30%' },
                { top: '40%', left: '55%' },
                { top: '55%', left: '40%' },
                { top: '20%', left: '70%' },
                { top: '65%', left: '60%' },
                { top: '50%', left: '25%' },
              ];
              const pos = positions[idx % positions.length];
              const isAvailable = machine.status === 'Available';

              return (
                <motion.button
                  key={machine.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedMachine(machine)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={pos}
                >
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        isAvailable ? 'bg-[#006035] text-white' : 'bg-gray-400 text-white'
                      }`}
                    >
                      💧
                    </div>
                    {isAvailable && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-[#006035]/50"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Info Window Popup */}
          <AnimatePresence>
            {selectedMachine && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-x-4 bottom-32 bg-white rounded-2xl p-4 shadow-xl z-40"
                style={{ maxWidth: '400px', left: '50%', transform: 'translateX(-50%)' }}
              >
                <button
                  onClick={() => setSelectedMachine(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={16} className="text-gray-500" />
                </button>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006035] to-[#008045] flex items-center justify-center text-white font-bold">
                    ES
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{selectedMachine.name}</h4>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin size={14} />
                      <span>{selectedMachine.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Jarak</p>
                    <p className="font-semibold text-gray-900">{selectedMachine.distance}</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(selectedMachine.status).color}`}>
                        {getStatusBadge(selectedMachine.status).text}
                      </span>
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Produk</p>
                    <p className="font-semibold text-gray-900">{selectedMachine.products.length}</p>
                  </div>
                </div>

                {selectedMachine.status === 'Available' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRefillNow(selectedMachine.id)}
                    className="w-full bg-[#006035] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    💧 Refill Sekarang
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="flex gap-4 justify-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#006035]" />
              <span className="text-xs text-gray-600">Tersedia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-600">Sibuk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-xs text-gray-600">Offline</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Machines;

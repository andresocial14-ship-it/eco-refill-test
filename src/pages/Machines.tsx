import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { machines } from '../data/mockData';
import {
  MapPin,
  Clock,
  Droplet,
  Navigation,
  List,
  Map,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Wrench
} from 'lucide-react';

const Machines = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available': return <CheckCircle size={16} className="text-green-500" />;
      case 'Busy': return <Clock size={16} className="text-yellow-500" />;
      case 'Offline': return <XCircle size={16} className="text-red-500" />;
      case 'Maintenance': return <Wrench size={16} className="text-gray-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'Busy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Offline': return 'bg-red-100 text-red-700 border-red-200';
      case 'Maintenance': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const availableCount = machines.filter(m => m.status === 'Available').length;

  const handleSelectMachine = (machineId: string) => {
    navigate(`/refill/product/${machineId}`);
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Machine Locator</h1>
            <p className="text-gray-500 text-sm">{machines.length} EcoStations near you</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'list' ? 'bg-[#00564A] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'map' ? 'bg-[#00564A] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Map size={20} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-green-700 font-medium">{availableCount} Available</span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-yellow-600" />
              <span className="text-yellow-700 font-medium">
                {machines.filter(m => m.status === 'Busy').length} Busy
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
              Available Now ({availableCount})
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
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00564A] to-[#00796B] flex items-center justify-center text-white font-bold text-sm">
                        ES
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{machine.name}</h4>
                          <span className="text-[#00564A] font-semibold text-sm">{machine.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                          <MapPin size={14} />
                          <span>{machine.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Droplet size={12} />
                            <span>{machine.products.length} products</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">
                            Available
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectMachine(machine.id)}
                        className="flex-1 bg-[#00564A] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <Droplet size={16} />
                        Refill Now
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <Navigation size={16} />
                        Directions
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Other Machines */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Other Locations</h3>
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
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(machine.status)}`}>
                          {machine.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* Map View (Static placeholder) */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-4"
        >
          <div className="bg-gradient-to-br from-[#DFF5F1] to-[#E8F5F2] rounded-2xl h-80 flex items-center justify-center relative overflow-hidden">
            {/* Map placeholder pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border border-gray-300 rounded-full"
                  style={{
                    width: `${(i + 1) * 40}px`,
                    height: `${(i + 1) * 40}px`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </div>

            {/* Machine markers */}
            <div className="relative w-full h-full">
              {machines.map((machine, idx) => {
                const positions = [
                  { top: '30%', left: '25%' },
                  { top: '45%', left: '60%' },
                  { top: '60%', left: '35%' },
                  { top: '25%', left: '70%' },
                  { top: '70%', left: '55%' },
                  { top: '55%', left: '20%' },
                ];
                const pos = positions[idx % positions.length];

                return (
                  <motion.div
                    key={machine.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="absolute"
                    style={pos}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        machine.status === 'Available' ? 'bg-[#00564A] text-white' :
                        machine.status === 'Busy' ? 'bg-yellow-500 text-white' :
                        'bg-gray-400 text-white'
                      }`}
                    >
                      <Droplet size={18} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm">
                <p className="text-gray-600 text-sm text-center">
                  Showing {machines.length} stations nearby
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00564A]" />
              <span className="text-xs text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-600">Busy</span>
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

// Mock data for EcoRefill application

export interface Machine {
  id: string;
  name: string;
  location: string;
  address: string;
  status: 'Available' | 'Busy' | 'Offline' | 'Maintenance';
  distance: string;
  products: string[];
}

export interface ProductBrand {
  id: string;
  name: string;
  pricePerMl: number;
}

export interface Product {
  id: string;
  name: string;
  nameId?: string;
  category: string;
  pricePerMl: number;
  icon: string;
  color: string;
  description: string;
  brands: ProductBrand[];
}

export interface Transaction {
  id: string;
  type: 'refill' | 'topup' | 'deposit' | 'refund' | 'reward';
  amount: number;
  date: string;
  description: string;
  machine?: string;
  product?: string;
  volume?: number;
}

export interface Bottle {
  id: string;
  type: string;
  size: string;
  status: 'Aktif' | 'Dikembalikan' | 'Didaur ulang' | 'Rusak';
  depositAmount: number;
  purchaseDate: string;
  lastUsed?: string;
  refillsCount: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  image: string;
  category: 'discount' | 'freeRefill' | 'merchandise';
}

export const machines: Machine[] = [
  {
    id: 'M001',
    name: 'EcoStation Central Park',
    location: 'Central Park Mall',
    address: 'Jl. Sudirman No. 123, Jakarta',
    status: 'Available',
    distance: '0.3 km',
    products: ['bath-soap', 'shampoo', 'detergent', 'dish-soap', 'floor-cleaner']
  },
  {
    id: 'M002',
    name: 'EcoStation Green Tower',
    location: 'Green Tower Business District',
    address: 'Jl. Gatot Subroto No. 45, Jakarta',
    status: 'Available',
    distance: '0.8 km',
    products: ['bath-soap', 'shampoo', 'detergent', 'dish-soap', 'floor-cleaner']
  },
  {
    id: 'M003',
    name: 'EcoStation Sunrise Plaza',
    location: 'Sunrise Plaza',
    address: 'Jl. HR. Rasuna Said No. 78, Jakarta',
    status: 'Busy',
    distance: '1.2 km',
    products: ['bath-soap', 'shampoo', 'detergent', 'dish-soap', 'floor-cleaner']
  },
  {
    id: 'M004',
    name: 'EcoStation Eco Village',
    location: 'Eco Village Residence',
    address: 'Jl. Kemang No. 56, Jakarta',
    status: 'Available',
    distance: '1.5 km',
    products: ['bath-soap', 'shampoo', 'detergent', 'dish-soap', 'floor-cleaner']
  },
  {
    id: 'M005',
    name: 'EcoStation Harbor Point',
    location: 'Harbor Point Mall',
    address: 'Jl. Pluit No. 89, Jakarta',
    status: 'Offline',
    distance: '2.1 km',
    products: ['bath-soap', 'shampoo', 'detergent', 'dish-soap', 'floor-cleaner']
  },
  {
    id: 'M006',
    name: 'EcoStation Sunset Boulevard',
    location: 'Sunset Boulevard',
    address: 'Jl. Pondok Indah No. 12, Jakarta',
    status: 'Maintenance',
    distance: '2.8 km',
    products: ['bath-soap', 'shampoo', 'detergent', 'dish-soap', 'floor-cleaner']
  }
];

export const products: Product[] = [
  {
    id: 'bath-soap',
    name: 'Sabun Mandi',
    category: 'Personal Care',
    pricePerMl: 0.5,
    icon: '🧼',
    color: '#00B4D8',
    description: 'Menjaga kelembapan alami kulit setiap kali mandi',
    brands: [
      { id: 'biore', name: 'Biore', pricePerMl: 42 },
  { id: 'dettol', name: 'Dettol', pricePerMl: 38 },
  { id: 'dove', name: 'Dove', pricePerMl: 180 },
  { id: 'lifebuoy', name: 'Lifebuoy', pricePerMl: 27 },
  { id: 'lux', name: 'Lux', pricePerMl: 140 }
    ]
  },
  {
    id: 'shampoo',
    name: 'Sampo',
    category: 'Personal Care',
    pricePerMl: 0.8,
    icon: '🧴',
    color: '#90BE6D',
    description: 'Formula ramah lingkungan untuk kulit kepala segar dan rambut lembut',
    brands: [
      { id: 'clear', name: 'Clear', pricePerMl: 90 },
      { id: 'headshoulders', name: 'Head & Shoulders', pricePerMl: 32 },
      { id: 'sunsilk', name: 'Sunsilk', pricePerMl: 44 }
    ]
  },
  {
    id: 'detergent',
    name: 'Deterjen Cair',
    category: 'Household',
    pricePerMl: 0.4,
    icon: '🫧',
    color: '#F9C74F',
    description: 'Pembersih pakaian ampuh dengan formula ramah lingkungan',
    brands: [
      { id: 'attack', name: 'Attack', pricePerMl: 30 },
      { id: 'rinso', name: 'Rinso', pricePerMl: 45 },
      { id: 'soklin_deterjen', name: 'So Klin', pricePerMl: 38 }
    ]
  },
  {
    id: 'dish-soap',
    name: 'Sabun Cuci Piring',
    category: 'Household',
    pricePerMl: 0.35,
    icon: '🍽️',
    color: '#F8961E',
    description: 'Formula khusus efektif mengangkat lemak membandel, aman di tangan dan ramah lingkungan',
    brands: [
      { id: 'ekonomi', name: 'Ekonomi', pricePerMl: 15 },
  { id: 'mamalemon', name: 'Mama Lemon', pricePerMl: 18 },
  { id: 'sunlight', name: 'Sunlight', pricePerMl: 25 }
    ]
  },
  {
    id: 'floor-cleaner',
    name: 'Pembersih Lantai',
    category: 'Household',
    pricePerMl: 0.45,
    icon: '🧹',
    color: '#E76F51',
    description: 'Formula antibakteri efektif untuk lantai higienis dan bebas kuman',
    brands: [
      { id: 'mrmuscle', name: 'Mr. Muscle', pricePerMl: 30 },
  { id: 'soklin_lantai', name: 'So Klin Lantai', pricePerMl: 24 },
  { id: 'superpell', name: 'Super Pell', pricePerMl: 25 },
  { id: 'wipol', name: 'Wipol', pricePerMl: 17 }
    ]
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'TXN001',
    type: 'refill',
    amount: 25000,
    date: '2024-01-15T10:30:00',
    description: 'Refill Sabun Mandi 500ml',
    machine: 'EcoStation Central Park',
    product: 'Sabun Mandi',
    volume: 500
  },
  {
    id: 'TXN002',
    type: 'topup',
    amount: 100000,
    date: '2024-01-14T14:20:00',
    description: 'Wallet Top Up via Bank Transfer'
  },
  {
    id: 'TXN003',
    type: 'refill',
    amount: 40000,
    date: '2024-01-12T09:15:00',
    description: 'Refill Sampo 500ml',
    machine: 'EcoStation Green Tower',
    product: 'Sampo',
    volume: 500
  },
  {
    id: 'TXN004',
    type: 'deposit',
    amount: 15000,
    date: '2024-01-10T16:45:00',
    description: 'Deposit Botol Baru'
  },
  {
    id: 'TXN005',
    type: 'reward',
    amount: 0,
    date: '2024-01-08T11:00:00',
    description: 'Redeem Voucher Gratis'
  },
  {
    id: 'TXN006',
    type: 'refill',
    amount: 18000,
    date: '2024-01-05T13:30:00',
    description: 'Refill Deterjen 450ml',
    machine: 'EcoStation Sunrise Plaza',
    product: 'Deterjen',
    volume: 450
  },
  {
    id: 'TXN007',
    type: 'refund',
    amount: 15000,
    date: '2024-01-03T10:00:00',
    description: 'Refund Deposit Botol'
  }
];

export const initialBottles: Bottle[] = [
  {
    id: 'BTL001',
    type: 'Standard',
    size: '500ml',
    status: 'Dikembalikan',
    depositAmount: 15000,
    purchaseDate: '2024-01-01',
    lastUsed: '2024-01-15',
    refillsCount: 5
  },
  {
    id: 'BTL002',
    type: 'Premium',
    size: '1000ml',
    status: 'Dikembalikan',
    depositAmount: 25000,
    purchaseDate: '2024-01-05',
    lastUsed: '2024-01-12',
    refillsCount: 3
  },
  {
    id: 'BTL003',
    type: 'Standard',
    size: '300ml',
    status: 'Dikembalikan',
    depositAmount: 10000,
    purchaseDate: '2023-12-15',
    refillsCount: 12
  }
];

export const rewards: Reward[] = [
  {
    id: 'RWD002',
    name: 'Voucher Diskon 20%',
    description: 'Dapatkan diskon 20% untuk pembelian berikutnya',
    pointsCost: 300,
    image: '🏷️',
    category: 'discount'
  },
  {
    id: 'RWD001',
    name: 'Refill Gratis',
    description: 'Dapatkan satu kali isi ulang gratis hingga 500ml',
    pointsCost: 500,
    image: '🎁',
    category: 'freeRefill'
  },
  {
    id: 'RWD005',
    name: 'Diskon 50%',
    description: 'Dapatkan diskon 50% untuk pembelian berikutnya',
    pointsCost: 750,
    image: '💫',
    category: 'discount'
  },
  {
    id: 'RWD004',
    name: 'Premium Bottle',
    description: 'Gratis Botol Refill Premium 1000ml',
    pointsCost: 800,
    image: '🍶',
    category: 'merchandise'
  },
  {
    id: 'RWD003',
    name: 'Eco Tote Bag',
    description: 'Tas belanja ramah lingkungan premium yang dapat digunakan kembali',
    pointsCost: 1000,
    image: '🛍️',
    category: 'merchandise'
  }
];

export const ecoStats = {
  plasticBottlesSaved: 120,
  plasticWasteReduced: 55, // kg
  waterSaved: 50, // liters
  carbonFootprintReduced: 30, // kg CO2
  treesEquiv: 3
};

export const achievements = [
  { id: 'ACH001', title: 'Refill Pertama', description: 'Selesaikan refill pertamamu', icon: '🌱', progress: 100, unlocked: true },
  { id: 'ACH002', title: 'Juara Ekologi', description: 'Hemat 100 botol plastik', icon: '🛡️', progress: 100, unlocked: true },
  { id: 'ACH003', title: 'Master Refill', description: 'Selesaikan 50 refill', icon: '🏅', progress: 68, unlocked: false },
  { id: 'ACH004', title: 'Juara Hijau', description: 'Hemat 500 botol plastik', icon: '🏆', progress: 37, unlocked: false },
  { id: 'ACH005', title: 'Pahlawan Keberlanjutan', description: 'Selesaikan 100 refill', icon: '⭐', progress: 34, unlocked: false }
];

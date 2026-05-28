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

export interface Product {
  id: string;
  name: string;
  nameId?: string;
  category: string;
  pricePerMl: number;
  icon: string;
  color: string;
  description: string;
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
  status: 'Active' | 'Returned' | 'Recycled' | 'Damaged';
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
    name: 'Bath Soap',
    nameId: 'Sabun Mandi',
    category: 'Personal Care',
    pricePerMl: 0.5,
    icon: '🧼',
    color: '#00B4D8',
    description: 'Gentle cleansing soap for body'
  },
  {
    id: 'shampoo',
    name: 'Shampoo',
    nameId: 'Sampo',
    category: 'Personal Care',
    pricePerMl: 0.8,
    icon: '🧴',
    color: '#90BE6D',
    description: 'Herbal shampoo for healthy hair'
  },
  {
    id: 'detergent',
    name: 'Liquid Detergent',
    nameId: 'Deterjen Cair',
    category: 'Household',
    pricePerMl: 0.4,
    icon: '🫧',
    color: '#F9C74F',
    description: 'Eco-friendly laundry detergent'
  },
  {
    id: 'dish-soap',
    name: 'Dishwashing Liquid',
    nameId: 'Sabun Cuci Piring',
    category: 'Household',
    pricePerMl: 0.35,
    icon: '🍽️',
    color: '#F8961E',
    description: 'Effective dish cleaning liquid'
  },
  {
    id: 'floor-cleaner',
    name: 'Floor Cleaner',
    nameId: 'Pembersih Lantai',
    category: 'Household',
    pricePerMl: 0.45,
    icon: '🧹',
    color: '#E76F51',
    description: 'Fresh scent floor disinfectant'
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'TXN001',
    type: 'refill',
    amount: 25000,
    date: '2024-01-15T10:30:00',
    description: 'Refill Hand Soap 500ml',
    machine: 'EcoStation Central Park',
    product: 'Hand Soap',
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
    description: 'Refill Shampoo 500ml',
    machine: 'EcoStation Green Tower',
    product: 'Shampoo',
    volume: 500
  },
  {
    id: 'TXN004',
    type: 'deposit',
    amount: 15000,
    date: '2024-01-10T16:45:00',
    description: 'New Bottle Deposit'
  },
  {
    id: 'TXN005',
    type: 'reward',
    amount: 0,
    date: '2024-01-08T11:00:00',
    description: 'Redeemed Free Refill Voucher'
  },
  {
    id: 'TXN006',
    type: 'refill',
    amount: 18000,
    date: '2024-01-05T13:30:00',
    description: 'Refill Detergent 450ml',
    machine: 'EcoStation Sunrise Plaza',
    product: 'Detergent',
    volume: 450
  },
  {
    id: 'TXN007',
    type: 'refund',
    amount: 15000,
    date: '2024-01-03T10:00:00',
    description: 'Bottle Return Refund'
  }
];

export const initialBottles: Bottle[] = [
  {
    id: 'BTL001',
    type: 'Standard',
    size: '500ml',
    status: 'Active',
    depositAmount: 15000,
    purchaseDate: '2024-01-01',
    lastUsed: '2024-01-15',
    refillsCount: 5
  },
  {
    id: 'BTL002',
    type: 'Premium',
    size: '1000ml',
    status: 'Active',
    depositAmount: 25000,
    purchaseDate: '2024-01-05',
    lastUsed: '2024-01-12',
    refillsCount: 3
  },
  {
    id: 'BTL003',
    type: 'Standard',
    size: '300ml',
    status: 'Returned',
    depositAmount: 10000,
    purchaseDate: '2023-12-15',
    refillsCount: 12
  }
];

export const rewards: Reward[] = [
  {
    id: 'RWD001',
    name: 'Free Refill',
    description: 'Get one free refill up to 500ml',
    pointsCost: 500,
    image: '🎁',
    category: 'freeRefill'
  },
  {
    id: 'RWD002',
    name: '20% Discount Voucher',
    description: '20% off on your next purchase',
    pointsCost: 300,
    image: '🏷️',
    category: 'discount'
  },
  {
    id: 'RWD003',
    name: 'Eco Tote Bag',
    description: 'Premium reusable eco-friendly tote bag',
    pointsCost: 1000,
    image: '🛍️',
    category: 'merchandise'
  },
  {
    id: 'RWD004',
    name: 'Premium Bottle',
    description: 'Free 1000ml premium refillable bottle',
    pointsCost: 800,
    image: '🍶',
    category: 'merchandise'
  },
  {
    id: 'RWD005',
    name: '50% Discount',
    description: 'Half price on your next refill',
    pointsCost: 750,
    image: '💫',
    category: 'discount'
  }
];

export const ecoStats = {
  plasticBottlesSaved: 1847,
  plasticWasteReduced: 55.4, // kg
  waterSaved: 2340, // liters
  carbonFootprintReduced: 127.8, // kg CO2
  treesEquiv: 6
};

export const achievements = [
  { id: 'ACH001', title: 'First Refill', description: 'Complete your first refill', icon: '🌱', progress: 100, unlocked: true },
  { id: 'ACH002', title: 'Eco Warrior', description: 'Save 100 plastic bottles', icon: '🛡️', progress: 100, unlocked: true },
  { id: 'ACH003', title: 'Refill Master', description: 'Complete 50 refills', icon: '🏅', progress: 68, unlocked: false },
  { id: 'ACH004', title: 'Green Champion', description: 'Save 500 plastic bottles', icon: '🏆', progress: 37, unlocked: false },
  { id: 'ACH005', title: 'Sustainability Hero', description: 'Complete 100 refills', icon: '⭐', progress: 34, unlocked: false }
];

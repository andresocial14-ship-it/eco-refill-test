// ============================================
// FULLY STATIC MOCK DATA FOR REFILL FLOW
// No database connections - Pure frontend data
// ============================================

export interface StaticMachine {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Maintenance' | 'Offline';
  availableCategories: string[];
  last serviced: string;
}

export interface StaticProduct {
  id: string;
  name: string;
  category: 'Shampoo' | 'Soap' | 'Detergent' | 'Conditioner';
  pricePerMl: number;
  description: string;
  color: string;
  icon: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// STATIC MACHINES
export const STATIC_MACHINES: StaticMachine[] = [
  {
    id: 'MACHINE_A',
    name: 'Machine A - Main Parking Area',
    location: 'Near Entrance Gate 1',
    status: 'Active',
    availableCategories: ['Shampoo', 'Soap', 'Detergent'],
    lastServiced: '2024-01-20'
  },
  {
    id: 'MACHINE_B',
    name: 'Machine B - Lobby Building B',
    location: 'Ground Floor, East Wing',
    status: 'Active',
    availableCategories: ['Shampoo', 'Soap', 'Conditioner'],
    lastServiced: '2024-01-21'
  }
];

// STATIC PRODUCTS - Hardcoded Mappings
// Category 'Shampoo' -> Shows these products
const SHAMPOO_PRODUCTS: StaticProduct[] = [
  {
    id: 'SHAMPOO_ANTI_DANDRUFF',
    name: 'Anti-Dandruff Shampoo',
    category: 'Shampoo',
    pricePerMl: 0.05,
    description: 'Effective anti-dandruff formula for healthy scalp. Contains zinc pyrithione.',
    color: '#3B82F6',
    icon: '🧴'
  },
  {
    id: 'SHAMPOO_HERBAL',
    name: 'Herbal Shampoo',
    category: 'Shampoo',
    pricePerMl: 0.06,
    description: 'Natural herbal blend for soft and shiny hair. Made with aloe vera.',
    color: '#10B981',
    icon: '🌿'
  }
];

// Category 'Soap' -> Shows these products
const SOAP_PRODUCTS: StaticProduct[] = [
  {
    id: 'SOAP_BODY_WASH',
    name: 'Body Wash',
    category: 'Soap',
    pricePerMl: 0.03,
    description: 'Refreshing body wash with moisturizing formula. Gentle on skin.',
    color: '#F59E0B',
    icon: '🧼'
  },
  {
    id: 'SOAP_HAND',
    name: 'Hand Soap',
    category: 'Soap',
    pricePerMl: 0.02,
    description: 'Antibacterial hand soap with aloe extract. Cleans and softens.',
    color: '#EC4899',
    icon: '✋'
  }
];

// Additional categories for completeness
const DETERGENT_PRODUCTS: StaticProduct[] = [
  {
    id: 'DETERGENT_REGULAR',
    name: 'Regular Detergent',
    category: 'Detergent',
    pricePerMl: 0.04,
    description: 'Standard laundry detergent for everyday use.',
    color: '#8B5CF6',
    icon: '🫧'
  }
];

const CONDITIONER_PRODUCTS: StaticProduct[] = [
  {
    id: 'CONDITIONER_SILK',
    name: 'Silk Conditioner',
    category: 'Conditioner',
    pricePerMl: 0.055,
    description: 'Silky smooth conditioner for all hair types.',
    color: '#F472B6',
    icon: '💆'
  }
];

// SAFE MAPPING - ALWAYS RETURNS VALID DATA
export const getProductByCategory = (category: string): StaticProduct[] => {
  switch (category) {
    case 'Shampoo':
      return SHAMPOO_PRODUCTS;
    case 'Soap':
      return SOAP_PRODUCTS;
    case 'Detergent':
      return DETERGENT_PRODUCTS;
    case 'Conditioner':
      return CONDITIONER_PRODUCTS;
    default:
      // FALLBACK - Never return empty array
      return [
        {
          id: 'DEFAULT_PRODUCT',
          name: 'Default Product',
          category: 'Soap',
          pricePerMl: 0.03,
          description: 'Default fallback product',
          color: '#6B7280',
          icon: '🧴'
        }
      ];
  }
};

// Get single product by ID with fallback
export const getProductById = (productId: string): StaticProduct | null => {
  const allProducts = [
    ...SHAMPOO_PRODUCTS,
    ...SOAP_PRODUCTS,
    ...DETERGENT_PRODUCTS,
    ...CONDITIONER_PRODUCTS
  ];

  const found = allProducts.find(p => p.id === productId);
  return found || allProducts[0]; // Always return at least first product as fallback
};

// Get machine by ID with fallback
export const getMachineById = (machineId: string): StaticMachine => {
  const found = STATIC_MACHINES.find(m => m.id === machineId);
  return found || STATIC_MACHINES[0]; // Always return at least first machine
};

// STATIC PAYMENT METHODS
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'QRIS',
    name: 'QRIS',
    icon: '📱',
    description: 'Scan QR code with any banking app'
  },
  {
    id: 'DIGITAL_WALLET',
    name: 'Digital Wallet',
    icon: '💳',
    description: 'OVO, GoPay, ShopeePay, etc.'
  },
  {
    id: 'CREDIT_CARD',
    name: 'Credit Card',
    icon: '💎',
    description: 'Visa, MasterCard, JCB'
  }
];

// VOLUME CONFIGURATION
export const VOLUME_CONFIG = {
  MIN: 100,
  MAX: 1000,
  STEP: 50,
  DEFAULT: 250
};

// Format currency helper
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Calculate total price
export const calculateTotalPrice = (volumeMl: number, pricePerMl: number): number => {
  if (!volumeMl || !pricePerMl) return 0;
  return volumeMl * pricePerMl;
};

// Generate static transaction ID
export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

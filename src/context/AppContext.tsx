import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, Bottle, initialTransactions, initialBottles, ecoStats } from '../data/mockData';

// State interface
interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  walletBalance: number;
  depositBalance: number;
  ecoPoints: number;
  bottles: Bottle[];
  transactions: Transaction[];
  activeRefill: ActiveRefill | null;
  hasSeenOnboarding: boolean;
  ecoStats: typeof ecoStats;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}

interface ActiveRefill {
  transactionId: string;
  machineId: string;
  machineName: string;
  productId: string;
  productName: string;
  volume: number;
  totalPrice: number;
  createdAt: Date;
}

// Action types
type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_WALLET_BALANCE'; payload: number }
  | { type: 'TOP_UP_WALLET'; payload: number }
  | { type: 'DEDUCT_WALLET'; payload: number }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_BOTTLE'; payload: Bottle }
  | { type: 'UPDATE_BOTTLE'; payload: { id: string; updates: Partial<Bottle> } }
  | { type: 'SET_ECO_POINTS'; payload: number }
  | { type: 'ADD_ECO_POINTS'; payload: number }
  | { type: 'SET_ACTIVE_REFILL'; payload: ActiveRefill | null }
  | { type: 'COMPLETE_REFILL' }
  | { type: 'SET_ONBOARDING_COMPLETE' };

// Initial state
const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  walletBalance: 250000,
  depositBalance: 40000,
  ecoPoints: 1250,
  bottles: initialBottles,
  transactions: initialTransactions,
  activeRefill: null,
  hasSeenOnboarding: false,
  ecoStats: ecoStats
};

// LocalStorage keys
const STORAGE_KEY = 'ecorefill_state';

// Load state from LocalStorage
const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        // Always use fresh eco stats
        ecoStats: ecoStats
      };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
  return initialState;
};

// Save state to LocalStorage
const saveState = (state: AppState): void => {
  try {
    const toSave = {
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      walletBalance: state.walletBalance,
      depositBalance: state.depositBalance,
      ecoPoints: state.ecoPoints,
      bottles: state.bottles,
      transactions: state.transactions,
      hasSeenOnboarding: state.hasSeenOnboarding
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
};

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };

    case 'LOGOUT':
      return { ...initialState, hasSeenOnboarding: state.hasSeenOnboarding };

    case 'SET_WALLET_BALANCE':
      return { ...state, walletBalance: action.payload };

    case 'TOP_UP_WALLET':
      return { ...state, walletBalance: state.walletBalance + action.payload };

    case 'DEDUCT_WALLET':
      return { ...state, walletBalance: state.walletBalance - action.payload };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case 'ADD_BOTTLE':
      return { ...state, bottles: [...state.bottles, action.payload] };

    case 'UPDATE_BOTTLE':
      return {
        ...state,
        bottles: state.bottles.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload.updates } : b
        )
      };

    case 'SET_ECO_POINTS':
      return { ...state, ecoPoints: action.payload };

    case 'ADD_ECO_POINTS':
      return { ...state, ecoPoints: state.ecoPoints + action.payload };

    case 'SET_ACTIVE_REFILL':
      return { ...state, activeRefill: action.payload };

    case 'COMPLETE_REFILL':
      if (!state.activeRefill) return state;
      const refill = state.activeRefill;
      const newTransaction: Transaction = {
        id: refill.transactionId,
        type: 'refill',
        amount: refill.totalPrice,
        date: new Date().toISOString(),
        description: `Refill ${refill.productName} ${refill.volume}ml`,
        machine: refill.machineName,
        product: refill.productName,
        volume: refill.volume
      };
      return {
        ...state,
        activeRefill: null,
        transactions: [newTransaction, ...state.transactions],
        ecoPoints: state.ecoPoints + Math.floor(refill.totalPrice / 100)
      };

    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, hasSeenOnboarding: true };

    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);

  // Persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type { AppState, User, ActiveRefill };

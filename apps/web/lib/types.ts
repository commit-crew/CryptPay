// User related interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  publicAddress: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  publicAddress: string;
}

// Transaction related interfaces
export interface Transaction {
  id: string;
  fromToken: string;
  toToken: string;
  fromQuantity: string;
  toQuantity: string;
  conversionRate: string;
  status: string;
  createdAt: string;
  userName: string;
  toUser: {
    name: string;
    email: string;
  };
}

export interface TransactionHistProps {
  userId: string;
  limit?: number;
}

// Toast/Notification interfaces
export interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}
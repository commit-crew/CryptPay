"use client";

import React, { useState, useEffect } from 'react';
import { getTransactionHistory } from '@/lib/user';

interface Transaction {
  id: string;
  fromToken: string;
  toToken: string;
  fromQuantity: string;
  toQuantity: string;
  conversionRate: string;
  status: string;
  createdAt: string;
  userName: string;
}

interface TransactionHistProps {
  userId: string;
  limit?: number;
}

const TransactionHist: React.FC<TransactionHistProps> = ({ userId, limit = 10 }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getTransactionHistory(userId, limit);
        setTransactions(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId, limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getTokenIcon = (token: string) => {
    // You can customize these colors or use actual token icons
    const tokenColors: { [key: string]: string } = {
      'WETH': 'bg-orange-500',
      'SOL': 'bg-amber-800',
      'USDC': 'bg-blue-600',
      'BTC': 'bg-orange-400',
      'ETH': 'bg-gray-600',
    };
    
    return tokenColors[token.toUpperCase()] || 'bg-gray-400';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 drop-shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 drop-shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 drop-shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        <button className="text-[#6750A4] text-sm font-medium flex items-center hover:underline">
          See all
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full ${getTokenIcon(transaction.toToken)} flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.userName}</h3>
                  <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-medium text-gray-900">{transaction.toToken}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHist;
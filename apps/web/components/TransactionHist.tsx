"use client";

import React, { useState, useEffect } from "react";
import { getTransactionHistory } from "@/lib/user";
import type { Transaction, TransactionHistProps } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

const TransactionHist = ({ limit = 10 }: TransactionHistProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("authToken");
      try {
        setIsLoading(true);
        setError(null);
        const response = await getTransactionHistory(token!, limit);
        setTransactions(response.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch transactions"
        );
      } finally {
        setIsLoading(false);
      }
    };

    
      fetchTransactions();
    
  }, [limit]);

  const getTokenIcon = (token: string) => {
    // You can customize these colors or use actual token icons
    const tokenColors: { [key: string]: string } = {
      WETH: "bg-orange-500",
      SOL: "bg-amber-800",
      USDC: "bg-blue-600",
      BTC: "bg-orange-400",
      ETH: "bg-gray-600",
    };

    return tokenColors[token.toUpperCase()] || "bg-gray-400";
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Transaction History
        </h2>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[300px] md:max-w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg lg:text-xl xl:text-2xl text-black">
          Transaction History
        </div>
        <button className="text-[#6750A4] text-sm font-medium flex items-center hover:underline">
          See all
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No transactions found
        </div>
      ) : (
        <div className="py-6 px-3 flex flex-col gap-5">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between"
            >
              <div className="flex gap-2">
                <div>
                  <Image 
                  src={"/images/profile-icon.jpg"}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-[14px]">{ transaction.toUser.name }</div>
                  <div className="text-[12px]">{ formatDate( transaction.createdAt )}</div>
                </div>
              </div>
              <div className="flex gap-1 h-fit">
                <Image 
                  src={"/images/token-icon-common.svg"}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <div className="text-[14px]">{transaction.toToken}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHist;

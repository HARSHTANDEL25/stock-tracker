'use client';

import { useState, useEffect } from 'react';

export default function BitcoinPrice() {
  const [bitcoin, setBitcoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/crypto/bitcoin');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Bitcoin data');
        }

        const data = await response.json();
        setBitcoin(data.bitcoin);
        setError(null);
      } catch (err) {
        console.error('Error fetching Bitcoin:', err);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinData();
    
    // Refresh every minute
    const interval = setInterval(fetchBitcoinData, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value, currency = 'USD') => {
    if (!value) return 'N/A';
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatMarketCap = (value) => {
    if (!value) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  const formatVolume = (value) => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center py-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading Bitcoin data...
          </p>
        </div>
      </div>
    );
  }

  if (!bitcoin) {
    return null;
  }

  const isPositive = bitcoin.change24h >= 0;

  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
            <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
              ₿
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {bitcoin.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {bitcoin.symbol}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${
          isPositive 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-red-100 dark:bg-red-900/30'
        }`}>
          <svg 
            className={`h-4 w-4 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isPositive ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V6"} 
            />
          </svg>
          <span className={`text-xs font-semibold ${
            isPositive 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? '+' : ''}{bitcoin.change24h.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Price Display */}
      <div className="mb-6 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Price (USD)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(bitcoin.priceUSD, 'USD')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Price (INR)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(bitcoin.priceINR, 'INR')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">24h Change</p>
          <p className={`text-sm font-bold ${
            isPositive 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? '+' : ''}{bitcoin.change24h.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">24h Volume</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {formatVolume(bitcoin.volume24h)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {formatMarketCap(bitcoin.marketCap)}
          </p>
        </div>
      </div>
    </div>
  );
}

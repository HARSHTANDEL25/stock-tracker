'use client';

import { useState, useEffect } from 'react';
import BitcoinPrice from './BitcoinPrice';

export default function BitcoinMarket() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/crypto/gainers-losers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch crypto data');
        }

        const data = await response.json();
        setGainers(data.gainers || []);
        setLosers(data.losers || []);
      } catch (err) {
        console.error('Error fetching crypto:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    
    // Refresh every minute
    const interval = setInterval(fetchCryptoData, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (price >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(price);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 4,
    }).format(price);
  };

  return (
    <div className="bg-linear-to-br from-orange-50 to-yellow-50 py-20 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Cryptocurrency Market
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Bitcoin price and crypto market movers
          </p>
        </div>

        {/* Split Layout: Bitcoin on left, Crypto Gainers/Losers on right */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bitcoin Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Bitcoin
            </h3>
            <BitcoinPrice />
          </div>

          {/* Crypto Gainers/Losers Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Top Movers
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Loading crypto data...
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {/* Top Gainers */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Top Gainers
                    </h3>
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Up
                    </span>
                  </div>
                  <div className="space-y-2">
                    {gainers.length > 0 ? (
                      gainers.map((crypto, index) => (
                        <div
                          key={crypto.symbol}
                          className="group flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-all hover:bg-gray-100 hover:shadow-md dark:bg-gray-900/50 dark:hover:bg-gray-900"
                          style={{
                            animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`,
                          }}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                            <span className="text-xs font-bold text-green-700 dark:text-green-400">
                              {crypto.symbol.substring(0, 3)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {crypto.symbol}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {crypto.name}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {formatPrice(crypto.price)}
                            </p>
                            <div className="flex items-center justify-end gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                              <span>+{crypto.changePercent.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
                        No gainers data available
                      </p>
                    )}
                  </div>
                </div>

                {/* Top Losers */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Top Losers
                    </h3>
                    <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                      Down
                    </span>
                  </div>
                  <div className="space-y-2">
                    {losers.length > 0 ? (
                      losers.map((crypto, index) => (
                        <div
                          key={crypto.symbol}
                          className="group flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-all hover:bg-gray-100 hover:shadow-md dark:bg-gray-900/50 dark:hover:bg-gray-900"
                          style={{
                            animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`,
                          }}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                            <span className="text-xs font-bold text-red-700 dark:text-red-400">
                              {crypto.symbol.substring(0, 3)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {crypto.symbol}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {crypto.name}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {formatPrice(crypto.price)}
                            </p>
                            <div className="flex items-center justify-end gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                              </svg>
                              <span>{crypto.changePercent.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
                        No losers data available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


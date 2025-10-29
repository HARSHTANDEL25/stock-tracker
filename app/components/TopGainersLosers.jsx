'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopGainersLosers() {
  const [activeTab, setActiveTab] = useState('large'); // small, medium, large
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const loadWatchlist = () => {
      try {
        const savedWatchlist = localStorage.getItem('watchlist');
        if (savedWatchlist) {
          const parsed = JSON.parse(savedWatchlist);
          setWatchlist(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading watchlist:', error);
      }
    };
    
    loadWatchlist();
    
    // Sync watchlist across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'watchlist') {
        loadWatchlist();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add stock to watchlist
  const handleAddToWatchlist = (stock) => {
    try {
      const isAlreadyAdded = watchlist.some(item => item.symbol === stock.symbol);
      if (!isAlreadyAdded) {
        const newWatchlist = [...watchlist, stock];
        setWatchlist(newWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const isInWatchlist = (symbol) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsTransitioning(true);
        setLoading(true);
        const response = await fetch(`/api/stocks/gainers-losers?marketCap=${activeTab}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }

        const data = await response.json();
        
        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 150));
        
        setGainers(data.gainers || []);
        setLosers(data.losers || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError(null);
      } finally {
        setLoading(false);
        setIsTransitioning(false);
      }
    };

    fetchStockData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const tabs = [
    { id: 'small', label: 'Small Cap' },
    { id: 'medium', label: 'Mid Cap' },
    { id: 'large', label: 'Large Cap' },
  ];

  if (loading && gainers.length === 0) {
    return (
      <div className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Market Movers
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Loading market data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Market Movers
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Top gainers and losers by market capitalization
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content with fade transition */}
        <div 
          className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Gainers */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Top Gainers
                </h3>
                <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Up Today
                </span>
              </div>
              <div className="space-y-2">
                {gainers.length > 0 ? (
                  gainers.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      className="group flex items-center gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 hover:shadow-md dark:bg-gray-900/50 dark:hover:bg-gray-900"
                      style={{
                        animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`,
                      }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                        <span className="text-xs font-bold text-green-700 dark:text-green-400">
                          {stock.symbol.substring(0, 4)}
                        </span>
                      </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/stock/${stock.symbol}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                              {stock.symbol}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {stock.name}
                            </p>
                          </div>
                      <div className="shrink-0 flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{stock.price.toFixed(2)}
                          </p>
                          <div className="flex items-center justify-end gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                            <span>+{stock.change.toFixed(2)}</span>
                            <span className="text-xs">(+{stock.changePercent.toFixed(2)}%)</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToWatchlist(stock)}
                          disabled={isInWatchlist(stock.symbol)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            isInWatchlist(stock.symbol)
                              ? 'bg-green-100 text-green-600 cursor-not-allowed dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}
                          title={isInWatchlist(stock.symbol) ? 'Already in watchlist' : 'Add to watchlist'}
                        >
                          {isInWatchlist(stock.symbol) ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No gainers data available
                  </p>
                )}
              </div>
            </div>

            {/* Top Losers */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Top Losers
                </h3>
                <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  Down Today
                </span>
              </div>
              <div className="space-y-2">
                {losers.length > 0 ? (
                  losers.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      className="group flex items-center gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 hover:shadow-md dark:bg-gray-900/50 dark:hover:bg-gray-900"
                      style={{
                        animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`,
                      }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                        <span className="text-xs font-bold text-red-700 dark:text-red-400">
                          {stock.symbol.substring(0, 4)}
                        </span>
                      </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/stock/${stock.symbol}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                              {stock.symbol}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {stock.name}
                            </p>
                          </div>
                      <div className="shrink-0 flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{stock.price.toFixed(2)}
                          </p>
                          <div className="flex items-center justify-end gap-1 text-sm font-medium text-red-600 dark:text-red-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                            <span>{stock.change.toFixed(2)}</span>
                            <span className="text-xs">({stock.changePercent.toFixed(2)}%)</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToWatchlist(stock)}
                          disabled={isInWatchlist(stock.symbol)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            isInWatchlist(stock.symbol)
                              ? 'bg-green-100 text-green-600 cursor-not-allowed dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}
                          title={isInWatchlist(stock.symbol) ? 'Already in watchlist' : 'Add to watchlist'}
                        >
                          {isInWatchlist(stock.symbol) ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No losers data available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function MarketIndices() {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/market/indices');
        
        if (!response.ok) {
          throw new Error('Failed to fetch indices data');
        }

        const data = await response.json();
        setIndices(data.indices || []);
      } catch (err) {
        console.error('Error fetching indices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchIndices, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getCountryFlag = (country) => {
    const flags = {
      'India': '🇮🇳',
      'USA': '🇺🇸',
      'Japan': '🇯🇵',
      'UK': '🇬🇧',
      'China': '🇨🇳',
    };
    return flags[country] || '🌍';
  };

  if (loading) {
    return (
      <div className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Loading market indices...
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
            Major Market Indices
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Track global market performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {indices.map((index) => {
            const isPositive = index.changePercent >= 0;
            
            return (
              <div
                key={index.symbol}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getCountryFlag(index.country)}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {index.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {index.symbol}
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(index.price)}
                  </p>
                </div>
                
                <div className={`flex items-center gap-2 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <svg 
                    className={`h-4 w-4 ${isPositive ? '' : 'rotate-180'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <span className="font-semibold">
                    {isPositive ? '+' : ''}{index.change?.toFixed(2) || '0.00'} ({isPositive ? '+' : ''}{index.changePercent?.toFixed(2) || '0.00'}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';

export default function MarketSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        // Simulate fetching market summary data
        // In production, fetch from real API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSummary({
          totalMarketCap: '4500000', // in crores
          activeStocks: 5234,
          todayGainers: 1245,
          todayLosers: 892,
          marketStatus: 'Open',
        });
      } catch (err) {
        console.error('Error fetching summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchSummary, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 100000) return `${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  if (loading) {
    return null;
  }

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 py-16 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Market Summary
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Market Cap */}
          <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Cap</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{formatNumber(summary?.totalMarketCap)} Cr
            </p>
          </div>

          {/* Active Stocks */}
          <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Stocks</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(summary?.activeStocks)}
            </p>
          </div>

          {/* Gainers */}
          <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today&apos;s Gainers</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatNumber(summary?.todayGainers)}
            </p>
          </div>

          {/* Losers */}
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today&apos;s Losers</h3>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatNumber(summary?.todayLosers)}
            </p>
          </div>

          {/* Market Status */}
          <div className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Status</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              <span className={`inline-flex items-center gap-2 ${summary?.marketStatus === 'Open' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                <span className={`h-2 w-2 rounded-full ${summary?.marketStatus === 'Open' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                {summary?.marketStatus || 'Closed'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';

export default function UpcomingIPOs() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIPOData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stocks/upcoming-ipos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch IPO data');
        }

        const data = await response.json();
        setIpos(data.ipos || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching IPOs:', err);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIPOData();
    
    // Refresh every hour
    const interval = setInterval(fetchIPOData, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatPriceBand = (priceBand) => {
    if (!priceBand || priceBand === 'N/A') return 'N/A';
    // If it already has "Rs." prefix, return as is
    if (priceBand.includes('Rs.')) return priceBand;
    // Otherwise format it
    return priceBand;
  };

  const getSymbolColor = (index) => {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-cyan-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Upcoming IPOs
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Loading IPO data...
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
            Upcoming IPOs
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Track the latest Initial Public Offerings in the market
          </p>
        </div>

        {ipos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {ipos.slice(0, 2).map((ipo, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800"
              >
                {/* Pill-shaped label */}
                <div className="mb-4">
                  <span className={`inline-block rounded-full ${getSymbolColor(index)} px-4 py-1.5 text-xs font-semibold text-white`}>
                    {ipo.symbol}
                  </span>
                </div>

                {/* Company Name */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {ipo.companyName || 'N/A'}
                </h3>

                {/* Symbol */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Symbol: <span className="font-medium text-gray-700 dark:text-gray-300">{ipo.symbol}</span>
                </p>

                {/* Details */}
                <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Issue Size</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white text-right">
                      {ipo.issueSize || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Price Band</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white text-right">
                      {formatPriceBand(ipo.priceBand) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lot Size</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white text-right">
                      {ipo.lotSize || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Open Date</span>
                    <span className={`text-sm font-semibold text-right ${
                      formatDate(ipo.openDate) === 'N/A' || formatDate(ipo.openDate) === 'Invalid Date'
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {formatDate(ipo.openDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Close Date</span>
                    <span className={`text-sm font-semibold text-right ${
                      formatDate(ipo.closeDate) === 'N/A' || formatDate(ipo.closeDate) === 'Invalid Date'
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatDate(ipo.closeDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming IPOs available at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

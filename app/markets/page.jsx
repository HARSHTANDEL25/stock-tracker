'use client';

import MarketIndices from '../components/MarketIndices';
import TopGainersLosers from '../components/TopGainersLosers';
import BitcoinMarket from '../components/BitcoinMarket';

export default function Markets() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Markets
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore all market data and insights
          </p>
        </div>

        {/* Market Indices */}
        <div className="mb-20">
          <MarketIndices />
        </div>

        {/* Bitcoin Market */}
        <div className="mb-20">
          <BitcoinMarket />
        </div>

        {/* Top Gainers & Losers */}
        <TopGainersLosers />
      </div>
    </div>
  );
}


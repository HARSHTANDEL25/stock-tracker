'use client';

import { useState, useEffect } from 'react';
import MarketSummary from '../components/MarketSummary';
import MarketIndices from '../components/MarketIndices';
import TopGainersLosers from '../components/TopGainersLosers';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your complete market overview
          </p>
        </div>

        {/* Market Summary */}
        <MarketSummary />

        {/* Market Indices */}
        <MarketIndices />

        {/* Top Gainers & Losers */}
        <TopGainersLosers />
      </div>
    </div>
  );
}


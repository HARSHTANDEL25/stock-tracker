'use client';

import { useState } from 'react';

export default function Portfolio() {
  const [holdings, setHoldings] = useState([
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', quantity: 10, buyPrice: 2400.00, currentPrice: 2456.80, changePercent: 2.45 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 5, buyPrice: 3350.00, currentPrice: 3421.50, changePercent: 1.85 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', quantity: 15, buyPrice: 1650.00, currentPrice: 1645.20, changePercent: -0.75 },
  ]);

  const calculateTotalValue = () => {
    return holdings.reduce((total, stock) => {
      return total + (stock.currentPrice * stock.quantity);
    }, 0);
  };

  const calculateTotalInvested = () => {
    return holdings.reduce((total, stock) => {
      return total + (stock.buyPrice * stock.quantity);
    }, 0);
  };

  const calculateTotalPL = () => {
    return calculateTotalValue() - calculateTotalInvested();
  };

  const totalValue = calculateTotalValue();
  const totalInvested = calculateTotalInvested();
  const totalPL = calculateTotalPL();
  const totalPLPercent = totalInvested > 0 ? ((totalPL / totalInvested) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Portfolio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your investments and performance
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Invested</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Value</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`rounded-xl border p-6 shadow-sm ${
            totalPL >= 0 
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
          }`}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total P&L</p>
            <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}₹{totalPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className={`text-sm font-medium mt-1 ${totalPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Holdings Table */}
        {holdings.length > 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Holdings
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                      Symbol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                      Company Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                      Avg Buy Price
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                      Current Price
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                      Value
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                      P&L
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {holdings.map((stock) => {
                    const stockValue = stock.currentPrice * stock.quantity;
                    const stockPL = (stock.currentPrice - stock.buyPrice) * stock.quantity;
                    const stockPLPercent = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;
                    const isPositive = stockPL >= 0;

                    return (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {stock.symbol}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {stock.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {stock.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ₹{stock.buyPrice.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ₹{stock.currentPrice.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ₹{stockValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isPositive ? '+' : ''}₹{stockPL.toFixed(2)}
                            </span>
                            <span className={`text-xs ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isPositive ? '+' : ''}{stockPLPercent.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-800">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No holdings yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start tracking your investments by adding stocks to your portfolio
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Holdings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


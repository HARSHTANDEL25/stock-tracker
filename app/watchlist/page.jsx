'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [topStocks, setTopStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saved', 'saving', 'error'

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchlist');
      if (savedWatchlist) {
        const parsed = JSON.parse(savedWatchlist);
        setWatchlist(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
      setSaveStatus('error');
    }
  }, []);

  // Sync watchlist across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'watchlist') {
        try {
          const newWatchlist = e.newValue ? JSON.parse(e.newValue) : [];
          setWatchlist(Array.isArray(newWatchlist) ? newWatchlist : []);
        } catch (error) {
          console.error('Error syncing watchlist:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch top 10 stocks
  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stocks/search');
        if (response.ok) {
          const data = await response.json();
          setTopStocks(data.stocks || []);
        }
      } catch (error) {
        console.error('Error fetching top stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStocks();
  }, []);

  // Search stocks
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.stocks || []);
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Save watchlist to localStorage
  const saveWatchlist = (newWatchlist) => {
    try {
      setSaveStatus('saving');
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error saving watchlist:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Add stock to watchlist
  const handleAddToWatchlist = (stock) => {
    const isAlreadyAdded = watchlist.some(item => item.symbol === stock.symbol);
    if (!isAlreadyAdded) {
      const newWatchlist = [...watchlist, stock];
      setWatchlist(newWatchlist);
      saveWatchlist(newWatchlist);
    }
  };

  // Remove stock from watchlist
  const handleRemove = (symbol) => {
    const newWatchlist = watchlist.filter(stock => stock.symbol !== symbol);
    setWatchlist(newWatchlist);
    saveWatchlist(newWatchlist);
  };

  // Export watchlist as JSON file
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(watchlist, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `watchlist-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error exporting watchlist:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Import watchlist from JSON file
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setWatchlist(imported);
          saveWatchlist(imported);
          alert(`Successfully imported ${imported.length} stocks!`);
        } else {
          alert('Invalid file format. Please import a valid JSON array.');
        }
      } catch (error) {
        console.error('Error importing watchlist:', error);
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  // Clear watchlist
  const handleClear = () => {
    if (confirm('Are you sure you want to clear your watchlist?')) {
      setWatchlist([]);
      saveWatchlist([]);
    }
  };

  const isInWatchlist = (symbol) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  const StockCard = ({ stock, showAddButton = false }) => {
    const isPositive = stock.changePercent >= 0;
    const isAdded = isInWatchlist(stock.symbol);

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <span className={`text-xs font-bold ${isPositive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {stock.symbol.substring(0, 3)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {stock.symbol}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {stock.name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                ₹{stock.price.toFixed(2)}
              </p>
              <p className={`text-xs font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </p>
            </div>
            {showAddButton && (
              <button
                onClick={() => isAdded ? handleRemove(stock.symbol) : handleAddToWatchlist(stock)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  isAdded
                    ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                }`}
                title={isAdded ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {isAdded ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Watchlist
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Track your favorite stocks and stay updated
              </p>
            </div>
            <div className="flex items-center gap-2">
              {saveStatus === 'saved' && (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </span>
              )}
              {saveStatus === 'saving' && (
                <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  Saving...
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Error
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search stocks by symbol or name..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-11 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* Watchlist Section - Moved above stocks list */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Watchlist ({watchlist.length})
            </h2>
            {watchlist.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  title="Export watchlist as JSON"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
                <label className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20 transition-colors"
                  title="Clear watchlist"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          {watchlist.length > 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
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
                        Price
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                        Change
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {watchlist.map((stock) => {
                      const isPositive = stock.changePercent >= 0;
                      return (
                        <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/stock/${stock.symbol}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              {stock.symbol}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {stock.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              ₹{stock.price.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleRemove(stock.symbol)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Remove from watchlist"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your watchlist is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Search for stocks below or browse top stocks and click the + button to add them
              </p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Search Results ({searchResults.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} showAddButton={true} />
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !searchLoading && (
          <div className="mb-12 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No results found for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        {/* Top 10 Stocks */}
        {!searchQuery && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Top Stocks
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Loading stocks...</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topStocks.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} showAddButton={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


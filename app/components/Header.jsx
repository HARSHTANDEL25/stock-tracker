'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  // Popular Indian stocks for search
  const popularStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2456.80, change: 2.45 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3421.50, change: 1.85 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1645.20, change: -0.75 },
    { symbol: 'INFY', name: 'Infosys Ltd.', price: 1525.60, change: 1.25 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 978.40, change: 0.95 },
    { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', price: 1456.75, change: 1.15 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1125.40, change: 0.85 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 625.30, change: 1.25 },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 6834.50, change: -0.50 },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1689.70, change: 0.65 },
  ];

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      // Try fetching from API first
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.stocks && data.stocks.length > 0) {
          setResults(data.stocks.slice(0, 10));
          setShowResults(true);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to local search
      const filtered = popularStocks.filter(
        stock => stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
                 stock.name.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
      setShowResults(filtered.length > 0);
    } catch (err) {
      console.error('Error searching:', err);
      // Fallback to local search on error
      const filtered = popularStocks.filter(
        stock => stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
                 stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowResults(filtered.length > 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-black/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-800 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                StockTracker
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/watchlist"
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Watchlist
            </Link>
            <Link
              href="/portfolio"
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/markets"
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Markets
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Search stocks..."
                  className="w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                />
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && results.length > 0 && (
                <div className="absolute top-full mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 max-h-96 overflow-y-auto z-50">
                  {results.map((stock) => (
                    <Link
                      key={stock.symbol}
                      href={`/stock/${stock.symbol}`}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      onClick={() => {
                        setSearchQuery('');
                        setShowResults(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {stock.symbol}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {stock.name}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            ₹{stock.price.toFixed(2)}
                          </p>
                          <p className={`text-xs font-medium ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {showResults && searchQuery && results.length === 0 && !loading && (
                <div className="absolute top-full mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 p-4 z-50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-1 px-4 py-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/watchlist"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Watchlist
              </Link>
              <Link
                href="/portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/markets"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Markets
              </Link>
            </nav>
            {/* Mobile Search */}
            <div className="px-4 pb-4 relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Search stocks..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                />
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  </div>
                )}
              </div>

              {/* Mobile Search Results Dropdown */}
              {showResults && results.length > 0 && (
                <div className="absolute z-50 mt-2 left-4 right-4 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 max-h-96 overflow-y-auto">
                  {results.map((stock) => (
                    <Link
                      key={stock.symbol}
                      href={`/stock/${stock.symbol}`}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      onClick={() => {
                        setSearchQuery('');
                        setShowResults(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {stock.symbol}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {stock.name}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            ₹{stock.price.toFixed(2)}
                          </p>
                          <p className={`text-xs font-medium ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {showResults && searchQuery && results.length === 0 && !loading && (
                <div className="absolute z-50 mt-2 left-4 right-4 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

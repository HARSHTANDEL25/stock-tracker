'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function StockDetail() {
  const params = useParams();
  const symbol = params.symbol?.toUpperCase();
  
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [fundamentals, setFundamentals] = useState(null);
  const [financials, setFinancials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line'); // 'line' or 'candle'
  const [timeframe, setTimeframe] = useState('1D');
  const [financialType, setFinancialType] = useState('revenue');
  const [financialPeriod, setFinancialPeriod] = useState('quarterly');
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (symbol) {
      loadStockData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, timeframe]);

  useEffect(() => {
    if (symbol) {
      loadFinancials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, financialType, financialPeriod]);

  useEffect(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      setWatchlist(Array.isArray(parsed) ? parsed : []);
    }
  }, []);

  const loadStockData = async () => {
    try {
      setLoading(true);
      const [stockRes, fundamentalsRes] = await Promise.all([
        fetch(`/api/stocks/${symbol}`),
        fetch(`/api/stocks/${symbol}/fundamentals`),
      ]);

      if (stockRes.ok) {
        const stockData = await stockRes.json();
        setStock(stockData.stock);
      }

      if (fundamentalsRes.ok) {
        const fundData = await fundamentalsRes.json();
        setFundamentals(fundData.fundamentals);
      }
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(`/api/stocks/${symbol}/history?period=${timeframe}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const loadFinancials = async () => {
    try {
      const response = await fetch(`/api/stocks/${symbol}/financials?type=${financialType}&period=${financialPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setFinancials(data.financials || []);
      }
    } catch (error) {
      console.error('Error loading financials:', error);
    }
  };

  const addToWatchlist = () => {
    if (!stock) return;
    const isAdded = watchlist.some(item => item.symbol === stock.symbol);
    if (!isAdded) {
      const newWatchlist = [...watchlist, stock];
      setWatchlist(newWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    }
  };

  const isInWatchlist = watchlist.some(item => item.symbol === symbol);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stock not found</h2>
          <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  const isPositive = stock.changePercent >= 0;
  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };
  const formatNumber = (val) => val.toLocaleString('en-IN');

  // Generate chart path from history data
  const maxPrice = history.length > 0 ? Math.max(...history.map(h => Math.max(h.high, h.close)), stock?.price || 0) : (stock?.price || 0);
  const minPrice = history.length > 0 ? Math.min(...history.map(h => Math.min(h.low, h.close)), stock?.price || 0) : (stock?.price || 0) * 0.9;
  const priceRange = maxPrice - minPrice || 1;
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = 40;
  
  // Line chart points
  const linePoints = history.length > 0 
    ? history.map((h, i) => {
        const x = chartPadding + (i / (history.length - 1 || 1)) * (chartWidth - chartPadding * 2);
        const y = chartPadding + chartHeight - chartPadding - ((h.close - minPrice) / priceRange) * (chartHeight - chartPadding * 2);
        return `${x},${y}`;
      }).join(' ')
    : `${chartPadding},${chartHeight / 2} ${chartWidth - chartPadding},${chartHeight / 2}`;

  // Candlestick chart rendering
  const renderCandlestick = (data, index, total) => {
    const x = chartPadding + (index / (total - 1 || 1)) * (chartWidth - chartPadding * 2);
    const candleWidth = (chartWidth - chartPadding * 2) / total * 0.6;
    const isPositive = data.close >= data.open;
    
    const highY = chartPadding + chartHeight - chartPadding - ((data.high - minPrice) / priceRange) * (chartHeight - chartPadding * 2);
    const lowY = chartPadding + chartHeight - chartPadding - ((data.low - minPrice) / priceRange) * (chartHeight - chartPadding * 2);
    const openY = chartPadding + chartHeight - chartPadding - ((data.open - minPrice) / priceRange) * (chartHeight - chartPadding * 2);
    const closeY = chartPadding + chartHeight - chartPadding - ((data.close - minPrice) / priceRange) * (chartHeight - chartPadding * 2);
    
    return (
      <g key={index}>
        {/* Wick */}
        <line
          x1={x}
          y1={highY}
          x2={x}
          y2={lowY}
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="1"
        />
        {/* Candle body */}
        <rect
          x={x - candleWidth / 2}
          y={Math.min(openY, closeY)}
          width={candleWidth}
          height={Math.abs(closeY - openY) || 1}
          fill={isPositive ? "#10b981" : "#ef4444"}
        />
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-800 text-2xl font-bold text-white">
              {symbol.substring(0, 2)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stock.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{symbol}</p>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{stock.price.toFixed(2)}</span>
                <span className={`flex items-center gap-1 text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  )}
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
              Create Alert
            </button>
            <button
              onClick={addToWatchlist}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${isInWatchlist ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}
            >
              {isInWatchlist ? '✓ Watchlist' : '+ Watchlist'}
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
              Option Chain
            </button>
          </div>
        </div>

        {/* Price Chart */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  chartType === 'line'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('candle')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  chartType === 'candle'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Candle
              </button>
            </div>
          </div>
          <div className="mb-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64">
              {chartType === 'line' ? (
                <polyline
                  fill="none"
                  stroke={isPositive ? "#10b981" : "#ef4444"}
                  strokeWidth="2"
                  points={linePoints}
                />
              ) : (
                history.map((h, i) => renderCandlestick(h, i, history.length))
              )}
            </svg>
          </div>
          <div className="flex flex-wrap gap-2">
            {['1D', '5D', '1M', '3M', '6M', '1Y', '3Y', '5Y', 'ALL'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Content - No tabs, direct display */}
        <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today&apos;s Low</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹{stock.dayLow.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today&apos;s High</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹{stock.dayHigh.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">52W Low</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹{stock.low52.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">52W High</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹{stock.high52.toFixed(2)}</p>
              </div>
            </div>

            {/* More Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Open</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{stock.open.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prev. Close</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{stock.previousClose.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(stock.volume)}</p>
              </div>
            </div>

            {/* Fundamentals */}
            {fundamentals && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Fundamentals</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(fundamentals.marketCap)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">P/E Ratio (TTM)</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fundamentals.peRatio}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">P/B Ratio</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fundamentals.pbRatio}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Industry P/E</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fundamentals.industryPE}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">Debt to Equity</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fundamentals.debtToEquity}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Ratios</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">ROE</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fundamentals.roe}%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">EPS (TTM)</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{fundamentals.eps}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Dividend Yield</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fundamentals.dividendYield}%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Book Value</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{fundamentals.bookValue}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">Face Value</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{fundamentals.faceValue}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financials */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Financials</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFinancialPeriod('quarterly')}
                    className={`px-4 py-2 text-sm rounded-lg ${financialPeriod === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700'}`}
                  >
                    Quarterly
                  </button>
                  <button
                    onClick={() => setFinancialPeriod('yearly')}
                    className={`px-4 py-2 text-sm rounded-lg ${financialPeriod === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700'}`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <div className="mb-4 flex gap-2">
                {['revenue', 'profit', 'networth'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFinancialType(type)}
                    className={`px-4 py-2 text-sm capitalize rounded-lg ${financialType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-5 gap-4">
                  {financials.map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div className="bg-green-500 h-32 rounded-t" style={{ height: `${(item.value / Math.max(...financials.map(f => f.value))) * 200}px` }}></div>
                      <p className="mt-2 text-xs font-semibold text-gray-900 dark:text-white">{formatCurrency(item.value)}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{item.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About {stock.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {stock.name} is one of the leading companies in the Indian market, operating across multiple sectors including 
                telecommunications, retail, petrochemicals, and refining. The company has established itself as a significant 
                player in the global market with a strong focus on innovation and growth.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}


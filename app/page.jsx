import TopGainersLosers from "./components/TopGainersLosers";
import UpcomingIPOs from "./components/UpcomingIPOs";
import PastIPOs from "./components/PastIPOs";
import BitcoinMarket from "./components/BitcoinMarket";
import NewsSection from "./components/NewsSection";
import Footer from "./components/Footer";
import MarketSummary from "./components/MarketSummary";
import MarketIndices from "./components/MarketIndices";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-[600px] overflow-hidden">
      {/* Hero Section with Background */}
      <div className="relative h-[600px] w-full bg-linear-to-br from-gray-900 via-blue-900 to-gray-900">
        {/* Pattern overlay for texture */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V4h4V2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V4h4V2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <div className="max-w-4xl">
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Track Your Stocks
            </h1>
            <p className="mb-8 text-xl text-gray-300 sm:text-2xl">
              Real-time stock market data, portfolio tracking, and intelligent insights
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard" className="w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto text-center">
                Get Started
              </Link>
              <Link href="/markets" className="w-full rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto text-center">
                View Markets
              </Link>
            </div>
          </div>
        </div>

        {/* Stock chart visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
          <svg viewBox="0 0 1200 120" className="h-full w-full">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M0,100 Q150,60 300,70 T600,40 T900,30 T1200,20"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <path
              d="M0,100 Q150,60 300,70 T600,40 T900,30 T1200,20 L1200,100 Z"
              fill="url(#gradient)"
            />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Real-Time Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant stock prices and market data updates as they happen
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Portfolio Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your investments and track performance over time
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Market Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced analytics and trends to help you make informed decisions
              </p>
            </div>
          </div>
        </div>
      </div>

    

      {/* Market Summary Section */}
      <MarketSummary />

      {/* Market Indices Section */}
      <MarketIndices />

      {/* Top Gainers & Losers Section */}
      <TopGainersLosers />

      {/* Upcoming IPOs Section */}
      <UpcomingIPOs />

      {/* Past IPOs Section */}
      <PastIPOs />

      {/* News Section */}
      <NewsSection />
    </main>
  );
}



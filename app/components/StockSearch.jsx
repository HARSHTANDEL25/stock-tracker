// 'use client';

// import { useState } from 'react';

// export default function StockSearch() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;

//     setLoading(true);
//     try {
//       // Simulate search - in production, connect to real stock search API
//       // For now, show popular Indian stocks
//       const popularStocks = [
//         { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2456.80, change: 2.45 },
//         { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3421.50, change: 1.85 },
//         { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1645.20, change: -0.75 },
//         { symbol: 'INFY', name: 'Infosys Ltd.', price: 1525.60, change: 1.25 },
//         { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 978.40, change: 0.95 },
//       ];

//       const filtered = popularStocks.filter(
//         stock => stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                  stock.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//       setResults(filtered);
//     } catch (err) {
//       console.error('Error searching:', err);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 py-20 dark:bg-gray-900">
//       <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
//         <div className="mb-12 text-center">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
//             Stock Search
//           </h2>
//           <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
//             Search for stocks and get real-time quotes
//           </p>
//         </div>

//         <form onSubmit={handleSearch} className="mb-8">
//           <div className="relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by symbol or company name (e.g., RELIANCE, TCS)"
//               className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
//             />
//             <svg
//               className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? 'Searching...' : 'Search'}
//           </button>
//         </form>

//         {results.length > 0 && (
//           <div className="space-y-3">
//             {results.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//                       {stock.symbol}
//                     </h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       {stock.name}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xl font-bold text-gray-900 dark:text-white">
//                       ₹{stock.price.toFixed(2)}
//                     </p>
//                     <p className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                       {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {searchQuery && results.length === 0 && !loading && (
//           <div className="text-center py-8">
//             <p className="text-gray-500 dark:text-gray-400">
//               No results found for &quot;{searchQuery}&quot;
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


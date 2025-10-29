'use client';

import { useState, useEffect } from 'react';

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/news');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setArticles(data.articles || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Refresh every hour
    const interval = setInterval(fetchNews, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return 'Just now';
    }
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Loading news...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Latest News
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Stay updated with the latest financial and market news
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-300 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {article.source}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {truncateText(article.description)}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Read more
                  <svg 
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No news articles available at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clearCache, getCacheStats } from '../services/api';

const CacheManager = () => {
  const [cacheStats, setCacheStats] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState('');

  const loadStats = async () => {
    try {
      const stats = await getCacheStats();
      setCacheStats(stats);
    } catch (err) {
      console.error('Failed to load cache stats:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearCache = async () => {
    if (!window.confirm('Are you sure you want to clear all cached analysis results?')) {
      return;
    }

    setIsClearing(true);
    setMessage('');

    try {
      const result = await clearCache();
      setMessage(result.message || 'Cache cleared successfully!');
      await loadStats();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Cache Management</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cached Results</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {cacheStats?.cached_results ?? '...'}
          </p>
        </div>
        
        <button
          onClick={handleClearCache}
          disabled={isClearing || cacheStats?.cached_results === 0}
          className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isClearing ? 'Clearing...' : 'Clear Cache'}
        </button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-sm ${
            message.includes('Error')
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
          }`}
        >
          {message}
        </motion.div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Clearing cache will remove all stored analysis results. Future analyses will be slower until cache rebuilds.
      </p>
    </motion.div>
  );
};

export default CacheManager;

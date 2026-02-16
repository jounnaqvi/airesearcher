'use client';

import { useEffect, useState } from 'react';

interface ServiceStatus {
  status: string;
  message?: string;
  timestamp?: string;
}

interface Status {
  backend: ServiceStatus;
  database: ServiceStatus;
  gemini: ServiceStatus;
}

export default function StatusPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Failed to fetch status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return '✓';
      case 'error':
        return '✕';
      default:
        return '?';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          System Status
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Check the health of all system components
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Service Health
          </h2>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {lastChecked && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Last checked: {lastChecked.toLocaleString()}
          </p>
        )}

        {loading && !status ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-slate-600 dark:text-slate-300">Checking system status...</p>
            </div>
          </div>
        ) : status ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${getStatusBg(status.backend.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${getStatusColor(status.backend.status)}`}>
                    {getStatusIcon(status.backend.status)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Backend Service
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Next.js API Routes
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${getStatusColor(status.backend.status)}`}>
                  {status.backend.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${getStatusBg(status.database.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${getStatusColor(status.database.status)}`}>
                    {getStatusIcon(status.database.status)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Database
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Supabase PostgreSQL
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${getStatusColor(status.database.status)}`}>
                  {status.database.status.toUpperCase()}
                </span>
              </div>
              {status.database.message && (
                <p className="text-sm text-slate-600 dark:text-slate-400 ml-11">
                  {status.database.message}
                </p>
              )}
            </div>

            <div className={`p-4 rounded-lg border ${getStatusBg(status.gemini.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${getStatusColor(status.gemini.status)}`}>
                    {getStatusIcon(status.gemini.status)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      AI Service
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Google Gemini 1.5 Flash
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${getStatusColor(status.gemini.status)}`}>
                  {status.gemini.status.toUpperCase()}
                </span>
              </div>
              {status.gemini.message && (
                <p className="text-sm text-slate-600 dark:text-slate-400 ml-11">
                  {status.gemini.message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-300">
              Unable to fetch status. Please try again.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
          About This Page
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          This status page monitors the health of all critical system components. If any service shows an error status,
          the application may not function correctly. Contact support if issues persist.
        </p>
      </div>
    </div>
  );
}

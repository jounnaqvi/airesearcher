'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ResearchBrief {
  id: string;
  urls: string[];
  summary: string;
  topic_tags: string[];
  created_at: string;
}

export default function HistoryPage() {
  const [briefs, setBriefs] = useState<ResearchBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/research-briefs?limit=5');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch history');
        }

        setBriefs(data.briefs);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-600 dark:text-slate-300">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Research Brief History
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          View your recently generated research briefs
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {briefs.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No Research Briefs Yet
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Create your first research brief to get started
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Create Research Brief
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {briefs.map((brief) => (
            <Link
              key={brief.id}
              href={`/brief/${brief.id}`}
              className="block bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-[1.01]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {new Date(brief.created_at).toLocaleDateString()} at {new Date(brief.created_at).toLocaleTimeString()}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                    {brief.summary}
                  </p>
                </div>
                <svg
                  className="w-6 h-6 text-slate-400 dark:text-slate-500 flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {brief.topic_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {brief.topic_tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {brief.topic_tags.length > 3 && (
                    <span className="px-2 py-1 text-slate-600 dark:text-slate-400 text-xs">
                      +{brief.topic_tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="text-sm text-slate-500 dark:text-slate-400">
                {brief.urls.length} source{brief.urls.length !== 1 ? 's' : ''}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
        >
          Create New Brief
        </Link>
      </div>
    </div>
  );
}

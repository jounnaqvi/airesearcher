'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urlList.length === 0) {
      setError('Please enter at least one URL');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/research-briefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate research brief');
      }

      router.push(`/brief/${data.brief.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Research Brief Builder
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Generate comprehensive research briefs from multiple sources
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="urls"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
            >
              Enter URLs (one per line, 5-10 URLs recommended)
            </label>
            <textarea
              id="urls"
              rows={10}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://example.com/article1&#10;https://example.com/article2&#10;https://example.com/article3"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={loading}
            />
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Paste URLs from articles, research papers, or web pages you want to analyze
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Research Brief...
              </span>
            ) : (
              'Generate Research Brief'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            How it works
          </h2>
          <ol className="space-y-2 text-slate-600 dark:text-slate-300">
            <li className="flex items-start">
              <span className="font-bold mr-2 text-blue-600 dark:text-blue-400">1.</span>
              <span>Paste URLs from articles, research papers, or web pages</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-blue-600 dark:text-blue-400">2.</span>
              <span>Content is automatically scraped and analyzed using AI</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-blue-600 dark:text-blue-400">3.</span>
              <span>Get a comprehensive research brief with key points, citations, and more</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

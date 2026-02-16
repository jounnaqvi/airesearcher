'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Citation {
  source: string;
  snippet: string;
  used_for: string;
}

interface ResearchBrief {
  id: string;
  urls: string[];
  summary: string;
  key_points: string[];
  conflicting_claims: string[];
  what_to_verify: string[];
  citations: Citation[];
  topic_tags: string[];
  created_at: string;
}

export default function BriefPage() {
  const params = useParams();
  const [brief, setBrief] = useState<ResearchBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const response = await fetch(`/api/research-briefs/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch research brief');
        }

        setBrief(data.brief);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBrief();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-600 dark:text-slate-300">Loading research brief...</p>
        </div>
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Error</h2>
          <p className="text-red-600 dark:text-red-400">{error || 'Research brief not found'}</p>
          <Link href="/" className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Research Brief
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generated on {new Date(brief.created_at).toLocaleDateString()} at {new Date(brief.created_at).toLocaleTimeString()}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Summary
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {brief.summary}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Key Points
          </h2>
          <ul className="space-y-2">
            {brief.key_points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <span className="text-slate-700 dark:text-slate-300 flex-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {brief.conflicting_claims.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Conflicting Claims
            </h2>
            <ul className="space-y-2">
              {brief.conflicting_claims.map((claim, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-1">!</span>
                  <span className="text-slate-700 dark:text-slate-300 flex-1">{claim}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {brief.what_to_verify.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              What to Verify
            </h2>
            <ul className="space-y-2">
              {brief.what_to_verify.map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 font-bold mt-1">?</span>
                  <span className="text-slate-700 dark:text-slate-300 flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Citations
          </h2>
          <div className="space-y-4">
            {brief.citations.map((citation, index) => (
              <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="mb-2">
                  <a
                    href={citation.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
                  >
                    {citation.source}
                  </a>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic mb-2 pl-4 border-l-2 border-slate-300 dark:border-slate-600">
                  {citation.snippet}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Used for:</span> {citation.used_for}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            Topic Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {brief.topic_tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            Source URLs
          </h2>
          <ul className="space-y-2">
            {brief.urls.map((url, index) => (
              <li key={index}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          href="/"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all"
        >
          Create New Brief
        </Link>
        <Link
          href="/history"
          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all"
        >
          View History
        </Link>
      </div>
    </div>
  );
}

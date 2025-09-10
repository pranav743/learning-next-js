'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-red-800 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-red-600 mb-6">
          {error.message || 'An unexpected error occurred while loading this blog post.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/blog"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to Blog
          </Link>
          <Link
            href="/"
            className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors shadow-md"
          >
            Go Home
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-gray-600">
        <p className="text-sm">
          If this problem persists, please{' '}
          <Link href="/contact" className="text-slate-700 hover:text-slate-600">
            contact us
          </Link>
          {' '}for assistance.
        </p>
      </div>
    </div>
  );
}

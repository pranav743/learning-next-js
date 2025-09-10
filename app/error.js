'use client';

import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white border border-red-200 rounded-lg p-8 shadow-lg">
              <div className="text-6xl mb-6">💥</div>
              <h1 className="text-3xl font-bold text-red-800 mb-4">
                Something went terribly wrong!
              </h1>
              <p className="text-red-600 mb-6">
                {error?.message || 'An unexpected error occurred in the application.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reset}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
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
                If this problem persists, please refresh the page or contact support.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

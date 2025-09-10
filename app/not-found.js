import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          The blog post you requested doesn't exist or may have been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors shadow-md"
          >
            Go Home
          </Link>
          <Link
            href="/blog"
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
          >
            Browse Blog
          </Link>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Looking for something specific?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <Link
            href="/about"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <h3 className="font-semibold text-gray-900 mb-2">About Us</h3>
            <p className="text-gray-600 text-sm">Learn more about our mission and team</p>
          </Link>
          <Link
            href="/contact"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
            <p className="text-gray-600 text-sm">Get in touch with us</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

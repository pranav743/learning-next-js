import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Welcome to Mini Blog
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Discover amazing stories, insights, and ideas from our community
        </p>
        <Link
          href="/blog"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md"
        >
          Read Our Blog
        </Link>
      </div>

      {/* Featured Content */}
      <div className="grid md:grid-cols-2 gap-8 mt-16">
        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-foreground mb-3">Latest Posts</h2>
          <p className="text-gray-700 mb-4">
            Stay up to date with our latest blog posts covering technology, lifestyle, and more.
          </p>
          <Link
            href="/blog"
            className="text-primary font-semibold hover:text-blue-600"
          >
            View all posts →
          </Link>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-foreground mb-3">About Us</h2>
          <p className="text-gray-700 mb-4">
            Learn more about our mission and the team behind this blog.
          </p>
          <Link
            href="/about"
            className="text-primary font-semibold hover:text-blue-600"
          >
            Learn more →
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 mt-16 text-center">
        <div className="bg-background rounded-lg shadow-md p-6 border border-gray-100">
          <div className="text-3xl font-bold text-primary mb-2">50+</div>
          <div className="text-gray-700">Blog Posts</div>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6 border border-gray-100">
          <div className="text-3xl font-bold text-primary mb-2">1000+</div>
          <div className="text-gray-700">Readers</div>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6 border border-gray-100">
          <div className="text-3xl font-bold text-primary mb-2">5</div>
          <div className="text-gray-700">Categories</div>
        </div>
      </div>
    </div>
  );
}

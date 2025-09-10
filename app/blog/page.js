import Link from 'next/link';
import { getAllPosts } from '../lib/blogData';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">Our Blog</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Discover insights, tutorials, and stories from our community of writers and developers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="h-48 bg-gray-200"></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-blue-100 text-primary text-sm px-3 py-1 rounded-full border border-blue-200">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
              
              <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                <Link 
                  href={`/blog/${post.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-700 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{post.author}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <Link
                  href={`/blog/${post.id}`}
                  className="text-primary hover:text-blue-600 font-medium text-sm"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>      {/* Newsletter Signup */}
      <div className="bg-gray-100 rounded-lg p-8 mt-16 text-center border border-gray-200">
        <h2 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h2>
        <p className="text-gray-700 mb-6">
          Subscribe to our newsletter to get the latest posts delivered to your inbox.
        </p>
        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="bg-primary text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition-colors shadow-md">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

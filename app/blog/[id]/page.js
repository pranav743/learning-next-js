import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostById } from '../../lib/blogData';

export default function BlogPost({ params }) {
  const { id } = params;
  
  // Trigger error for id > 5
  if (parseInt(id) > 5) {
    throw new Error(`Blog post with ID ${id} is not available. We currently only support posts with IDs 1-5.`);
  }
  
  const post = getPostById(id);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back to Blog */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-blue-600"
        >
          ← Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="bg-background rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="h-64 bg-gray-200"></div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-block bg-blue-100 text-primary text-sm px-3 py-1 rounded-full border border-blue-200">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
            <div>
              <p className="font-medium text-foreground">{post.author}</p>
              <p className="text-sm text-gray-500">
                Published on {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8 font-medium">
              {post.excerpt}
            </p>
            
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>
        </div>
      </article>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 p-6 bg-gray-100 rounded-lg border border-gray-200">
        <div>
          <Link
            href="/blog"
            className="text-primary hover:text-blue-600 font-medium"
          >
            ← All Posts
          </Link>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-700">Enjoyed this post?</p>
          <Link
            href="/contact"
            className="text-primary hover:text-blue-600 font-medium"
          >
            Get in touch
          </Link>
        </div>
        <div>
          <Link
            href="/"
            className="text-primary hover:text-blue-600 font-medium"
          >
            Home →
          </Link>
        </div>
      </div>
    </div>
  );
}

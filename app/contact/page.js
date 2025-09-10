export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          We'd love to hear from you! Get in touch with us for any questions, 
          feedback, or collaboration opportunities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-16">
        {/* Contact Form */}
        <div className="bg-background rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What's this about?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us more about your message..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Get in touch</h2>
          <div className="space-y-8">
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-foreground mb-3">Email Us</h3>
              <p className="text-gray-700 mb-2">
                For general inquiries and support
              </p>
              <a
                href="mailto:hello@miniblog.com"
                className="text-blue-500 font-medium hover:text-blue-600"
              >
                hello@miniblog.com
              </a>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-foreground mb-3">Response Time</h3>
              <p className="text-gray-700">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow Us</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with our latest posts and announcements
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-slate-700 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-slate-700 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-slate-700 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 bg-white rounded-lg shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How often do you publish new posts?
            </h3>
            <p className="text-gray-600">
              We publish new content weekly, covering various topics in technology, 
              lifestyle, and personal development.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I contribute to the blog?
            </h3>
            <p className="text-gray-600">
              Yes! We welcome guest contributors. Please reach out to us with your 
              ideas and writing samples.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Do you offer newsletter subscriptions?
            </h3>
            <p className="text-gray-600">
              Absolutely! You can subscribe to our newsletter from any blog page 
              to get updates delivered to your inbox.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How can I report technical issues?
            </h3>
            <p className="text-gray-600">
              Please use the contact form above or email us directly with details 
              about any technical problems you encounter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

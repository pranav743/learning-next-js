export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">About Mini Blog</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          We are passionate storytellers dedicated to sharing valuable insights, 
          experiences, and knowledge with our community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-16">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At Mini Blog, we believe in the power of storytelling to inspire, educate, 
            and connect people from all walks of life. Our mission is to create a 
            platform where diverse voices can share their experiences and insights.
          </p>
          <p className="text-gray-700">
            Whether you're looking for technical tutorials, lifestyle tips, or 
            thought-provoking articles, you'll find content that resonates with 
            your interests and helps you grow.
          </p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-foreground mb-4">What We Cover</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Technology & Programming
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Lifestyle & Wellness
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Career Development
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Travel & Adventure
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Personal Growth
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-8 mt-16 border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Community</h2>
          <p className="text-gray-700 mb-6">
            Be part of a growing community of readers and writers who are passionate 
            about sharing knowledge and experiences.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-sm text-gray-700">Active Readers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-gray-700">Published Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-gray-700">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

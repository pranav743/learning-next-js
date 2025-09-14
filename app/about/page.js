import Link from "next/link"

export const revalidate = 60

async function getAboutData() {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    title: "About Our Platform",
    description: "Building the future of project management with cutting-edge technology.",
    features: [
      {
        title: "Advanced Analytics",
        description: "Real-time insights into your project performance with detailed analytics and reporting.",
        icon: "📊"
      },
      {
        title: "Team Collaboration",
        description: "Seamless collaboration tools that keep your team connected and productive.",
        icon: "👥"
      },
      {
        title: "Secure Authentication",
        description: "Enterprise-grade security with multiple authentication options including OAuth.",
        icon: "🔒"
      },
      {
        title: "Performance Optimized",
        description: "Lightning-fast performance with server-side rendering and optimized assets.",
        icon: "⚡"
      }
    ],
    stats: {
      users: "10,000+",
      projects: "50,000+",
      uptime: "99.9%",
      countries: "120+"
    },
    lastUpdated: new Date().toISOString()
  }
}

export default async function About() {
  const data = await getAboutData()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                Dashboard Pro
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-500 hover:text-gray-700">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {data.title}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {data.stats && Object.entries(data.stats).map(([key, value], index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{value}</div>
                <div className="mt-2 text-lg font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {data.features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-indigo-50 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of teams already using our platform to manage their projects more effectively.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Start Free Trial
              </Link>
              <Link
                href="/dashboard"
                className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md text-lg font-medium"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </div>
      </main>
    </div>
  )
}

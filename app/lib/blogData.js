// Sample blog data
export const blogPosts = [
  {
    id: '1',
    title: 'Getting Started with Next.js 14',
    excerpt: 'Learn the fundamentals of Next.js 14 and discover the new App Router features that make building React applications more efficient.',
    content: `
      Next.js 14 introduces several exciting features that enhance the developer experience and application performance. 
      The App Router, built on React Server Components, provides a new way to structure your applications with improved 
      data fetching and routing capabilities.

      ## Key Features

      1. **App Router**: A new routing system based on the file system
      2. **Server Components**: Render components on the server for better performance
      3. **Improved bundling**: Turbopack integration for faster builds
      4. **Enhanced Image optimization**: Better loading and performance

      ## Getting Started

      To create a new Next.js 14 project, run:

      \`\`\`bash
      npx create-next-app@latest my-app
      \`\`\`

      This will set up a new project with all the latest features and best practices.

      ## Conclusion

      Next.js 14 represents a significant step forward in React development, offering improved performance, 
      better developer experience, and more efficient application architecture.
    `,
    author: 'John Doe',
    publishedAt: '2024-01-15',
    category: 'Technology',
    readTime: '5 min read',
    image: '/api/placeholder/800/400'
  },
  {
    id: '2',
    title: 'Mastering Tailwind CSS',
    excerpt: 'Discover advanced techniques and best practices for using Tailwind CSS to create beautiful, responsive web interfaces.',
    content: `
      Tailwind CSS has revolutionized how we approach styling in modern web development. Its utility-first approach 
      allows for rapid prototyping and consistent design systems across projects.

      ## Why Tailwind CSS?

      - **Utility-first**: Build designs using small, composable utilities
      - **Responsive**: Mobile-first responsive design made easy
      - **Customizable**: Highly customizable through configuration
      - **Performance**: Purge unused styles for optimal bundle size

      ## Advanced Techniques

      ### Custom Components
      Create reusable component classes using @apply directive:

      \`\`\`css
      .btn-primary {
        @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
      }
      \`\`\`

      ### Dynamic Classes
      Use template literals for dynamic styling:

      \`\`\`javascript
      const buttonClass = \`bg-\${color}-500 hover:bg-\${color}-700\`;
      \`\`\`

      ## Best Practices

      1. Use consistent spacing scales
      2. Leverage design tokens for colors
      3. Create component libraries for reusability
      4. Use responsive prefixes thoughtfully

      Start incorporating these techniques into your next project and see the difference!
    `,
    author: 'Jane Smith',
    publishedAt: '2024-01-12',
    category: 'Design',
    readTime: '7 min read',
    image: '/api/placeholder/800/400'
  },
  {
    id: '3',
    title: 'Building Modern React Applications',
    excerpt: 'Explore the latest React patterns and tools for building scalable, maintainable applications in 2024.',
    content: `
      React continues to evolve, and staying up-to-date with the latest patterns and practices is crucial for 
      building modern, efficient applications.

      ## Modern React Patterns

      ### Server Components
      React Server Components allow you to render components on the server, reducing client-side JavaScript 
      and improving performance.

      ### Concurrent Features
      React 18 introduced concurrent features like:
      - Automatic batching
      - Transitions
      - Suspense improvements

      ## State Management

      Choose the right state management solution:

      - **useState/useReducer**: For local component state
      - **Context API**: For global state in smaller apps
      - **Zustand**: Lightweight external state management
      - **Redux Toolkit**: For complex state logic

      ## Performance Optimization

      1. **Code Splitting**: Use React.lazy() and Suspense
      2. **Memoization**: Leverage useMemo and useCallback
      3. **Virtual Scrolling**: For large lists
      4. **Bundle Analysis**: Monitor and optimize bundle size

      ## Testing Strategy

      Implement a comprehensive testing strategy:

      - Unit tests with Jest and React Testing Library
      - Integration tests for component interactions
      - E2E tests with Playwright or Cypress

      The React ecosystem continues to mature, providing developers with powerful tools for creating 
      exceptional user experiences.
    `,
    author: 'Mike Johnson',
    publishedAt: '2024-01-10',
    category: 'Technology',
    readTime: '8 min read',
    image: '/api/placeholder/800/400'
  },
  {
    id: '4',
    title: 'The Future of Web Development',
    excerpt: 'Discover emerging trends and technologies that will shape the future of web development in the coming years.',
    content: `
      Web development is rapidly evolving, with new technologies and paradigms emerging that promise to 
      transform how we build and deploy applications.

      ## Emerging Technologies

      ### WebAssembly (WASM)
      WebAssembly enables near-native performance in web browsers, opening up new possibilities for 
      web applications:

      - High-performance computing in the browser
      - Porting desktop applications to the web
      - Running multiple programming languages client-side

      ### Edge Computing
      Moving computation closer to users for better performance:

      - Reduced latency
      - Improved user experience
      - Better scalability

      ## Development Trends

      ### JAMstack Evolution
      The JAMstack approach continues to evolve with:
      - Static site generation improvements
      - Better API integration
      - Enhanced developer experience

      ### AI-Powered Development
      Artificial intelligence is changing how we code:
      - Code completion and generation
      - Automated testing
      - Bug detection and fixing

      ## Future Predictions

      1. **Progressive Web Apps** will become indistinguishable from native apps
      2. **No-code/Low-code** platforms will democratize development
      3. **Voice interfaces** will become more prevalent
      4. **AR/VR** will integrate more deeply with web technologies

      ## Preparing for the Future

      To stay relevant in the evolving landscape:

      - Continuously learn new technologies
      - Focus on fundamental computer science concepts
      - Practice building diverse types of applications
      - Engage with the developer community

      The future of web development is exciting, with endless possibilities for innovation and creativity.
    `,
    author: 'Sarah Wilson',
    publishedAt: '2024-01-08',
    category: 'Technology',
    readTime: '6 min read',
    image: '/api/placeholder/800/400'
  },
  {
    id: '5',
    title: 'Productivity Tips for Developers',
    excerpt: 'Practical strategies and tools to boost your productivity as a developer and maintain work-life balance.',
    content: `
      Developer productivity isn't just about writing code faster—it's about working smarter, maintaining quality, 
      and achieving a sustainable work-life balance.

      ## Time Management

      ### The Pomodoro Technique
      Break work into focused 25-minute intervals:

      1. Choose a task
      2. Work for 25 minutes
      3. Take a 5-minute break
      4. Repeat 3-4 cycles, then take a longer break

      ### Time Blocking
      Schedule specific blocks of time for different activities:
      - Deep work sessions
      - Code reviews
      - Learning time
      - Administrative tasks

      ## Development Environment

      ### IDE Optimization
      Customize your development environment:

      - Learn keyboard shortcuts
      - Install productivity extensions
      - Configure code snippets
      - Set up efficient debugging workflows

      ### Terminal Mastery
      Become proficient with command-line tools:
      - Git aliases for common operations
      - Shell scripting for repetitive tasks
      - Terminal multiplexers like tmux

      ## Code Quality Practices

      ### Automation
      Automate repetitive tasks:

      - Code formatting with Prettier
      - Linting with ESLint
      - Testing with CI/CD pipelines
      - Deployment automation

      ### Documentation
      Maintain good documentation:
      - Code comments for complex logic
      - README files for projects
      - API documentation
      - Decision records

      ## Health and Well-being

      ### Physical Health
      - Take regular breaks
      - Maintain good posture
      - Exercise regularly
      - Stay hydrated

      ### Mental Health
      - Set boundaries between work and personal time
      - Practice stress management techniques
      - Engage in hobbies outside of coding
      - Build supportive relationships

      ## Continuous Learning

      Stay updated and grow your skills:

      - Follow industry blogs and newsletters
      - Attend conferences and meetups
      - Contribute to open source projects
      - Experiment with new technologies

      Remember, productivity is a journey, not a destination. Find what works for you and adjust as needed.
    `,
    author: 'Alex Chen',
    publishedAt: '2024-01-05',
    category: 'Lifestyle',
    readTime: '9 min read',
    image: '/api/placeholder/800/400'
  }
];

export function getAllPosts() {
  return blogPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

export function getPostById(id) {
  return blogPosts.find(post => post.id === id);
}

export function getPostsByCategory(category) {
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

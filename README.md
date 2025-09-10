# Mini Blog Website

A modern blog website built with Next.js 14, featuring the App Router, Tailwind CSS, and a clean, responsive design.

## Features

### 🏠 Pages & Navigation
- **Home Page**: Welcome page with featured content and quick stats
- **About Page**: Information about the blog and its mission
- **Contact Page**: Contact form and information
- **Blog Page**: List of all blog posts with categories and metadata
- **Navigation**: Responsive navigation bar with active state highlighting

### 📝 Blog System
- **Blog Listing**: Grid layout showing all blog posts with excerpts
- **Dynamic Routing**: Individual blog post pages using `/blog/[id]` routes
- **Rich Content**: Full blog posts with formatted content and metadata
- **Categories**: Blog posts organized by categories (Technology, Design, Lifestyle)

### ⚠️ Error Handling
- **Custom 404 Page**: Styled not-found page with helpful navigation
- **Error Boundaries**: Custom error pages for handling runtime errors
- **ID Validation**: Automatic error triggering for blog post IDs greater than 5

### 🎨 Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Clean UI**: Minimal, professional design with consistent spacing and typography
- **Interactive Elements**: Hover effects, transitions, and focus states

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Package Manager**: Yarn
- **Language**: JavaScript (no TypeScript)
- **Deployment**: Ready for Vercel/Netlify deployment

## Project Structure

```
app/
├── components/
│   └── Navigation.js          # Main navigation component
├── lib/
│   └── blogData.js           # Sample blog data and utilities
├── blog/
│   ├── page.js               # Blog listing page
│   └── [id]/
│       ├── page.js           # Dynamic blog post page
│       └── error.js          # Blog-specific error handling
├── about/
│   └── page.js               # About page
├── contact/
│   └── page.js               # Contact page
├── layout.js                 # Root layout with navigation
├── page.js                   # Home page
├── not-found.js              # Custom 404 page
├── error.js                  # Global error boundary
└── globals.css               # Global styles and utilities
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Start the development server**
   ```bash
   yarn dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Features Demonstration

### Navigation
- Visit different pages using the navigation bar
- Notice active state highlighting for current page

### Blog System
1. Go to `/blog` to see all posts
2. Click on any post to view full content
3. Try visiting `/blog/6` or higher to see error handling
4. Visit `/blog/nonexistent` to see 404 page

### Error Handling
- **404 Errors**: Visit any non-existent route (e.g., `/nonexistent`)
- **Runtime Errors**: Visit `/blog/6` to trigger error boundary
- **Error Recovery**: Use retry buttons to recover from errors

### Responsive Design
- Resize your browser window to see responsive behavior
- Test on mobile devices for optimal mobile experience

## Sample Content

The blog includes 5 sample posts covering:
- Next.js development
- Tailwind CSS techniques
- React best practices
- Web development trends
- Developer productivity

Each post includes:
- Title and excerpt
- Author and publication date
- Category and reading time
- Full formatted content
- Navigation between posts

## Customization

### Adding New Blog Posts
Edit `app/lib/blogData.js` to add new posts to the `blogPosts` array.

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind classes throughout components
- Customize the color scheme by updating CSS variables

### Content
- Replace sample content with your own
- Update contact information in the contact page
- Modify about page content to reflect your story

## Deployment

The application is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Digital Ocean**

Simply connect your repository and deploy!

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

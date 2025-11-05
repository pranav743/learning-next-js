
# Learning Next.js – Modular & Scalable Structure

This project demonstrates a scalable and modular [Next.js](https://nextjs.org) application. The codebase is organized for maintainability and reusability, using shared components and clear separation of concerns.

## Getting Started


## Getting Started

Install dependencies with Yarn:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Build for production:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Project Structure

```
src/
	app/
		layout.js
		todos-csr/
			page.jsx
		todos-isr/
			page.jsx
		todos-ssg/
			page.jsx
		todos-ssr/
			page.jsx
	components/
		TodosList.jsx
		RenderTime.jsx
```

- **components/**: Contains reusable UI components used across multiple pages.
- **app/**: Contains route segments and page components for different rendering strategies (CSR, ISR, SSG, SSR).

All todo pages now use the shared `TodosList` and `RenderTime` components for consistency and maintainability.


## Adding New Features

- Add new UI elements as components in `src/components`.
- Keep page logic focused on data fetching and orchestration.
- Import and reuse components to keep code DRY and modular.


## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# Learning Next.js – Modular & Scalable Structure

This project demonstrates a scalable and modular [Next.js](https://nextjs.org) application. It showcases different rendering strategies (CSR, SSR, SSG, ISR) using a clean, maintainable structure with reusable components.


## Getting Started

1. **Install dependencies**

	```bash
	yarn install
	```

2. **Run the development server**

	```bash
	yarn dev
	```

	Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**

	```bash
	yarn build
	```

4. **Start the production server**

	```bash
	yarn start
	```



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

- `components/`: Reusable UI components shared across pages.
- `app/`: Route segments and page components for different rendering strategies.

All todo pages use the shared `TodosList` and `RenderTime` components for consistency and maintainability.

## Rendering Strategies Explained

- **CSR (Client-Side Rendering)**: Data is fetched and rendered in the browser after the page loads.
- **SSR (Server-Side Rendering)**: Data is fetched and rendered on the server for every request.
- **SSG (Static Site Generation)**: Data is fetched and the page is generated at build time.
- **ISR (Incremental Static Regeneration)**: Pages are statically generated and can be updated after deployment at a set interval.

Each strategy is implemented in its own route under `src/app/`.



## Adding New Features

- Add new UI elements as components in `src/components`.
- Keep page logic focused on data fetching and orchestration.
- Import and reuse components to keep code DRY and modular.



## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)


## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

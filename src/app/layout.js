export const metadata = {
  title: "Rendering Strategies Demo",
  description: "CSR, SSR, SSG, ISR in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <a href="/todos-csr" style={{ marginRight: "15px" }}>CSR</a>
          <a href="/todos-ssr" style={{ marginRight: "15px" }}>SSR</a>
          <a href="/todos-ssg" style={{ marginRight: "15px" }}>SSG</a>
          <a href="/todos-isr">ISR</a>
        </nav>
        {children}
      </body>
    </html>
  );
}

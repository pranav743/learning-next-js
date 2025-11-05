"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ cartCount }) {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold">ShopLogo</Link>
        <nav className="flex gap-6">
          <Link href="/" className={pathname === '/' ? 'font-semibold' : ''}>Home</Link>
          <Link href="/products" className={pathname === '/products' ? 'font-semibold' : ''}>Products</Link>
          <Link href="/cart" className={pathname === '/cart' ? 'font-semibold' : ''}>
            Cart{cartCount > 0 ? ` (${cartCount})` : ''}
          </Link>
        </nav>
      </div>
    </header>
  );
}

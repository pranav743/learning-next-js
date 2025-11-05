import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-48 min-h-screen px-4 py-6 border-r bg-gray-50 flex flex-col gap-4">
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/cart">Cart</Link>
    </aside>
  );
}

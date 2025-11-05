
import { getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 4);
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg bg-blue-600 text-white px-8 py-12 text-center text-3xl font-bold mb-8">Welcome to Simple E-Commerce</div>
      <div className="mb-4 text-xl font-semibold">Featured Products</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {featured.map(product => (
          <ProductCard key={product.id} product={product} onAdd={() => {}} />
        ))}
      </div>
    </div>
  );
}

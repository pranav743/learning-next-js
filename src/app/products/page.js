import ProductsSidebar from "../../components/ProductsSidebar";
import ProductCard from "../../components/ProductCard";
import { getProducts, addToCart } from "../../lib/api";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();
  async function handleAdd(product) {
    "use server";
    await addToCart({ ...product, quantity: 1 });
    revalidateTag("cart");
  }
  return (
    <div className="flex gap-8">
      <ProductsSidebar />
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
        </div>
      </div>
    </div>
  );
}

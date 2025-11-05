import { getCart, removeFromCart } from "../../lib/api";
import CartItem from "../../components/CartItem";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCart();
  async function handleRemove(id) {
    "use server";
    await removeFromCart(id);
    revalidateTag("cart");
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-2xl font-semibold mb-6">Your Cart</div>
      {cart.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {cart.map(item => (
            <CartItem key={item.id} item={item} onRemove={handleRemove} />
          ))}
          <div className="text-right font-bold text-lg mt-4">Total: ₹{total}</div>
        </div>
      )}
    </div>
  );
}

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-sm">
      <img src={product.image} alt={product.name} className="w-32 h-32 object-contain mb-3" />
      <div className="font-semibold text-lg mb-1">{product.name}</div>
      <div className="text-gray-500 mb-1">₹{product.price}</div>
      <div className="text-xs text-gray-400 mb-2">{product.category}</div>
      <div className="text-yellow-500 mb-2">★ {product.rating}</div>
      <button onClick={() => onAdd(product)} className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add to Cart</button>
    </div>
  );
}

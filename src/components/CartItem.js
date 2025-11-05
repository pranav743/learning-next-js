export default function CartItem({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
        <div>
          <div className="font-semibold">{item.name}</div>
          <div className="text-gray-500">₹{item.price}</div>
          <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
        </div>
      </div>
      <button onClick={() => onRemove(item.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Remove</button>
    </div>
  );
}

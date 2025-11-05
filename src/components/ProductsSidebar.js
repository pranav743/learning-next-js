export default function ProductsSidebar() {
  return (
    <aside className="w-56 px-4 py-6 border-r bg-gray-50 flex flex-col gap-6">
      <div>
        <div className="font-semibold mb-2">Filter</div>
        <div className="flex flex-col gap-2">
          <button className="text-left">Clothing</button>
          <button className="text-left">Footwear</button>
          <button className="text-left">Accessories</button>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Sort</div>
        <div className="flex flex-col gap-2">
          <button className="text-left">Price: Low to High</button>
          <button className="text-left">Price: High to Low</button>
          <button className="text-left">Rating</button>
        </div>
      </div>
    </aside>
  );
}

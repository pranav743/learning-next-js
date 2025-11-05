const API_URL = 'http://localhost:3001';

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, { next: { revalidate: 60, tags: ['products'] } });
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${API_URL}/cart`, { cache: 'no-store' });
  return res.json();
}

export async function addToCart(product) {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function removeFromCart(id) {
  const res = await fetch(`${API_URL}/cart/${id}`, { method: 'DELETE' });
  return res.json();
}

import Image from 'next/image';

export default async function ItemDetailPage({ params }) {
  const { id } = params;
  let item = null;
  let notFound = false;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/items/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      notFound = true;
    } else {
      item = await res.json();
    }
  } catch (err) {
    notFound = true;
  }

  if (notFound || !item) return <div className="text-center py-12 text-red-500">Item not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 mt-15">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Image
            src={item.images?.[0] || '/placeholder.png'}
            alt={item.description || 'Item'}
            width={500}
            height={400}
            className="rounded w-full h-96 object-cover mb-4"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#2C2522] mb-4">{item.category || 'Untitled Item'}</h1>
          <p className="text-lg text-[#4B403D] mb-2">{item.description}</p>
          <div className="mb-2"><b>Condition:</b> {item.condition}</div>
          <div className="mb-2"><b>Size:</b> {item.size}</div>
          <div className="mb-2"><b>Status:</b> {item.status}</div>
          <div className="mb-2"><b>Listed by:</b> {item.userName || item.userEmail || 'Unknown'}</div>
          <div className="mb-2"><b>Listed on:</b> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</div>
        </div>
      </div>
    </div>
  );
} 
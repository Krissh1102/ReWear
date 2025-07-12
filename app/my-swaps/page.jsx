import { currentUser } from '@clerk/nextjs/server';
import Item from '@/lib/models/Item';
import mongoose from 'mongoose';
import Image from 'next/image';

export default async function MySwapsPage() {
  const user = await currentUser();
  if (!user) {
    return <div className="text-center py-12 text-red-500">You must be signed in to view your swaps.</div>;
  }

  // Connect to DB if not already
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const items = await Item.find({ swappedBy: user.id }).lean();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-15">
      <h1 className="text-3xl font-bold text-[#2C2522] mb-6">My Swaps</h1>
      {items.length === 0 ? (
        <div className="text-gray-500">You haven't swapped for any items yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 shadow-sm">
              <Image
                src={item.images?.[0] || "/placeholder.png"}
                alt={item.description || "Item"}
                width={400}
                height={300}
                className="rounded w-full h-60 object-cover mb-4"
              />
              <h3 className="font-semibold text-lg text-[#2C2522] mb-1">
                {item.category || "Untitled Item"}
              </h3>
              <p className="text-sm text-[#4B403D]">{item.description}</p>
              <p className="text-xs text-gray-400">
                Swapped on {item.swappedAt ? new Date(item.swappedAt).toLocaleDateString() : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/navigation";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-15">
      <h1 className="text-3xl font-bold text-[#2C2522] mb-6">Browse Items</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link key={item._id} href={`/items/${item._id}`} className="block">
            <div className="border rounded-lg p-4 shadow-sm">
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
                Listed {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

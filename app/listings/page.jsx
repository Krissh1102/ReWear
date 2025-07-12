"use client";

import Link from "next/link";
import Image from "next/image";

const listings = new Array(10).fill(null).map((_, i) => ({
  id: i,
  title: `Clothing Item #${i + 1}`,
  image: `https://source.unsplash.com/random/400x300?clothing&sig=${i}`,
  description: "Great item in excellent condition.",
}));

export default function MyListingsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 mt-15">
      <div className="sticky top-0 z-10 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(44,37,34)]">
            My Listings
          </h1>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium">
              ⬅ Back
            </button>
          </Link>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={300}
              className="rounded w-full h-60 object-cover mb-4"
            />
            <h3 className="font-semibold text-lg text-[#2C2522] mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-[#4B403D]">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

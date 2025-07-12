"use client";

import { useState } from "react";
import Image from "next/image";

const allItems = new Array(20).fill(null).map((_, i) => ({
  id: i,
  title: `Item ${i + 1}`,
  image: `https://source.unsplash.com/random/400x300?clothing&sig=${i}`,
  category: i % 2 === 0 ? "Men" : "Women",
  description: "Stylish, well-maintained second-hand item.",
}));

export default function ItemsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-15">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#2C2522]">Browse Items</h1>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-4 py-2 w-full sm:w-64 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={300}
                className="rounded w-full h-48 object-cover mb-4"
              />
              <h3 className="font-semibold text-lg text-[#2C2522] mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-[#4B403D] mb-1">{item.category}</p>
              <p className="text-sm text-[#4B403D]">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

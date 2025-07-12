"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const dummyListings = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Clothing Item ${i + 1}`,
  image: `https://source.unsplash.com/random/400x300?clothing&sig=${i}`,
  description: "Good quality, lightly used.",
}));

const dummyPurchases = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Purchased Item ${i + 1}`,
  image: `https://source.unsplash.com/random/400x300?fashion&sig=${i + 20}`,
  description: "Delivered successfully.",
}));

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2522] mb-8 mt-15">
        Welcome, {user.firstName || "ReWear User"} 👋
      </h1>

      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-white border p-6 rounded-lg shadow-sm mb-10">
        <Image
          src={user.imageUrl}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full border"
        />
        <div>
          <p className="text-lg font-medium text-[#2C2522]">{user.fullName}</p>
          <p className="text-[#4B403D] text-sm">
            {user.primaryEmailAddress?.emailAddress}
          </p>
          <p className="mt-2 font-semibold text-green-600">Points: 150</p>
        </div>
      </div>

      {/* Listings Preview */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#2C2522]">My Listings</h2>
          <Link href="/listings">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-6 w-max">
            {dummyListings.map((item) => (
              <div key={item.id} className="min-w-[260px] border rounded-lg p-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="rounded w-full h-48 object-cover mb-4"
                />
                <h3 className="font-bold text-lg text-[#2C2522] mb-1">{item.title}</h3>
                <p className="text-sm text-[#4B403D]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchases Preview */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#2C2522]">My Purchases</h2>
          <Link href="/purchases">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-6 w-max">
            {dummyPurchases.map((item) => (
              <div key={item.id} className="min-w-[260px] border rounded-lg p-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="rounded w-full h-48 object-cover mb-4"
                />
                <h3 className="font-bold text-lg text-[#2C2522] mb-1">{item.title}</h3>
                <p className="text-sm text-[#4B403D]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

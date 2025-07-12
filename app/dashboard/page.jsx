"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const dummyPurchases = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Purchased Item ${i + 1}`,
  image: `https://source.unsplash.com/random/400x300?fashion&sig=${i + 20}`,
  description: "Delivered successfully.",
}));

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const itemsRef = collection(db, "users", user.id, "items");
        const q = query(itemsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchListings();
    }
  }, [isLoaded, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'swapped':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

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
        <div className="text-center sm:text-left">
          <p className="text-lg font-medium text-[#2C2522]">{user.fullName}</p>
          <p className="text-[#4B403D] text-sm">
            {user.primaryEmailAddress?.emailAddress}
          </p>
          <p className="mt-2 font-semibold text-green-600">Points: 150</p>
          <p className="text-sm text-gray-500 mt-1">
            Total Items: {items.length}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <Link href="/create-listing">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors cursor-pointer">
            <h3 className="font-semibold text-blue-900 mb-2">Add New Item</h3>
            <p className="text-sm text-blue-700">List a new item for swapping</p>
          </div>
        </Link>
        <Link href="/items">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors cursor-pointer">
            <h3 className="font-semibold text-green-900 mb-2">Browse Items</h3>
            <p className="text-sm text-green-700">Find items to swap</p>
          </div>
        </Link>
        {/* <Link href="/profile">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition-colors cursor-pointer">
            <h3 className="font-semibold text-purple-900 mb-2">My Profile</h3>
            <p className="text-sm text-purple-700">Update your information</p>
          </div>
        </Link> */}
      </div>

      {/* Listings Preview */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#2C2522]">My Listings</h2>
          <Link href="/listings">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading your items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No items listed yet.</p>
            <Link href="/create-listing">
              <Button>Create Your First Item</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-6 w-max pb-4">
              {items.slice(0, 6).map((item) => (
                <div key={item.id} className="min-w-[280px] border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <Image
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.description || "Item"}
                      width={300}
                      height={200}
                      className="rounded w-full h-48 object-cover mb-4"
                    />
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[#2C2522] mb-1">
                      {item.category || "Untitled Item"}
                    </h3>
                    <p className="text-sm text-[#4B403D] line-clamp-2">
                      {item.description || "No description"}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                      <span>Size: {item.size}</span>
                      <span>Condition: {item.condition}</span>
                    </div>
                    {item.createdAt && (
                      <p className="text-xs text-gray-400">
                        Listed {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Purchases Preview (static) */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#2C2522]">My Purchases</h2>
          <Link href="/purchases">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-6 w-max pb-4">
            {dummyPurchases.map((item) => (
              <div key={item.id} className="min-w-[280px] border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
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
"use client";

import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, "items"), limit(4));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedItems(items);
      } catch (err) {
        console.error("Failed to fetch featured items:", err);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="mt-35 text-center">
      {/* Hero Text */}
      <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-[#2C2522] leading-tight">
        Swap Clothes. Save Money. <br className="hidden sm:block" /> Save the
        Planet.
      </h2>

      <p className="text-lg sm:text-xl text-[#4B403D] font-medium mb-10 max-w-2xl mx-auto">
        Join the ReWear community and give your clothes a second life through
        direct swaps or point-based exchanges.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
  <Link href="/swapping">
    <Button className="px-6 py-3 text-lg bg-[#2C2522] text-white hover:bg-[#403733] transition">
      Start Swapping
    </Button>
  </Link>

  <Link href="/items">
    <Button className="px-6 py-3 text-lg bg-[#2C2522] text-white hover:bg-[#403733] transition">
      Browse Items
    </Button>
  </Link>
</div>

      {/* Search Bar */}
      <div className="flex w-full items-center gap-2 justify-center mt-10 px-4">
        <div className="flex w-full max-w-md items-center gap-2">
          <Input
            type="text"
            placeholder="Search clothes, brands, categories..."
            className="flex-grow"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </div>

      {/* Category Section */}
      <section className="py-12 px-4">
        <h3 className="text-2xl font-semibold mb-8 text-[#2C2522]">
          Popular Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-center">
          <div className="p-4 border rounded-lg hover:shadow-lg transition">
            <Image
              src="/images/tshirt.png"
              alt="Tops"
              width={80}
              height={80}
              className="mx-auto mb-2"
            />
            <p className="font-medium text-[#4B403D]">Tops</p>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-lg transition">
            <Image
              src="/images/jeans.png"
              alt="Bottoms"
              width={80}
              height={80}
              className="mx-auto mb-2"
            />
            <p className="font-medium text-[#4B403D]">Jeans & Pants</p>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-lg transition">
            <Image
              src="/images/dress.png"
              alt="Dresses"
              width={80}
              height={80}
              className="mx-auto mb-2"
            />
            <p className="font-medium text-[#4B403D]">Dresses</p>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-lg transition">
            <Image
              src="/images/jacket.png"
              alt="Outerwear"
              width={80}
              height={80}
              className="mx-auto mb-2"
            />
            <p className="font-medium text-[#4B403D]">Outerwear</p>
          </div>
        </div>
      </section>

      {/* Product Listing Section */}
      <section className="py-12 px-4 bg-[#f9f7f6]">
        <h3 className="text-2xl font-semibold mb-8 text-[#2C2522]">
          Featured Items
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <Image
                src={item.images?.[0] || "/images/sample-cloth.jpg"}
                alt={item.title}
                width={200}
                height={200}
                className="rounded mb-4 mx-auto"
              />
              <h4 className="font-semibold text-[#2C2522] mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-[#4B403D] mb-2">
                Size: {item.size} | Condition: {item.condition}
              </p>
              <Button className="w-full bg-[#2C2522] text-white">
                Swap or Redeem
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4">
        <h3 className="text-2xl font-semibold mb-6 text-[#2C2522]">
          Our Impact So Far 🌱
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[#4B403D] font-medium">
          <div className="border rounded-lg p-6">
            <h4 className="text-3xl font-bold text-[#2C2522] mb-2">500+</h4>
            Clothes Swapped
          </div>
          <div className="border rounded-lg p-6">
            <h4 className="text-3xl font-bold text-[#2C2522] mb-2">1.2 Tons</h4>
            Textile Waste Saved
          </div>
          <div className="border rounded-lg p-6">
            <h4 className="text-3xl font-bold text-[#2C2522] mb-2">1000+</h4>
            Happy Swappers
          </div>
        </div>
      </section>
    </div>
  );
}

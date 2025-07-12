import FAQ from "@/components/FAQs";
import Features from "@/components/Features";
import Feedback from "@/components/feedback";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Stats from "@/components/Working";
import { categories, products } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-35 text-center">
      {/* Hero Section */}
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
        <Link href="/items">
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

      {/* Search
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
      </div> */}
      <div className="my-10">
        <img
          src="/hero.gif"
          alt="Algorithm Animation Preview"
          className="mx-auto  max-w-full sm:max-w-md"
        />
      </div>
      <Features />
      {/* Categories Section */}
      <section className="py-12 px-4 bg-[#f9f7f6]">
        <h3 className="text-4xl font-bold text-center mb-12 text-[#2C2522]">
          Popular Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-center">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 border rounded-lg hover:shadow-md transition flex flex-col items-center"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                width={80}
                height={80}
                className="mb-3 rounded"
              />
              <p className="font-medium text-[#4B403D] text-center">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-12 px-4 ">
        <h3 className="text-4xl font-bold text-center mb-12 text-[#2C2522]">
          Featured Items
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:shadow-md transition flex flex-col items-center"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={200}
                height={200}
                className="rounded mb-4"
              />
              <h4 className="font-semibold text-[#2C2522] mb-1 text-center">
                {item.title}
              </h4>
              <p className="text-sm text-[#4B403D] mb-3 text-center">
                {item.description}
              </p>
              <Button className="w-full bg-[#2C2522] text-white">
                Swap or Redeem
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 px-4 bg-[#f9f7f6]">
        <h3 className="text-4xl font-bold text-center mb-12 text-[#2C2522]">
          Our Impact So Far 🌱
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[#4B403D] font-medium">
          <div className="border rounded-lg p-6 text-center">
            <h4 className="text-3xl font-bold text-[#2C2522] mb-2">500+</h4>
            Clothes Swapped
          </div>
          <div className="border rounded-lg p-6 text-center">
            <h4 className="text-3xl font-bold text-[#2C2522] mb-2">1.2 Tons</h4>
            Textile Waste Saved
          </div>
          <div className="border rounded-lg p-6 text-center">
            <h4 className="text-3xl font-bold text-[#2C2522] mb-2">1000+</h4>
            Happy Swappers
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <Stats />

      <FAQ />

      {/* Testimonials Section */}
      <section className="py-12 px-4">
        <h3 className="text-4xl font-bold text-center mb-12 text-[#2C2522]">
          What Our Users Say 💬
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#f5f4f2] p-6 rounded-lg shadow">
            <p className="italic">
              "I love how easy it is to swap clothes here! It's eco-friendly and
              fun."
            </p>
            <p className="mt-4 font-medium text-[#2C2522]">- Aisha R.</p>
          </div>
          <div className="bg-[#f5f4f2] p-6 rounded-lg shadow">
            <p className="italic">
              "Saved money and gave away clothes I no longer wear. Win-win!"
            </p>
            <p className="mt-4 font-medium text-[#2C2522]">- Ravi K.</p>
          </div>
          <div className="bg-[#f5f4f2] p-6 rounded-lg shadow">
            <p className="italic">
              "Love the points system. I got a new dress for free!"
            </p>
            <p className="mt-4 font-medium text-[#2C2522]">- Meera P.</p>
          </div>
        </div>
      </section>
      <Feedback />
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const Stats = () => {
  return (
    <section className=" py-16 w-full">
      <h2 className="text-4xl font-bold text-center mb-12 text-[#2C2522]">
        How ReWear Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Step 1 */}
        <Card className="w-[300px] bg-white shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              1. List Your Clothes
            </CardTitle>
            <CardDescription>
              Upload pictures, add details, and go live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Got gently used clothes? Create a listing in minutes — include
              brand, size, and condition.
            </p>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="w-[300px] bg-white shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              2. Browse & Discover
            </CardTitle>
            <CardDescription>
              Shop or swap from the ReWear community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Explore unique fashion at affordable prices. Use filters and
              keywords to find your perfect piece.
            </p>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="w-[300px] bg-white shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              3. Swap or Buy
            </CardTitle>
            <CardDescription>
              Finalize the exchange or make a purchase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Found something you love? Choose to swap using ReWear Points or
              buy directly from trusted users.
            </p>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="w-[300px] bg-white shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              4. Earn Rewards
            </CardTitle>
            <CardDescription>
              Collect ReWear Points and unlock perks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Every listing, review, or swap earns you points. Redeem them for
              discounts, priority listings, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Stats;

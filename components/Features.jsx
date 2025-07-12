import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const Features = () => {
  return (
    <section className="bg-white py-16 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-[#2C2522]">
        Why Choose ReWear?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Feature 1 */}
        <Card className="bg-[#f8f6f3] shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              Eco-Friendly Fashion
            </CardTitle>
            <CardDescription>
              Help the planet by giving clothes a second life.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Every listing and purchase reduces textile waste. ReWear is your
              step toward sustainable living.
            </p>
          </CardContent>
        </Card>

        {/* Feature 2 */}
        <Card className="bg-[#f8f6f3] shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              Points & Rewards
            </CardTitle>
            <CardDescription>
              Earn ReWear Points for every action you take.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              List items, make purchases, or swap to earn points — redeemable
              for exclusive deals and offers.
            </p>
          </CardContent>
        </Card>

        {/* Feature 3 */}
        <Card className="bg-[#f8f6f3] shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              Seamless Swapping
            </CardTitle>
            <CardDescription>
              Exchange clothes with users nearby.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Tired of buying? Swap items directly with other users using our
              built-in matching and swap approval system.
            </p>
          </CardContent>
        </Card>

        {/* Feature 4 */}
        <Card className="bg-[#f8f6f3] shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              Safe & Verified Users
            </CardTitle>
            <CardDescription>Your safety is our priority.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              With Clerk authentication and admin moderation, ReWear ensures a
              trusted environment for all your transactions.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Features;

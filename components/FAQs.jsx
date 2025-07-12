"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <section className="py-20 w-full bg-[#f9f7f6]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-6 text-[#2C2522]">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-lg text-[#4B403D] mb-12 max-w-2xl mx-auto">
          Everything you need to know about using ReWear to swap, list, or shop
          second-hand fashion sustainably.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              👕 What is ReWear?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              ReWear is a platform for buying, selling, and swapping second-hand
              fashion. We connect eco-conscious users to give clothes a second
              life and earn reward points in the process.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              🌱 How do I earn points?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              You earn ReWear points by listing your own clothes, completing
              successful swaps or sales, and engaging with the community. These
              points can later be used for discounts or special offers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              📦 How does swapping work?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              Users can list items for swap. When another user is interested,
              both parties can accept the exchange. Once confirmed, you ship the
              item and confirm delivery to complete the swap and earn points.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              🛍️ Can I just buy or sell items instead of swapping?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              Absolutely! While we encourage sustainable swapping, users can
              also list and purchase items directly. Payments are securely
              processed through our integrated system.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              🧾 How can I track my purchases or listings?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              Just head to your dashboard after signing in. You’ll see all your
              active listings, completed purchases, swap history, and current
              point balance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;

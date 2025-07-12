"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

const Header = () => {
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-36 h-auto">
            <Image
              src="/logo.png"
              alt="ReWear Logo"
              width={160}
              height={40}
              className="h-12 w-auto object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* Show if user is signed out */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-[#2C2522] text-white px-5">Sign In</Button>
            </SignInButton>
          </SignedOut>

          {/* Show if user is signed in */}
          <SignedIn>
            <div className="flex items-center gap-4">
              {!isAdmin && (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-[#2C2522]">
                      Dashboard
                    </Button>
                  </Link>

                  <Link href="/items">
                    <Button variant="ghost" className="text-[#2C2522]">
                      Browse
                    </Button>
                  </Link>

                  <Link href="/create-listing">
                    <Button variant="outline" className="text-[#2C2522]">
                      List Item
                    </Button>
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link href="/admin">
                  <Button variant="destructive" className="text-white">
                    Admin Panel
                  </Button>
                </Link>
              )}

              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;

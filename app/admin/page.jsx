"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const dummyUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "user" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  { id: 3, name: "Admin", email: "admin@rewear.com", role: "admin" },
];

const dummyListings = [
  { id: 1, title: "Denim Jacket", status: "active", user: "Alice" },
  { id: 2, title: "Red Dress", status: "flagged", user: "Bob" },
  { id: 3, title: "Leather Boots", status: "sold", user: "Alice" },
];

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/");
    }
  }, [user, isLoaded]);

  if (!isLoaded) return <div className="text-center mt-20">Loading...</div>;

  const renderTab = () => {
    switch (tab) {
      case "overview":
        return (
          <div className="space-y-4">
            <div>Total Users: {dummyUsers.length}</div>
            <div>Total Listings: {dummyListings.length}</div>
            <div>
              Flagged Listings:{" "}
              {dummyListings.filter((l) => l.status === "flagged").length}
            </div>
          </div>
        );
      case "users":
        return (
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {dummyUsers.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "listings":
        return (
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">User</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyListings.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">{item.user}</td>
                  <td className="p-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 mt-15">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Link href="/dashboard">
          <Button variant="outline">⬅ Back to User Dashboard</Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={tab === "overview" ? "default" : "outline"}
          onClick={() => setTab("overview")}
        >
          Overview
        </Button>
        <Button
          variant={tab === "users" ? "default" : "outline"}
          onClick={() => setTab("users")}
        >
          Users
        </Button>
        <Button
          variant={tab === "listings" ? "default" : "outline"}
          onClick={() => setTab("listings")}
        >
          Listings
        </Button>
      </div>

      <div className="bg-white p-6 rounded shadow border space-y-4">
        {renderTab()}
      </div>
    </div>
  );
}

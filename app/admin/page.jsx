"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isAfter, subDays } from "date-fns";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

// Dummy swaps data
const dummySwaps = [
  { id: 1, item: "Denim Jacket", userA: "Alice", userB: "Bob", status: "completed", createdAt: new Date(Date.now() - 86400000 * 2), resolved: true },
  { id: 2, item: "Red Dress", userA: "Bob", userB: "Admin", status: "pending", createdAt: new Date(Date.now() - 86400000 * 5), resolved: false },
  { id: 3, item: "Leather Boots", userA: "Alice", userB: "Admin", status: "disputed", createdAt: new Date(Date.now() - 86400000 * 10), resolved: false },
];

// Dummy categories and settings data
const dummyCategories = [
  { id: 1, name: "Tops", itemCount: 245, active: true },
  { id: 2, name: "Jeans & Pants", itemCount: 189, active: true },
  { id: 3, name: "Dresses", itemCount: 156, active: true },
  { id: 4, name: "Outerwear", itemCount: 98, active: true },
];

const SIDEBAR_LINKS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "users", label: "Users" },
  { key: "items", label: "Items" },
  { key: "swaps", label: "Swaps" },
  { key: "analytics", label: "Analytics" },
  { key: "settings", label: "Settings" },
];

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userSort, setUserSort] = useState("joinedAt");
  const [userSortDir, setUserSortDir] = useState("desc");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemSort, setItemSort] = useState("createdAt");
  const [itemSortDir, setItemSortDir] = useState("desc");
  const [itemStatusFilter, setItemStatusFilter] = useState("");
  const [itemCategoryFilter, setItemCategoryFilter] = useState("");
  const [swapSearch, setSwapSearch] = useState("");
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapSort, setSwapSort] = useState("createdAt");
  const [swapSortDir, setSwapSortDir] = useState("desc");
  const [swapStatusFilter, setSwapStatusFilter] = useState("");
  const [categories, setCategories] = useState(dummyCategories);
  const [newCategory, setNewCategory] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [defaultPoints, setDefaultPoints] = useState(25);

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/");
    }
  }, [user, isLoaded]);

  if (!isLoaded) return <div className="text-center mt-20">Loading...</div>;

  // Calculate metrics
  const now = new Date();
  const activeUsers = dummyUsers.filter(u => {
    const lastLogin = u.lastLoginAt?.toDate ? u.lastLoginAt.toDate() : u.lastLoginAt;
    return lastLogin && isAfter(lastLogin, subDays(now, 7));
  });
  const newUsers = dummyUsers.filter(u => {
    const joined = u.joinedAt?.toDate ? u.joinedAt.toDate() : u.joinedAt;
    return joined && isAfter(joined, subDays(now, 7));
  });
  const pendingApprovals = dummyListings.filter(l => l.status === "pending");
  const flaggedListings = dummyListings.filter(l => l.status === "flagged");
  const recentUsers = [...dummyUsers]
    .sort((a, b) => (b.joinedAt?.seconds || 0) - (a.joinedAt?.seconds || 0))
    .slice(0, 5);
  const recentListings = [...dummyListings]
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    .slice(0, 5);

  // Filter, search, and sort users
  let filteredUsers = dummyUsers.filter(u => {
    const name = (u.name || u.fullName || "").toLowerCase();
    const email = (u.email || u.emailAddress || "").toLowerCase();
    const search = userSearch.toLowerCase();
    const role = u.role || u.publicMetadata?.role || "user";
    return (
      (name.includes(search) || email.includes(search)) &&
      (!userRoleFilter || role === userRoleFilter)
    );
  });
  filteredUsers = filteredUsers.sort((a, b) => {
    let aVal = a[userSort];
    let bVal = b[userSort];
    if (aVal?.toDate) aVal = aVal.toDate();
    if (bVal?.toDate) bVal = bVal.toDate();
    if (userSortDir === "desc") return bVal > aVal ? 1 : -1;
    return aVal > bVal ? 1 : -1;
  });

  // Filter, search, and sort items
  let filteredItems = dummyListings.filter(item => {
    const title = (item.title || "").toLowerCase();
    const user = (item.user || "").toLowerCase();
    const search = itemSearch.toLowerCase();
    const status = item.status || "";
    const category = item.category || "";
    return (
      (title.includes(search) || user.includes(search)) &&
      (!itemStatusFilter || status === itemStatusFilter) &&
      (!itemCategoryFilter || category === itemCategoryFilter)
    );
  });
  filteredItems = filteredItems.sort((a, b) => {
    let aVal = a[itemSort];
    let bVal = b[itemSort];
    if (aVal?.toDate) aVal = aVal.toDate();
    if (bVal?.toDate) bVal = bVal.toDate();
    if (itemSortDir === "desc") return bVal > aVal ? 1 : -1;
    return aVal > bVal ? 1 : -1;
  });

  // Filter, search, and sort swaps
  let filteredSwaps = dummySwaps.filter(swap => {
    const item = (swap.item || "").toLowerCase();
    const userA = (swap.userA || "").toLowerCase();
    const userB = (swap.userB || "").toLowerCase();
    const search = swapSearch.toLowerCase();
    const status = swap.status || "";
    return (
      (item.includes(search) || userA.includes(search) || userB.includes(search)) &&
      (!swapStatusFilter || status === swapStatusFilter)
    );
  });
  filteredSwaps = filteredSwaps.sort((a, b) => {
    let aVal = a[swapSort];
    let bVal = b[swapSort];
    if (aVal?.toDate) aVal = aVal.toDate();
    if (bVal?.toDate) bVal = bVal.toDate();
    if (swapSortDir === "desc") return bVal > aVal ? 1 : -1;
    return aVal > bVal ? 1 : -1;
  });

  // Dummy analytics data for charts (replace with real aggregation later)
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return d.toLocaleString("default", { month: "short", year: "2-digit" });
  });
  const userGrowthData = {
    labels: months,
    datasets: [
      {
        label: "Users",
        data: months.map(() => Math.floor(Math.random() * 20) + 10), // Replace with real monthly user counts
        borderColor: "#2563eb",
        backgroundColor: "#2563eb22",
        tension: 0.4,
        fill: true,
      },
    ],
  };
  const itemGrowthData = {
    labels: months,
    datasets: [
      {
        label: "Listings",
        data: months.map(() => Math.floor(Math.random() * 30) + 5), // Replace with real monthly listing counts
        borderColor: "#16a34a",
        backgroundColor: "#16a34a22",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Dummy analytics data for analytics tab
  const swapActivityData = {
    labels: months,
    datasets: [
      {
        label: "Swaps",
        data: months.map(() => Math.floor(Math.random() * 15) + 2),
        backgroundColor: "#f59e42",
        borderColor: "#f59e42",
        borderWidth: 1,
      },
    ],
  };
  const topCategoriesData = {
    labels: ["Tops", "Jeans & Pants", "Dresses", "Outerwear"],
    datasets: [
      {
        label: "Listings",
        data: [245, 189, 156, 98],
        backgroundColor: ["#2563eb", "#16a34a", "#f59e42", "#a21caf"],
      },
    ],
  };
  const mostActiveUsersData = {
    labels: ["Alice", "Bob", "Admin"],
    datasets: [
      {
        label: "Swaps",
        data: [12, 8, 5],
        backgroundColor: "#2563eb",
      },
    ],
  };
  const mostSwappedItemsData = {
    labels: ["Denim Jacket", "Red Dress", "Leather Boots"],
    datasets: [
      {
        label: "Swaps",
        data: [7, 5, 3],
        backgroundColor: "#16a34a",
      },
    ],
  };
  const textileWasteSaved = 2.4; // tons, dummy
  const pointsEconomy = { earned: 12000, spent: 9500 };

  // Category management handlers (UI only)
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { id: Date.now(), name: newCategory, itemCount: 0, active: true }]);
      setNewCategory("");
    }
  };
  const handleToggleCategory = (id) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, active: !cat.active } : cat));
  };
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };
  const handleEditCategory = (id, name) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, name } : cat));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col py-8 px-4 gap-4 shadow-sm">
        <h2 className="text-2xl font-bold mb-8 text-primary">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {SIDEBAR_LINKS.map(link => (
            <Button
              key={link.key}
              variant={activeTab === link.key ? "default" : "ghost"}
              className="justify-start w-full"
              onClick={() => setActiveTab(link.key)}
            >
              {link.label}
            </Button>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <Button variant="outline" className="w-full" asChild>
            <a href="/dashboard">⬅ Back to User Dashboard</a>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {activeTab === "dashboard" && (
          <section>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{dummyUsers.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Users (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{activeUsers.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>New Users (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{newUsers.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{dummyListings.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{pendingApprovals.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Flagged Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{flaggedListings.length}</div>
                </CardContent>
              </Card>
            </div>
            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth (12mo)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line data={userGrowthData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Listing Growth (12mo)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line data={itemGrowthData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
                </CardContent>
              </Card>
            </div>
            {/* Recent Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {recentUsers.map(u => (
                      <li key={u.id} className="py-2 flex flex-col">
                        <span className="font-medium">{u.name || u.fullName || u.email || u.id}</span>
                        <span className="text-xs text-gray-500">Joined {u.joinedAt ? formatDistanceToNow(u.joinedAt?.toDate ? u.joinedAt.toDate() : u.joinedAt, { addSuffix: true }) : "-"}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {recentListings.map(l => (
                      <li key={l.id} className="py-2 flex flex-col">
                        <span className="font-medium">{l.title}</span>
                        <span className="text-xs text-gray-500">Created {l.createdAt ? formatDistanceToNow(l.createdAt?.toDate ? l.createdAt.toDate() : l.createdAt, { addSuffix: true }) : "-"}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
        {activeTab === "users" && (
          <section>
            <h1 className="text-3xl font-bold mb-8">User Management</h1>
            <Card className="mb-8">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="border rounded px-4 py-2 w-full md:w-64"
                  />
                  <select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select
                    value={userSort}
                    onChange={e => setUserSort(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="joinedAt">Sort by Join Date</option>
                    <option value="lastLoginAt">Sort by Last Login</option>
                    <option value="name">Sort by Name</option>
                  </select>
                  <select
                    value={userSortDir}
                    onChange={e => setUserSortDir(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Joined</th>
                        <th className="p-2">Last Login</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{u.name || u.fullName || u.id}</td>
                          <td className="p-2">{u.email || u.emailAddress || u.emailAddresses?.[0]?.emailAddress || "-"}</td>
                          <td className="p-2 capitalize">{u.role || u.publicMetadata?.role || "user"}</td>
                          <td className="p-2">{u.joinedAt ? formatDistanceToNow(u.joinedAt?.toDate ? u.joinedAt.toDate() : u.joinedAt, { addSuffix: true }) : "-"}</td>
                          <td className="p-2">{u.lastLoginAt ? formatDistanceToNow(u.lastLoginAt?.toDate ? u.lastLoginAt.toDate() : u.lastLoginAt, { addSuffix: true }) : "-"}</td>
                          <td className="p-2 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedUser(u); setShowUserModal(true); }}>View</Button>
                            <Button size="sm" variant="ghost">Suspend</Button>
                            <Button size="sm" variant="ghost">Promote</Button>
                            <Button size="sm" variant="ghost">Reset Points</Button>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* User Detail Modal */}
            {showUserModal && selectedUser && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowUserModal(false)}>&times;</button>
                  <h2 className="text-2xl font-bold mb-4">User Details</h2>
                  <div className="mb-2"><span className="font-semibold">Name:</span> {selectedUser.name || selectedUser.fullName || selectedUser.id}</div>
                  <div className="mb-2"><span className="font-semibold">Email:</span> {selectedUser.email || selectedUser.emailAddress || selectedUser.emailAddresses?.[0]?.emailAddress || "-"}</div>
                  <div className="mb-2"><span className="font-semibold">Role:</span> {selectedUser.role || selectedUser.publicMetadata?.role || "user"}</div>
                  <div className="mb-2"><span className="font-semibold">Joined:</span> {selectedUser.joinedAt ? formatDistanceToNow(selectedUser.joinedAt?.toDate ? selectedUser.joinedAt.toDate() : selectedUser.joinedAt, { addSuffix: true }) : "-"}</div>
                  <div className="mb-2"><span className="font-semibold">Last Login:</span> {selectedUser.lastLoginAt ? formatDistanceToNow(selectedUser.lastLoginAt?.toDate ? selectedUser.lastLoginAt.toDate() : selectedUser.lastLoginAt, { addSuffix: true }) : "-"}</div>
                  <div className="mb-2"><span className="font-semibold">Points:</span> {selectedUser.points ?? "-"}</div>
                  {/* Add more user info as needed */}
                  <div className="flex gap-2 mt-6">
                    <Button size="sm" variant="ghost">Suspend</Button>
                    <Button size="sm" variant="ghost">Promote</Button>
                    <Button size="sm" variant="ghost">Reset Points</Button>
                    <Button size="sm" variant="destructive">Delete</Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        {activeTab === "items" && (
          <section>
            <h1 className="text-3xl font-bold mb-8">Item Management</h1>
            <Card className="mb-8">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search by title or user..."
                    value={itemSearch}
                    onChange={e => setItemSearch(e.target.value)}
                    className="border rounded px-4 py-2 w-full md:w-64"
                  />
                  <select
                    value={itemStatusFilter}
                    onChange={e => setItemStatusFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                    <option value="sold">Sold</option>
                  </select>
                  <select
                    value={itemSort}
                    onChange={e => setItemSort(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="createdAt">Sort by Created</option>
                    <option value="title">Sort by Title</option>
                    <option value="status">Sort by Status</option>
                  </select>
                  <select
                    value={itemSortDir}
                    onChange={e => setItemSortDir(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">Title</th>
                        <th className="p-2">User</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{item.title}</td>
                          <td className="p-2">{item.user || item.ownerId || "-"}</td>
                          <td className="p-2 capitalize">{item.status}</td>
                          <td className="p-2">{item.category || "-"}</td>
                          <td className="p-2">{item.createdAt ? formatDistanceToNow(item.createdAt?.toDate ? item.createdAt.toDate() : item.createdAt, { addSuffix: true }) : "-"}</td>
                          <td className="p-2 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedItem(item); setShowItemModal(true); }}>View</Button>
                            <Button size="sm" variant="ghost">Approve</Button>
                            <Button size="sm" variant="ghost">Reject</Button>
                            <Button size="sm" variant="ghost">Flag</Button>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Item Detail Modal */}
            {showItemModal && selectedItem && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowItemModal(false)}>&times;</button>
                  <h2 className="text-2xl font-bold mb-4">Item Details</h2>
                  <div className="mb-2"><span className="font-semibold">Title:</span> {selectedItem.title}</div>
                  <div className="mb-2"><span className="font-semibold">User:</span> {selectedItem.user || selectedItem.ownerId || "-"}</div>
                  <div className="mb-2"><span className="font-semibold">Status:</span> {selectedItem.status}</div>
                  <div className="mb-2"><span className="font-semibold">Category:</span> {selectedItem.category || "-"}</div>
                  <div className="mb-2"><span className="font-semibold">Created:</span> {selectedItem.createdAt ? formatDistanceToNow(selectedItem.createdAt?.toDate ? selectedItem.createdAt.toDate() : selectedItem.createdAt, { addSuffix: true }) : "-"}</div>
                  {/* Add more item info as needed */}
                  <div className="flex gap-2 mt-6">
                    <Button size="sm" variant="ghost">Approve</Button>
                    <Button size="sm" variant="ghost">Reject</Button>
                    <Button size="sm" variant="ghost">Flag</Button>
                    <Button size="sm" variant="destructive">Delete</Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        {activeTab === "swaps" && (
          <section>
            <h1 className="text-3xl font-bold mb-8">Swap Management</h1>
            <Card className="mb-8">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search by item or user..."
                    value={swapSearch}
                    onChange={e => setSwapSearch(e.target.value)}
                    className="border rounded px-4 py-2 w-full md:w-64"
                  />
                  <select
                    value={swapStatusFilter}
                    onChange={e => setSwapStatusFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="disputed">Disputed</option>
                  </select>
                  <select
                    value={swapSort}
                    onChange={e => setSwapSort(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="createdAt">Sort by Created</option>
                    <option value="status">Sort by Status</option>
                  </select>
                  <select
                    value={swapSortDir}
                    onChange={e => setSwapSortDir(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">Item</th>
                        <th className="p-2">User A</th>
                        <th className="p-2">User B</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSwaps.map(swap => (
                        <tr key={swap.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{swap.item}</td>
                          <td className="p-2">{swap.userA}</td>
                          <td className="p-2">{swap.userB}</td>
                          <td className="p-2 capitalize">{swap.status}</td>
                          <td className="p-2">{swap.createdAt ? formatDistanceToNow(swap.createdAt, { addSuffix: true }) : "-"}</td>
                          <td className="p-2 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedSwap(swap); setShowSwapModal(true); }}>View</Button>
                            <Button size="sm" variant="ghost">Resolve</Button>
                            <Button size="sm" variant="ghost">Dispute</Button>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Swap Detail Modal */}
            {showSwapModal && selectedSwap && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowSwapModal(false)}>&times;</button>
                  <h2 className="text-2xl font-bold mb-4">Swap Details</h2>
                  <div className="mb-2"><span className="font-semibold">Item:</span> {selectedSwap.item}</div>
                  <div className="mb-2"><span className="font-semibold">User A:</span> {selectedSwap.userA}</div>
                  <div className="mb-2"><span className="font-semibold">User B:</span> {selectedSwap.userB}</div>
                  <div className="mb-2"><span className="font-semibold">Status:</span> {selectedSwap.status}</div>
                  <div className="mb-2"><span className="font-semibold">Created:</span> {selectedSwap.createdAt ? formatDistanceToNow(selectedSwap.createdAt, { addSuffix: true }) : "-"}</div>
                  <div className="mb-2"><span className="font-semibold">Resolved:</span> {selectedSwap.resolved ? "Yes" : "No"}</div>
                  {/* Add more swap info as needed */}
                  <div className="flex gap-2 mt-6">
                    <Button size="sm" variant="ghost">Resolve</Button>
                    <Button size="sm" variant="ghost">Dispute</Button>
                    <Button size="sm" variant="destructive">Delete</Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        {activeTab === "analytics" && (
          <section>
            <h1 className="text-3xl font-bold mb-8">Analytics & Insights</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth (12mo)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line data={userGrowthData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Listing Growth (12mo)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line data={itemGrowthData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Swap Activity (12mo)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar data={swapActivityData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <Pie data={topCategoriesData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} height={200} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Most Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar data={mostActiveUsersData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Most Swapped Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar data={mostSwappedItemsData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Textile Waste Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{textileWasteSaved} tons</div>
                  <div className="text-gray-500">Estimated textile waste saved by swaps</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Points Economy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div><span className="font-semibold">Points Earned:</span> {pointsEconomy.earned.toLocaleString()}</div>
                    <div><span className="font-semibold">Points Spent:</span> {pointsEconomy.spent.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
        {activeTab === "settings" && (
          <section>
            <h1 className="text-3xl font-bold mb-8">Settings & Categories</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="New category name"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="border rounded px-3 py-2 text-sm"
                    />
                    <Button onClick={handleAddCategory}>Add</Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map(cat => (
                      <Card key={cat.id} className="flex flex-row items-center justify-between p-4">
                        <div>
                          <span className="font-medium mr-2">{cat.name}</span>
                          <span className="text-xs text-gray-500">{cat.itemCount} items</span>
                          <span className={`ml-3 px-2 py-1 rounded text-xs ${cat.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>{cat.active ? "Active" : "Inactive"}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleToggleCategory(cat.id)}>{cat.active ? "Deactivate" : "Activate"}</Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEditCategory(cat.id, prompt("Edit category name:", cat.name) || cat.name)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(cat.id)}>Delete</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Platform Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Default Points per Item</label>
                    <input
                      type="number"
                      value={defaultPoints}
                      onChange={e => setDefaultPoints(Number(e.target.value))}
                      className="border rounded px-3 py-2 text-sm w-32"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Maintenance Mode</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={e => setMaintenanceMode(e.target.checked)}
                        className="h-5 w-5"
                        id="maintenance"
                      />
                      <label htmlFor="maintenance" className="text-sm">Enable maintenance mode</label>
                    </div>
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

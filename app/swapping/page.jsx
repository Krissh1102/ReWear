"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  doc,
  getDoc
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have auth context

export default function StartSwapping() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const { user } = useAuth();

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "tops", name: "Tops" },
    { id: "bottoms", name: "Bottoms" },
    { id: "dresses", name: "Dresses" },
    { id: "outerwear", name: "Outerwear" },
    { id: "shoes", name: "Shoes" },
    { id: "accessories", name: "Accessories" }
  ];

  const sizes = [
    { id: "all", name: "All Sizes" },
    { id: "xs", name: "XS" },
    { id: "s", name: "S" },
    { id: "m", name: "M" },
    { id: "l", name: "L" },
    { id: "xl", name: "XL" },
    { id: "xxl", name: "XXL" }
  ];

  const conditions = [
    { id: "all", name: "All Conditions" },
    { id: "new", name: "New with Tags" },
    { id: "excellent", name: "Excellent" },
    { id: "good", name: "Good" },
    { id: "fair", name: "Fair" }
  ];

  const sortOptions = [
    { id: "newest", name: "Newest First" },
    { id: "oldest", name: "Oldest First" },
    { id: "points_low", name: "Points: Low to High" },
    { id: "points_high", name: "Points: High to Low" }
  ];

  // Fetch user points
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserPoints(userDoc.data().points || 0);
          }
        } catch (error) {
          console.error("Error fetching user points:", error);
        }
      }
    };

    fetchUserPoints();
  }, [user]);

  // Main fetch function
  const fetchItems = async (isLoadMore = false) => {
    setLoading(true);
    try {
      let q = collection(db, "items");
      
      // Apply filters
      const conditions = [];
      
      // Only show available items
      conditions.push(where("status", "==", "available"));
      
      // Category filter
      if (selectedCategory !== "all") {
        conditions.push(where("category", "==", selectedCategory));
      }
      
      // Size filter
      if (selectedSize !== "all") {
        conditions.push(where("size", "==", selectedSize));
      }
      
      // Condition filter
      if (selectedCondition !== "all") {
        conditions.push(where("condition", "==", selectedCondition));
      }

      // Apply all where conditions
      conditions.forEach(condition => {
        q = query(q, condition);
      });

      // Sorting
      switch (sortBy) {
        case "newest":
          q = query(q, orderBy("createdAt", "desc"));
          break;
        case "oldest":
          q = query(q, orderBy("createdAt", "asc"));
          break;
        case "points_low":
          q = query(q, orderBy("pointsValue", "asc"));
          break;
        case "points_high":
          q = query(q, orderBy("pointsValue", "desc"));
          break;
      }

      // Pagination
      if (isLoadMore && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      q = query(q, limit(12));

      const snapshot = await getDocs(q);
      const newItems = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));

      // Filter by search term (client-side for flexibility)
      const filteredItems = newItems.filter(item =>
        searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (isLoadMore) {
        setItems(prev => [...prev, ...filteredItems]);
      } else {
        setItems(filteredItems);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 12);
      
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load items when filters change
  useEffect(() => {
    setItems([]);
    setLastDoc(null);
    setHasMore(true);
    fetchItems(false);
  }, [selectedCategory, selectedSize, selectedCondition, sortBy]);

  // Search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([]);
      setLastDoc(null);
      setHasMore(true);
      fetchItems(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const loadMoreItems = () => {
    if (hasMore && !loading) {
      fetchItems(true);
    }
  };

  const getPointsColor = (points) => {
    if (points <= 50) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (points <= 100) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const canAfford = (itemPoints) => {
    return userPoints >= itemPoints;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-light text-[#2C2522] mb-6 tracking-tight">
            Discover & Swap
          </h1>
          <p className="text-xl text-[#4B403D]/80 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Find unique pieces from our sustainable fashion community
          </p>
          {user && (
            <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-stone-200 shadow-sm">
              <span className="text-[#4B403D] font-medium">Available Points</span>
              <span className="bg-[#2C2522] text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                {userPoints.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-stone-200 p-8 mb-10">
          {/* Search Bar */}
          <div className="flex gap-3 mb-8">
            <Input
              type="text"
              placeholder="Search by style, brand, or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-grow h-12 text-lg border-stone-300 focus:border-[#2C2522] focus:ring-[#2C2522]/20 rounded-xl"
            />
            <Button type="submit" variant="outline" className="h-12 px-8 border-[#2C2522] text-[#2C2522] hover:bg-[#2C2522] hover:text-white rounded-xl transition-colors">
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 border-stone-300 focus:border-[#2C2522] rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="h-12 border-stone-300 focus:border-[#2C2522] rounded-xl">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {sizes.map(size => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="h-12 border-stone-300 focus:border-[#2C2522] rounded-xl">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {conditions.map(condition => (
                  <SelectItem key={condition.id} value={condition.id}>
                    {condition.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 border-stone-300 focus:border-[#2C2522] rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {sortOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <span 
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-stone-100 text-stone-700 cursor-pointer hover:bg-stone-200 transition-colors border border-stone-300" 
                onClick={() => setSelectedCategory("all")}
              >
                {categories.find(c => c.id === selectedCategory)?.name} 
                <span className="ml-2 opacity-60">×</span>
              </span>
            )}
            {selectedSize !== "all" && (
              <span 
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-stone-100 text-stone-700 cursor-pointer hover:bg-stone-200 transition-colors border border-stone-300" 
                onClick={() => setSelectedSize("all")}
              >
                Size {selectedSize.toUpperCase()} 
                <span className="ml-2 opacity-60">×</span>
              </span>
            )}
            {selectedCondition !== "all" && (
              <span 
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-stone-100 text-stone-700 cursor-pointer hover:bg-stone-200 transition-colors border border-stone-300" 
                onClick={() => setSelectedCondition("all")}
              >
                {conditions.find(c => c.id === selectedCondition)?.name} 
                <span className="ml-2 opacity-60">×</span>
              </span>
            )}
            {searchTerm && (
              <span 
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-stone-100 text-stone-700 cursor-pointer hover:bg-stone-200 transition-colors border border-stone-300" 
                onClick={() => setSearchTerm("")}
              >
                "{searchTerm}" 
                <span className="ml-2 opacity-60">×</span>
              </span>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <p className="text-lg text-[#4B403D] font-medium">
              {loading ? "Searching..." : `${items.length} pieces available`}
            </p>
          </div>
          <Link href="/list-item">
            <Button variant="outline" className="border-[#2C2522] text-[#2C2522] hover:bg-[#2C2522] hover:text-white px-6 py-2 rounded-xl transition-colors">
              <span className="mr-2">+</span> List Your Item
            </Button>
          </Link>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-stone-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={item.images?.[0] || "/images/sample-cloth.jpg"}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getPointsColor(item.pointsValue)}`}>
                      {item.pointsValue} pts
                    </span>
                  </div>
                  {!canAfford(item.pointsValue) && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-medium bg-black/30 px-4 py-2 rounded-full">
                        Insufficient Points
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-lg font-medium text-[#2C2522] mb-2 line-clamp-2">
                  {item.title}
                </CardTitle>
                <p className="text-sm text-[#4B403D]/80 mb-1 font-medium">
                  {item.brand}
                </p>
                <p className="text-sm text-[#4B403D]/60 mb-4">
                  Size {item.size?.toUpperCase()} • {item.condition}
                </p>
                <div className="flex gap-2">
                  <Link href={`/items/${item.id}`} className="flex-1">
                    <Button 
                      className="w-full bg-[#2C2522] text-white hover:bg-[#403733] rounded-xl transition-colors h-11"
                      disabled={!canAfford(item.pointsValue)}
                    >
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#2C2522] text-[#2C2522] hover:bg-[#2C2522] hover:text-white rounded-xl px-4 h-11 transition-colors"
                    onClick={() => {/* Handle direct swap logic */}}
                  >
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center">
            <Button 
              onClick={loadMoreItems}
              variant="outline"
              className="border-[#2C2522] text-[#2C2522] hover:bg-[#2C2522] hover:text-white px-8 py-3 rounded-xl transition-colors"
            >
              Load More Items
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-[#2C2522] border-t-transparent"></div>
            <p className="mt-4 text-[#4B403D] font-medium">Discovering amazing pieces...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-light text-[#2C2522] mb-3">
                No items found
              </h3>
              <p className="text-[#4B403D]/80 mb-8 leading-relaxed">
                We couldn't find any items matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedSize("all");
                  setSelectedCondition("all");
                }}
                className="bg-[#2C2522] text-white hover:bg-[#403733] px-8 py-3 rounded-xl transition-colors"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
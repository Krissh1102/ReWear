"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SwapButton({ itemId, disabled }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSwap = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/items/${itemId}/swap`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Swap failed");
      } else {
        setSuccess(true);
        router.refresh();
      }
    } catch (err) {
      setError("Swap failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
        onClick={handleSwap}
        disabled={disabled || loading}
      >
        {loading ? "Swapping..." : success ? "Swapped!" : "Swap this item"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
} 
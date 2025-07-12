"use client"

import { useUserSync } from "@/lib/hooks/useUserSync";

export default function UserSyncWrapper() {
  useUserSync();
  return null; // This component doesn't render anything visible
}
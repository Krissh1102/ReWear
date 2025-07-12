"use client";

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useAuth() {
  const { isSignedIn, userId, isLoaded } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncUserWithFirestore = async () => {
      if (!isLoaded) return;

      try {
        setLoading(true);
        setError(null);

        if (isSignedIn && clerkUser && userId) {
          // Check if user exists in Firestore
          const userDocRef = doc(db, "users", userId);
          const userDoc = await getDoc(userDocRef);

          let userData;

          if (userDoc.exists()) {
            // User exists, update their info
            userData = userDoc.data();
            
            // Update user data with latest from Clerk
            const updateData = {
              email: clerkUser.emailAddresses[0]?.emailAddress || userData.email,
              name: clerkUser.fullName || userData.name,
              firstName: clerkUser.firstName || userData.firstName,
              lastName: clerkUser.lastName || userData.lastName,
              imageUrl: clerkUser.imageUrl || userData.imageUrl,
              lastLoginAt: serverTimestamp(),
            };

            // Only update if there are changes
            const hasChanges = Object.keys(updateData).some(key => {
              if (key === 'lastLoginAt') return true;
              return updateData[key] !== userData[key];
            });

            if (hasChanges) {
              await updateDoc(userDocRef, updateData);
              userData = { ...userData, ...updateData };
            }
          } else {
            // New user, create document
            userData = {
              id: userId,
              email: clerkUser.emailAddresses[0]?.emailAddress || "",
              name: clerkUser.fullName || "",
              firstName: clerkUser.firstName || "",
              lastName: clerkUser.lastName || "",
              imageUrl: clerkUser.imageUrl || "",
              points: 100, // Starting points for new users
              totalSwaps: 0,
              totalListings: 0,
              joinedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              preferences: {
                notifications: true,
                emailUpdates: true,
                sizes: [],
                categories: [],
              },
              stats: {
                itemsListed: 0,
                itemsSwapped: 0,
                pointsEarned: 100,
                pointsSpent: 0,
              },
            };

            await setDoc(userDocRef, userData);
          }

          // Set user state
          setUser({
            ...userData,
            id: userId,
            isAuthenticated: true,
            clerkUser: clerkUser,
          });
        } else {
          // User not signed in
          setUser(null);
        }
      } catch (err) {
        console.error("Error syncing user with Firestore:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncUserWithFirestore();
  }, [isSignedIn, userId, clerkUser, isLoaded]);

  // Helper function to update user points
  const updateUserPoints = async (pointsChange, reason = "") => {
    if (!user || !userId) return false;

    try {
      const userDocRef = doc(db, "users", userId);
      const newPoints = user.points + pointsChange;
      
      if (newPoints < 0) {
        throw new Error("Insufficient points");
      }

      const updateData = {
        points: newPoints,
        ...(pointsChange > 0 
          ? { "stats.pointsEarned": (user.stats?.pointsEarned || 0) + pointsChange }
          : { "stats.pointsSpent": (user.stats?.pointsSpent || 0) + Math.abs(pointsChange) }
        ),
        lastUpdatedAt: serverTimestamp(),
      };

      await updateDoc(userDocRef, updateData);

      // Update local state
      setUser(prev => ({
        ...prev,
        points: newPoints,
        stats: {
          ...prev.stats,
          pointsEarned: pointsChange > 0 
            ? (prev.stats?.pointsEarned || 0) + pointsChange 
            : prev.stats?.pointsEarned || 0,
          pointsSpent: pointsChange < 0 
            ? (prev.stats?.pointsSpent || 0) + Math.abs(pointsChange) 
            : prev.stats?.pointsSpent || 0,
        },
      }));

      return true;
    } catch (err) {
      console.error("Error updating user points:", err);
      setError(err.message);
      return false;
    }
  };

  // Helper function to update user stats
  const updateUserStats = async (statsUpdate) => {
    if (!user || !userId) return false;

    try {
      const userDocRef = doc(db, "users", userId);
      const updateData = {
        ...statsUpdate,
        lastUpdatedAt: serverTimestamp(),
      };

      await updateDoc(userDocRef, updateData);

      // Update local state
      setUser(prev => ({
        ...prev,
        ...statsUpdate,
      }));

      return true;
    } catch (err) {
      console.error("Error updating user stats:", err);
      setError(err.message);
      return false;
    }
  };

  // Helper function to refresh user data
  const refreshUser = async () => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUser(prev => ({
          ...prev,
          ...userDoc.data(),
        }));
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
      setError(err.message);
    }
  };

  // Helper function to check if user can afford an item
  const canAfford = (points) => {
    return user && user.points >= points;
  };

  return {
    user,
    isAuthenticated: isSignedIn && !!user,
    loading: loading || !isLoaded,
    error,
    updateUserPoints,
    updateUserStats,
    refreshUser,
    canAfford,
    // Expose Clerk methods for sign in/out
    signOut: () => {
      setUser(null);
      // Clerk's signOut will be handled by Clerk components
    },
  };
}
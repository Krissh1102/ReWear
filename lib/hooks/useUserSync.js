"use client"



import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useUserSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return;

      const userRef = doc(db, "users", user.id);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        await setDoc(userRef, {
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || "",
          photoURL: user.imageUrl || "",
          role: "user",
          uuid: user.id,
        });
        console.log("✅ Firestore user created");
      }
    };

    syncUser();
  }, [user, isLoaded]);
};

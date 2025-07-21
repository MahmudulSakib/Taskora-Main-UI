"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserProfileResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    profilePicture?: string;
  };
}

export default function useClientAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await axios.get<UserProfileResponse>(
        "http://localhost:5000/client/profile",
        {
          withCredentials: true,
        }
      );
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/client/log-out",
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, loading, handleLogout };
}

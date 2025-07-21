"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useClientAuth from "@/hooks/useClientAuth";

export default function AdsRedirectPage() {
  const { loading, user } = useClientAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/log-in");
    }
  }, [user, router]);

  useEffect(() => {
    const clickAndRedirect = async () => {
      try {
        await axios.post(
          "https://taskora-main-backend.onrender.com/api/bonus/ad-click",
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Bonus not added", err);
      } finally {
        window.location.href =
          "https://www.profitableratecpm.com/tpz6cy0cq?key=2504f323a697d3898aa9f466d544d121";
      }
    };

    clickAndRedirect();
  }, [router]);

  return null;
}

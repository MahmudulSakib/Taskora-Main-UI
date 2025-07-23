"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyAccount = async () => {
      try {
        const res = await axios.get(
          `https://taskora-main-backend.onrender.com/client/verify?token=${token}`
        );
        if (res.status === 200) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[linear-gradient(to_right,_rgba(6,22,40,0.7),_rgba(59,90,112,0.7))] text-white">
      {status === "verifying" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
          <p className="">Please wait while we process your verification.</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2 className="text-2xl font-bold mb-2">Account Verified 🎉</h2>
          <p className=" max-w-md mb-4">
            Your email has been successfully verified. You can now log in and
            use your account
          </p>
          <Link
            href="/log-in"
            className="text-[#F5A742] font-semibold underline"
          >
            Go to Login
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Invalid or expired link😟
          </h2>
          <p className="">Please try signing up again or contact support</p>
        </>
      )}
    </div>
  );
}

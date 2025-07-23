"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import Lottie from "lottie-react";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";

import Celebration from "../../../public/clebration/Celebration.json";
import NavMenu from "@/components/Navmenu";
import { Snackbar, Alert } from "@mui/material";

export default function WelcomeOffer() {
  const router = useRouter();
  const { user, loading: authloading } = useClientAuth();
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAnim, setShowAnim] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (!authloading && !user) {
      router.replace("/log-in");
    }
  }, [authloading, user, router]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get<any>(
          "https://taskora-main-backend.onrender.com/client/welcome-offer-status",
          {
            withCredentials: true,
          }
        );
        setClaimed(res.data.claimed);
      } catch {
        alert("Failed to load welcome offer status.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStatus();
  }, [user]);

  const handleClaim = async () => {
    try {
      await axios.post(
        "https://taskora-main-backend.onrender.com/client/claim-welcome-offer",
        {},
        { withCredentials: true }
      );
      setClaimed(true);
      setShowAnim(true);
      setUploadMessage("100 Tk Bonus Added!");
      setToastOpen(true);
    } catch {
      setUploadMessage("Offer Already Claimed or Server Error!");
      setToastOpen(true);
    }
  };

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <div className="min-h-[90vh] flex items-center justify-center bg-[linear-gradient(to_right,_rgba(6,22,40,0.7),_rgba(59,90,112,0.7))] text-white p-4">
        <div className="max-w-md text-center space-y-6 bg-black/30 backdrop-blur-md p-8 rounded-xl border border-white">
          <h1 className="text-3xl font-bold">🎁 Welcome Offer</h1>
          <p className="text-lg">Claim your one-time bonus of 100 TK!</p>

          {!claimed ? (
            <Button
              onClick={handleClaim}
              className="bg-white text-[#09203F] font-bold hover:bg-green-400 transition"
            >
              Claim Now
            </Button>
          ) : (
            <p className="text-green-400 font-semibold">
              Offer Already Claimed
            </p>
          )}

          {showAnim && (
            <div className="mt-6">
              <Lottie animationData={Celebration} loop={false} />
            </div>
          )}
        </div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
        >
          <Alert
            onClose={() => setToastOpen(false)}
            severity="success" // success | error | warning | info
            sx={{ width: "100%" }}
          >
            {uploadMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

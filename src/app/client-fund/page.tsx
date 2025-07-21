"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Avatar,
} from "@mui/material";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";
import NavMenu from "@/components/Navmenu";

interface UserFundResponse {
  balance: number;
}

export default function UserFund() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const { user, loading } = useClientAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchUserFund = async () => {
      try {
        const res = await axios.get<UserFundResponse>(
          "https://taskora-main-backend.onrender.com/client/fund",
          { withCredentials: true }
        );
        setBalance(res.data.balance);
      } catch {
        setBalance(null);
      }
    };

    if (user) fetchUserFund();
  }, [user]);

  if (loading || !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{
          background: "linear-gradient(to right, #09203F, #537895)",
        }}
      >
        <CircularProgress sx={{ color: "#F5A742" }} />
      </Box>
    );
  }

  return (
    <>
      <NavMenu />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="90vh"
        sx={{
          background: "linear-gradient(to right, #09203F, #537895)",
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            maxWidth: 400,
            width: "100%",
            borderRadius: 4,
            p: { xs: 4, sm: 5 },
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            sx={{ color: "#fff" }}
          >
            My Wallet
          </Typography>

          <Avatar
            sx={{
              bgcolor: "#2ecc71",
              width: 120,
              height: 120,
              fontSize: 24,
              fontWeight: "bold",
              color: "#fff",
              margin: "0 auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {balance !== null ? `৳${balance.toFixed(2)}` : "৳0.00"}
          </Avatar>

          <Typography
            variant="body1"
            mt={3}
            sx={{ color: "#ddd", fontWeight: 500 }}
          >
            {balance !== null
              ? "Available Balance"
              : "Unable to fetch wallet balance"}
          </Typography>
        </Paper>
      </Box>
    </>
  );
}

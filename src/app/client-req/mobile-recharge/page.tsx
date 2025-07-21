"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Snackbar,
  Paper,
} from "@mui/material";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";

const operators = ["Grameenphone", "Robi", "Airtel", "Banglalink", "Teletalk"];
const simTypes = ["Prepaid", "Postpaid"];

export default function RechargeForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useClientAuth();

  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const [simType, setSimType] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [error, setError] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  interface WalletResponse {
    balance: number;
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/log-in");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get<WalletResponse>(
          "http://localhost:5000/client/fund",
          { withCredentials: true }
        );
        setWalletBalance(res.data.balance || 0);
      } catch {
        console.log("Failed to fetch wallet balance");
      }
    };

    if (user) fetchWallet();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const rechargeAmount = parseFloat(amount);
    if (walletBalance === 0) {
      setError("Insufficient funds. Please add money first.");
      setLoading(false);
      return;
    }
    if (rechargeAmount > walletBalance) {
      setError("Requested amount exceeds wallet balance.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/client/recharge",
        { mobileNumber, amount: rechargeAmount, operator, simType, password },
        { withCredentials: true }
      );

      setToastOpen(true);
      setMobileNumber("");
      setAmount("");
      setOperator("");
      setSimType("");
      setPassword("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Recharge request failed.");
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    InputProps: {
      sx: {
        color: "#fff",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#fff",
        },
      },
    },
    InputLabelProps: {
      sx: {
        color: "#fff",
        "&.Mui-focused": { color: "#fff" },
      },
    },
  };

  if (authLoading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ background: "linear-gradient(to right, #09203F, #537895)" }}
      >
        <CircularProgress sx={{ color: "#F5A742" }} />
      </Box>
    );
  }

  if (!authLoading && !user) {
    return null;
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
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            maxWidth: 450,
            width: "100%",
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={2}
            sx={{ color: "#fff" }}
          >
            Mobile Recharge
          </Typography>

          <Typography
            textAlign="center"
            mb={2}
            sx={{ color: "#ddd", fontWeight: 500 }}
          >
            Wallet Balance: ৳{walletBalance.toFixed(2)}
          </Typography>

          {error && (
            <Typography
              color="error"
              textAlign="center"
              fontSize={13}
              mb={2}
              fontWeight={500}
            >
              {error}
            </Typography>
          )}

          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={2}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              select
              label="Operator"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              required
              fullWidth
              {...textFieldStyles}
            >
              {operators.map((op) => (
                <MenuItem key={op} value={op}>
                  {op}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="SIM Type"
              value={simType}
              onChange={(e) => setSimType(e.target.value)}
              required
              fullWidth
              {...textFieldStyles}
            >
              {simTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              {...textFieldStyles}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#2ecc71",
                color: "#fff",
                borderRadius: 2,
                fontWeight: "bold",
                py: 1.3,
                "&:hover": { bgcolor: "#00C9A7" },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Submit Recharge Request"
              )}
            </Button>
          </Box>
        </Paper>
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
            Recharge Request Submitted!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

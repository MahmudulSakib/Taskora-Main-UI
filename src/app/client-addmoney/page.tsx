"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";

const paymentMethods = [
  { value: "Bkash", number: "017xxxxxxxx" },
  { value: "Rocket", number: "018xxxxxxxx" },
  { value: "Upay", number: "019xxxxxxxx" },
];

export default function AddMoneyForm() {
  const { user, loading: authloading } = useClientAuth();
  const router = useRouter();
  const [method, setMethod] = useState(paymentMethods[0]);
  const [senderNumber, setSenderNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (!authloading && !user) {
      router.replace("/log-in");
    }
  }, [authloading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setToastMessage("Please enter your password.");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://taskora-main-backend.onrender.com/client/add-money-request",
        {
          paymentMethod: method.value,
          merchantNumber: method.number,
          senderNumber,
          amount,
          password,
        },
        { withCredentials: true }
      );

      setToastMessage("Money request submitted!");
      setToastSeverity("success");
      setToastOpen(true);

      setSenderNumber("");
      setAmount("");
      setPassword("");
      router.push("/");
    } catch (err: any) {
      setToastMessage(err.response?.data?.error || "Request failed.");
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    sx: {
      input: { color: "white" },
      label: { color: "white" },
      "& label.Mui-focused": { color: "white" },
      "& .MuiOutlinedInput-root": {
        color: "white",
        "& fieldset": { borderColor: "white" },
        "&:hover fieldset": { borderColor: "white" },
        "&.Mui-focused fieldset": { borderColor: "white" },
        "& svg": { color: "white" },
      },
    },
  };

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        minHeight="90vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            maxWidth: 450,
            width: "100%",
            borderRadius: 4,
            p: { xs: 4, sm: 5 },
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            mb={3}
            sx={{ color: "#fff" }}
          >
            Add Money
          </Typography>

          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={2}
            onSubmit={handleSubmit}
          >
            <TextField
              select
              label="Payment Method"
              value={method.value}
              onChange={(e) =>
                setMethod(
                  paymentMethods.find((m) => m.value === e.target.value)!
                )
              }
              required
              fullWidth
              {...textFieldStyles}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      background: "linear-gradient(to right, #09203F, #537895)",
                      color: "white",
                    },
                  },
                },
              }}
            >
              {paymentMethods.map((m) => (
                <MenuItem
                  key={m.value}
                  value={m.value}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "#274060" },
                  }}
                >
                  {m.value} (To: {m.number})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Your Payment Number (Sender)"
              placeholder="e.g. 01XXXXXXXXX"
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
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
              label="Confirm Password"
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
              fullWidth
              sx={{
                bgcolor: "#2ecc71",
                color: "#fff",
                borderRadius: 2,
                py: 1.3,
                fontWeight: "bold",
                "&:hover": { bgcolor: "#00C9A7" },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Submit Request"
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
            severity={toastSeverity}
            sx={{ width: "100%" }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

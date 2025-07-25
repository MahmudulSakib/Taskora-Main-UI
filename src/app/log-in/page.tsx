"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Link from "next/link";
import axios from "axios";
import useClientAuth from "@/hooks/useClientAuth";

export default function LoginPage() {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  const { setUser, setLoading: setGlobalLoading } = useClientAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // try {
    //   await axios.post(
    //     "https://taskora-main-backend.onrender.com/client/log-in",
    //     { mobileNumber, password },
    //     { withCredentials: true }
    //   );
    //   router.push("/");
    // } catch (err: any) {
    //   setError(err.response?.data?.error || "Login failed");
    // } finally {
    //   setLoading(false);
    // }

    try {
      const res = await axios.post<any>(
        "https://taskora-main-backend.onrender.com/client/log-in",
        { mobileNumber, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setGlobalLoading(false);

      setMessage("Successfully Login!");
      setToastOpen(true);

      router.push("/");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Login failed");
      setToastOpen(true);
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

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background:
          "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
        position: "relative",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.2)",
          zIndex: 10,
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={3}
            sx={{ color: "#fff" }}
          >
            Log In
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            display="flex"
            flexDirection="column"
            gap={2}
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
              size="large"
              sx={{
                bgcolor: "#2ecc71",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 2,
                py: 1.3,
                "&:hover": { bgcolor: "#00C9A7" },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Log In"
              )}
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: "#fff", mt: 1 }}
            >
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                style={{
                  color: "#2ecc71",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Link>
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: "#fff", mt: 1 }}
            >
              <Link
                href="/forgot-password"
                style={{
                  color: "#2ecc71",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box
        position="absolute"
        bottom={10}
        textAlign="center"
        width="100%"
        sx={{ color: "#fff", fontSize: 12 }}
      >
        © 2025 Good Life
      </Box>

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
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

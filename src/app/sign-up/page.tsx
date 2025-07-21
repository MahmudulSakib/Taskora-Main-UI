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
import axios from "axios";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    referCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleClose = () => setOpen(false);

  const showToast = (
    msg: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setToastMessage(msg);
    setToastSeverity(severity);
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    type SignUpResponse = {
      message: string;
    };

    try {
      setLoading(true);
      const res = await axios.post<SignUpResponse>(
        "https://taskora-main-backend.onrender.com/client/sign-up",
        formData
      );

      showToast("Signup successful! Please check your email.", "success");
      setTimeout(() => {
        router.push("/verify-message");
      }, 1500);
    } catch (err: any) {
      showToast(err.response?.data?.error || "Signup failed", "error");
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
        background: "linear-gradient(to right, #09203F, #537895)",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={2}
            color="#fff"
          >
            Create Account
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            mb={3}
            sx={{ color: "#ddd" }}
          >
            Sign up to access exclusive features and services.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Referral Code (Optional)"
              name="referCode"
              value={formData.referCode}
              onChange={handleChange}
              fullWidth
              {...textFieldStyles}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: "#2ecc71",
                color: "#fff",
                borderRadius: 2,
                fontWeight: "bold",
                mt: 1,
                py: 1.3,
                "&:hover": { bgcolor: "#00C9A7" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Sign Up"
              )}
            </Button>
          </Box>

          <Typography
            variant="body2"
            textAlign="center"
            mt={3}
            sx={{ color: "#fff" }}
          >
            Already have an account?{" "}
            <Link
              href="/log-in"
              style={{
                color: "#2ecc71",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Log In
            </Link>
          </Typography>
        </CardContent>
      </Card>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={toastSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

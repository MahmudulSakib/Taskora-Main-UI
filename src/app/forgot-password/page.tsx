"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

type ForgotPasswordResponse = {
  message: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post<ForgotPasswordResponse>(
        "https://taskora-main-backend.onrender.com/client/forgot-password",
        { email }
      );
      setMessage(res.data.message);
      setEmail("");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Try again later.");
      }
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
          Forgot Password
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "#ccc" }}
        >
          Enter your email address and we’ll send you a reset link.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Email Address"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            {...textFieldStyles}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth
            sx={{
              bgcolor: "#2ecc71",
              fontWeight: "bold",
              borderRadius: 2,
              py: 1.3,
              "&:hover": { bgcolor: "#00C9A7" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Send Reset Link"
            )}
          </Button>

          {message && (
            <Typography
              variant="body2"
              textAlign="center"
              sx={{
                mt: 2,
                color: message.toLowerCase().includes("not registered")
                  ? "red"
                  : "#4caf50",
                fontWeight: 500,
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

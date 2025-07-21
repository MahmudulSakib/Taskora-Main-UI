"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

type ResetPasswordResponse = {
  message: string;
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post<ResetPasswordResponse>(
        "http://localhost:5000/client/reset-password",
        {
          token,
          newPassword: password,
        }
      );
      setMessage(res.data.message);
      setTimeout(() => router.push("/log-in"), 3000);
    } catch (err) {
      setMessage("Invalid or expired token.");
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
          Reset Password
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "#ccc" }}
        >
          Enter your new password below.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            {...textFieldStyles}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            {...textFieldStyles}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: "#2ecc71",
              borderRadius: 2,
              py: 1.3,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#00C9A7" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Reset Password"
            )}
          </Button>

          {message && (
            <Typography
              variant="body2"
              textAlign="center"
              sx={{
                mt: 2,
                color: message.toLowerCase().includes("success")
                  ? "#4caf50"
                  : "red",
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

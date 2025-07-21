"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { Alert } from "@mui/material";

export default function JobPostForm({
  onPostSuccess = () => {},
}: {
  onPostSuccess?: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [limit, setLimit] = useState("");
  const [cost, setCost] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [wallet, setWallet] = useState<number | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const { loading, user } = useClientAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [loading, user, router]);

  // ✅ Fetch wallet after auth success
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get<{ balance: number }>(
          "https://taskora-main-backend.onrender.com/client/fund",
          {
            withCredentials: true,
          }
        );
        setWallet(Number(res.data.balance) || 0);
      } catch (err) {
        console.error("Failed to fetch wallet", err);
      }
    };

    if (!loading && user) {
      fetchWallet();
    }
  }, [loading, user]);

  const totalCost =
    !isNaN(+limit) && !isNaN(+cost) ? Number(limit) * Number(cost) * 3 : 0;

  const handleSubmit = async () => {
    if (!title || !link || !limit || !cost || !password || !image) {
      setUploadMessage("All Fields are required!");
      setToastOpen(true);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("link", link);
      formData.append("limit", limit);
      formData.append("costPerLimit", cost);
      formData.append("description", description);
      formData.append("password", password);
      formData.append("image", image);

      const res = await axios.post<any>(
        "https://taskora-main-backend.onrender.com/client/job-post",
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data?.error) {
        alert(res.data.error);
        return;
      }

      setUploadMessage("Job posted successfully");
      setToastOpen(true);
      setTitle("");
      setLink("");
      setLimit("");
      setCost("");
      setPassword("");
      setImage(null);
      setDescription("");
      onPostSuccess?.();
      router.push("/client-joblist");
    } catch (err: any) {
      console.error("Job post error:", err);
      alert(err?.response?.data?.error || "Failed to submit job.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles = {
    "& label": { color: "#fff" },
    "& label.Mui-focused": { color: "#fff" },
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#fff" },
    },
    input: { color: "#fff" },
    textarea: { color: "#fff" },
  };

  // ✅ Block UI while checking auth or waiting to redirect
  if (loading || !user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #09203F, #537895)",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return (
    <>
      <NavMenu />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #09203F, #537895)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            maxWidth: 600,
            width: "100%",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid transparent",
            transition: "border-color 0.3s ease",
            "&:hover": { borderColor: "#fff" },
            color: "#fff",
          }}
        >
          <Typography variant="h4" fontWeight="bold" align="center" mb={1}>
            Post a Job
          </Typography>

          <Typography
            align="center"
            mb={2}
            sx={{ fontSize: "1rem", color: "#DDDDDD", fontWeight: "bold" }}
          >
            Wallet Balance: ৳ {wallet !== null ? wallet : "Loading..."}
          </Typography>

          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              sx={inputStyles}
            />
            <TextField
              label="Job Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              fullWidth
              sx={inputStyles}
            />
            <TextField
              label="Job Limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              fullWidth
              sx={inputStyles}
            />
            <TextField
              label="Cost Per Limit"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <span className="text-white">৳</span>
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <TextField
              label="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              sx={inputStyles}
            />

            <Box>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  ":hover": {
                    borderColor: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Choose Image
                <input
                  type="file"
                  hidden
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </Button>
              {image && (
                <Typography mt={1} fontSize={14}>
                  {image.name}
                </Typography>
              )}
            </Box>

            <TextField
              label="Confirm Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={inputStyles}
            />

            <Typography fontWeight="bold" color="#00C9A7">
              Total Cost: ৳ {totalCost}
            </Typography>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                backgroundColor: "#2ecc71",
                ":hover": { backgroundColor: "#00C9A7" },
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {submitting ? "Submitting..." : "Submit Job Post"}
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
            {uploadMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

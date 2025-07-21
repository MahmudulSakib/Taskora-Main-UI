"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Input,
  Button,
  Snackbar,
} from "@mui/material";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";

type Job = {
  id: string;
  title: string;
  link: string;
  limit: string;
  costPerLimit: string;
  totalCost: string;
  imageUrl: string;
  description: string;
  status: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
};

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const { loading: authloading, user } = useClientAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [router, loading, user]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get<any>(
          `https://taskora-main-backend.onrender.com/api/accepted-jobs/${id}`,
          { withCredentials: true }
        );
        setJob(res.data);
      } catch (error) {
        console.error("Failed to fetch job", error);
      } finally {
        setLoading(false);
      }
    };

    const checkSubmission = async () => {
      try {
        const res = await axios.get<any>(
          `https://taskora-main-backend.onrender.com/api/jobs/${id}/check-submission`,
          { withCredentials: true }
        );
        setAlreadySubmitted(res.data.submitted);
      } catch (error) {
        console.error("Submission check failed", error);
      }
    };

    if (!authloading && user) {
      fetchJob();
      checkSubmission();
    } else if (!authloading && !user) {
      router.replace("/log-in");
    }
  }, [id, authloading, user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 15) {
      setUploadMessage("Maximum 15 images allowed.");
      setToastOpen(true);
      return;
    }
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleSubmitProof = async () => {
    if (files.length === 0) {
      setUploadMessage("Please select images first.");
      setToastOpen(true);

      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(
        `https://taskora-main-backend.onrender.com/api/jobs/${id}/submit-proof`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setUploadMessage("Proof submitted successfully!");
      setToastOpen(true);
      setFiles([]);
      setAlreadySubmitted(true);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to upload images.";
      setUploadMessage(msg);
      setToastOpen(true);
    }
  };

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  if (!job) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
        }}
      >
        <Typography variant="h6" color="error">
          Job not found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <NavMenu />
      <Box
        sx={{
          minHeight: "90vh",
          py: 6,
          px: 2,
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
          display: "flex",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            backdropFilter: "blur(15px)",
            padding: 4,
          }}
        >
          <Card sx={{ background: "transparent", boxShadow: "none" }}>
            <CardMedia
              component="img"
              height="240"
              image={job.imageUrl}
              alt={job.title}
              sx={{
                borderRadius: 3,
                height: "200px",
                cursor: "pointer",
              }}
              onClick={() => setPreviewImage(job.imageUrl)}
            />
            <CardContent>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#90ee90" }}
              >
                {job.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "#ddd" }} gutterBottom>
                {job.description}
              </Typography>
              <Typography variant="body2" sx={{ color: "#bbb" }}>
                Limit: {job.limit} | Cost/Limit: ${job.costPerLimit}
              </Typography>
              <Typography variant="body2" sx={{ color: "#90ee90" }} mt={1}>
                Status: Open
              </Typography>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Box mt={1} ml={2}>
            <Typography variant="h6" gutterBottom>
              Submit Proof of Work
            </Typography>
            <Input
              type="file"
              inputProps={{ multiple: true, accept: "image/*" }}
              onChange={handleFileChange}
              sx={{
                color: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 1,
                px: 1,
                mt: 1,
              }}
              disabled={alreadySubmitted}
            />
            <Typography variant="body2" mt={1} sx={{ color: "white" }}>
              Selected: {files.length} / 15
            </Typography>

            {/* Previews */}
            <Box mt={2} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {files.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <Box
                    key={idx}
                    component="img"
                    src={url}
                    alt={`proof-${idx}`}
                    onClick={() => setPreviewImage(url)}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "1px solid rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      "&:hover": {
                        transform: "scale(1.05)",
                        borderColor: "#90caf9",
                        boxShadow: "0 4px 16px rgba(144, 202, 249, 0.6)",
                        cursor: "pointer",
                      },
                    }}
                  />
                );
              })}
            </Box>

            {/* Buttons */}
            <a href={job.link} target="_blank" rel="noopener noreferrer">
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#2ecc71",
                  color: "#fff",
                  width: "100%",
                  py: 1.2,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#00C9A7",
                  },
                }}
              >
                Go to Job
              </Button>
            </a>

            <Button
              variant="contained"
              onClick={handleSubmitProof}
              disabled={files.length === 0 || alreadySubmitted}
              sx={{
                mt: 2,
                backgroundColor: alreadySubmitted ? "#ccc" : "#2ecc71",
                color: "#fff",
                width: "100%",
                py: 1.2,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: alreadySubmitted ? "#ccc" : "#00C9A7",
                  cursor: alreadySubmitted ? "not-allowed" : "pointer",
                },
              }}
            >
              {alreadySubmitted ? "Proof Already Submitted" : "Submit Proof"}
            </Button>

            {/* {uploadMessage && (
              <Typography mt={2} sx={{ color: "#90caf9" }}>
                {uploadMessage}
              </Typography>
            )} */}
          </Box>
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
            {uploadMessage}
          </Alert>
        </Snackbar>
      </Box>

      {/* Fullscreen Image Preview */}
      {previewImage && (
        <Box
          onClick={() => setPreviewImage(null)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <Box
            component="img"
            src={previewImage}
            alt="Preview"
            sx={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 2,
              boxShadow: "0 0 30px rgba(255,255,255,0.2)",
            }}
          />
        </Box>
      )}
    </>
  );
}

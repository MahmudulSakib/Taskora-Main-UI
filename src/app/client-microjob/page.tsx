"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";

type Job = {
  id: string;
  title: string;
  link: string;
  leftlimit: string;
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

const PAGE_SIZE = 50;

export default function AcceptedJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { loading: authloading, user } = useClientAuth();

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
  const paginatedJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [router, loading, user]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get<any>(
          "http://localhost:5000/api/accepted-jobs",
          {
            withCredentials: true,
          }
        );
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch accepted jobs", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authloading && user) {
      fetchJobs();
    } else if (!authloading && !user) {
      router.replace("/log-in");
    }
  }, [authloading, user, router]);

  if (loading) {
    return (
      <Box mt={10} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #09203F, #537895)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          py: 6,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1200px", px: 2 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "left" }}
          >
            Job Posts
          </Typography>

          <Stack spacing={4}>
            {paginatedJobs.map((job) => (
              <Box
                key={job.id}
                sx={{
                  backdropFilter: "blur(10px)",
                  background: "rgba(255, 255, 255, 0.07)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    borderColor: "#fff",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={job.imageUrl}
                  alt={job.title}
                  sx={{ objectFit: "cover", height: "200px" }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    {job.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ddd" }}>
                    Left Limit: {job.leftlimit} | Get Money/Limit: $
                    {job.costPerLimit}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "#ccc" }}>
                    {job.description.slice(0, 100)}...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "#90ee90" }}>
                    Status: Open
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "#bbb" }}>
                    Posted by: {job.user.fullName} ({job.user.email})
                  </Typography>
                  <Button
                    href={`/client-microjob/${job.id}`}
                    sx={{
                      mt: 2,
                      width: "100%",
                      color: "#fff",
                      backgroundColor: "#2ecc71",
                      "&:hover": {
                        backgroundColor: "#00C9A7",
                        color: "#fff",
                      },
                    }}
                    variant="contained"
                  >
                    View Job
                  </Button>
                </CardContent>
              </Box>
            ))}
          </Stack>

          {totalPages > 1 && (
            <Box mt={5} textAlign="center">
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                sx={{ mr: 2, color: "#fff", borderColor: "#fff" }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                sx={{ color: "#fff", borderColor: "#fff" }}
              >
                Next
              </Button>
              <Typography mt={2} variant="body2" color="white">
                Page {page} of {totalPages}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

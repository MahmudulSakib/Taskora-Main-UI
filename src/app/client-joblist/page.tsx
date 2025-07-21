"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";

export default function JobPostList() {
  const router = useRouter();
  const { user, loading } = useClientAuth();
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [loading, user, router]);

  const fetchMyJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await axios.get<any>(
        "https://taskora-main-backend.onrender.com/client/my-jobs",
        {
          withCredentials: true,
        }
      );
      setMyJobs(res.data || []);
    } catch (err) {
      console.log("Unauthorized");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return { label: "Accepted", color: "success" };
      case "rejected":
        return { label: "Rejected", color: "error" };
      default:
        return { label: "Pending", color: "warning" };
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = myJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(myJobs.length / jobsPerPage);

  return (
    <>
      <NavMenu />
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          px: 2,
          background: "linear-gradient(to right, #09203F, #537895)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box width="100%" maxWidth="800px">
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={4}
            color="white"
            textAlign="left"
          >
            Your Posted Jobs
          </Typography>

          {loadingJobs ? (
            <Typography color="white" textAlign="center">
              Loading jobs...
            </Typography>
          ) : myJobs.length === 0 ? (
            <Typography color="white" textAlign="center">
              No jobs posted yet.
            </Typography>
          ) : (
            <>
              <Box display="flex" flexDirection="column" gap={3}>
                {currentJobs.map((job: any) => {
                  const statusInfo = getStatusColor(job.status);
                  return (
                    <Paper
                      key={job.id}
                      elevation={6}
                      sx={{
                        background: "rgba(255, 255, 255, 0.05)",
                        p: 3,
                        borderRadius: 3,
                        color: "#fff",
                        backdropFilter: "blur(10px)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.01)",
                        },
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {job.title}
                        </Typography>
                        <Chip
                          label={statusInfo.label}
                          color={
                            statusInfo.color as
                              | "success"
                              | "error"
                              | "warning"
                              | "primary"
                              | "secondary"
                              | "default"
                              | "info"
                          }
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>

                      <Typography variant="body2" mb={1}>
                        <strong>Link:</strong>{" "}
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#90caf9",
                            wordBreak: "break-word",
                          }}
                        >
                          {job.link}
                        </a>
                      </Typography>

                      <Box mb={1}>
                        <Typography variant="body2" component="div">
                          <strong>Description:</strong>
                          <Box
                            sx={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              mt: 0.5,
                              p: 1.5,
                              backgroundColor: "rgba(255,255,255,0.07)",
                              borderRadius: 1,
                              fontSize: 14,
                              maxHeight: 120,
                              overflowY: "auto",
                            }}
                          >
                            {job.description}
                          </Box>
                        </Typography>
                      </Box>

                      <Typography variant="body2" mb={1}>
                        <strong>Limit:</strong> {job.limit} |{" "}
                        <strong>Cost/Limit:</strong> ৳{job.costPerLimit}
                      </Typography>
                      <Typography variant="body2" mb={2}>
                        <strong>Total:</strong> ৳{job.totalCost}
                      </Typography>

                      {job.imageUrl && (
                        <Box
                          component="img"
                          src={job.imageUrl}
                          alt="Job banner"
                          sx={{
                            width: "100%",
                            borderRadius: 1,
                            maxHeight: 200,
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Paper>
                  );
                })}
              </Box>

              {/* Pagination Buttons */}
              {totalPages > 1 && (
                <Box
                  mt={4}
                  display="flex"
                  justifyContent="center"
                  gap={1}
                  flexWrap="wrap"
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor:
                          i + 1 === currentPage ? "#2ecc71" : "#ffffff22",
                        color: i + 1 === currentPage ? "#000" : "#fff",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

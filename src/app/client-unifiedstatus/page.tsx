"use client";

import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import { useRouter } from "next/navigation";
import useClientAuth from "@/hooks/useClientAuth";

interface TimelineItem {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  detail: string;
}

export default function UnifiedTimeline() {
  const router = useRouter();
  const { user, loading: authloading } = useClientAuth();
  const [data, setData] = useState<TimelineItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authloading && !user) {
      router.replace("/log-in");
    }
  }, [authloading, user, router]);

  const fetchTimeline = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await axios.get<any>(
        `https://taskora-main-backend.onrender.com/client/status-timeline?page=${currentPage}`,
        { withCredentials: true }
      );

      setData(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTimeline(page);
  }, [page, user]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        minHeight="90vh"
        py={6}
        sx={{
          background: "linear-gradient(to right, #09203F, #537895)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Transaction and Activity
          </Typography>

          {loading ? (
            <Box textAlign="center" mt={4}>
              <CircularProgress color="inherit" />
            </Box>
          ) : (
            <Paper
              elevation={3}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>#</TableCell>
                      <TableCell sx={{ color: "white" }}>Type</TableCell>
                      <TableCell sx={{ color: "white" }}>Detail</TableCell>
                      <TableCell sx={{ color: "white" }}>Status</TableCell>
                      <TableCell sx={{ color: "white" }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.08)",
                          },
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>
                          {(page - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", textTransform: "capitalize" }}
                        >
                          {item.type.replace("_", " ")}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {item.detail}
                        </TableCell>
                        <TableCell
                          sx={{
                            color:
                              item.status === "pending"
                                ? "orange"
                                : item.status === "accepted"
                                ? "lightgreen"
                                : "red",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.status}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={2}
                bgcolor="#00C9A7"
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
}

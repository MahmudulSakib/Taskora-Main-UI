"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Link,
  Container,
} from "@mui/material";
import { format } from "date-fns";
import NextLink from "next/link";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";

interface Offer {
  id: string;
  title: string;
  isSimType: boolean;
  simType: string | null;
  duration: string;
  validation: string;
  purchaseAmount: string;
  createdAt: string;
}

const PAGE_LIMIT = 50;

export default function DriveOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalOffers, setTotalOffers] = useState(0);

  const { user, loading: authload } = useClientAuth();

  const fetchOffers = async (pg: number) => {
    try {
      setLoading(true);
      const res = await axios.get<{ offers: Offer[]; total: number }>(
        "https://taskora-main-backend.onrender.com/client/drive-offers",
        {
          params: { limit: PAGE_LIMIT, offset: pg * PAGE_LIMIT },
          withCredentials: true,
        }
      );
      setOffers(res.data.offers);
      setTotalOffers(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch offers", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authload) {
      if (!user) {
        router.replace("/log-in");
      } else {
        fetchOffers(page);
      }
    }
  }, [authload, user, page]);

  if (authload || (!user && !authload)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <>
      <NavMenu />
      <Box
        sx={{
          px: 0,
          py: 4,
          minHeight: "100vh",
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#fff", textAlign: "left" }}
          >
            Drive Offers
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={6}>
              <CircularProgress sx={{ color: "white" }} />
            </Box>
          ) : offers.length === 0 ? (
            <Typography textAlign="center" color="white" mt={4}>
              No drive offers available.
            </Typography>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  color: "#f5f5f5",
                }}
              >
                <Table size="small" sx={{ minWidth: "100%" }}>
                  <TableHead>
                    <TableRow>
                      {[
                        "Title",
                        "Type",
                        "Duration",
                        "Validation",
                        "Price",
                        "Created",
                      ].map((heading) => (
                        <TableCell
                          key={heading}
                          sx={{
                            color: "#f5f5f5",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {heading}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <Link
                            component={NextLink}
                            href={
                              offer.isSimType
                                ? `/client-req/mobile-recharge`
                                : `/general-offer/${offer.id}`
                            }
                            sx={{
                              color: "#BBDEFB",
                              fontWeight: "bold",
                              textDecoration: "none",
                            }}
                          >
                            {offer.title}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ color: "#e0e0e0" }}>
                          {offer.isSimType
                            ? `SIM (${offer.simType})`
                            : "General"}
                        </TableCell>
                        <TableCell sx={{ color: "#e0e0e0" }}>
                          {offer.duration}
                        </TableCell>
                        <TableCell sx={{ color: "#e0e0e0" }}>
                          {offer.validation}
                        </TableCell>
                        <TableCell sx={{ color: "#e0e0e0" }}>
                          ৳ {offer.purchaseAmount}
                        </TableCell>
                        <TableCell sx={{ color: "#e0e0e0" }}>
                          {format(
                            new Date(offer.createdAt),
                            "dd MMM yyyy, hh:mm a"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalOffers > PAGE_LIMIT && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <TablePagination
                    component="div"
                    count={totalOffers}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={PAGE_LIMIT}
                    rowsPerPageOptions={[PAGE_LIMIT]}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

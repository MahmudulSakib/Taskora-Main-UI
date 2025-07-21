"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";

// Mask email without domain
function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain || name.length < 1) return "****@" + domain;
  return name[0] + "****@" + domain;
}

export default function UserRankList() {
  const { user, loading } = useClientAuth();
  const router = useRouter();
  const [users, setUsers] = useState<
    { id: string; fullName: string; email: string; rank: number }[]
  >([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    axios
      .get<any>("https://taskora-main-backend.onrender.com/client/user-ranks", {
        withCredentials: true,
      })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
          py: 6,
          px: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 900,
            margin: "0 auto",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            color: "white",
            boxShadow: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              👥 User Rank List
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ background: "transparent" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>#</TableCell>
                    <TableCell sx={{ color: "white" }}>Full Name</TableCell>
                    <TableCell sx={{ color: "white" }}>Email</TableCell>
                    <TableCell sx={{ color: "white" }}>Rank</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {user.fullName}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {maskEmail(user.email)}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>{user.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

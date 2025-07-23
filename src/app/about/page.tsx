"use client";

import NavMenu from "@/components/Navmenu";
import { Box, Typography, Container, Divider } from "@mui/material";

export default function AboutSection() {
  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
          py: { xs: 8, md: 12 },
          color: "white",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(18px)",
              borderRadius: "20px",
              p: { xs: 4, md: 6 },
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              About Us
            </Typography>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 3 }} />

            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Welcome to <strong>Good Life</strong> — your all-in-one digital
              platform for earning, managing, and spending smarter. We bring
              together job automation, mobile recharges, AI subscriptions, and
              micro-earning in one secure and easy-to-use space.
            </Typography>

            <Box
              mt={4}
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={4}
            >
              <Box flex={1}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🚀 Our Mission
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  To democratize digital earnings and empower every user with
                  the tools to grow their income through secure and rewarding
                  online activities.
                </Typography>
              </Box>

              <Box flex={1}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  💡 What We Offer
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  From mobile banking to bonus wallets, job submissions,
                  quizzes, and AI tools — our features are designed to make your
                  digital journey simple, effective, and profitable.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

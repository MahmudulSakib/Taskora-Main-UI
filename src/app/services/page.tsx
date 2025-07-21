"use client";

import { Box, Typography, Container } from "@mui/material";
import { Build, CreditScore, Paid, SupportAgent } from "@mui/icons-material";
import NavMenu from "@/components/Navmenu";

export default function ServiceSection() {
  const services = [
    {
      title: "Smart Wallet",
      icon: <Paid fontSize="large" />,
      description:
        "Securely manage your digital balance, add money, and track all your spending & rewards.",
    },
    {
      title: "Job & Task Earnings",
      icon: <Build fontSize="large" />,
      description:
        "Submit jobs, proofs, daily quizzes and earn bonuses directly to your wallet.",
    },
    {
      title: "Mobile Recharge",
      icon: <CreditScore fontSize="large" />,
      description:
        "Instant top-up for your mobile using your wallet — anytime, any operator.",
    },
    {
      title: "24/7 Support",
      icon: <SupportAgent fontSize="large" />,
      description:
        "Have a question? Our support team is always ready to assist you.",
    },
  ];

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
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 700, textAlign: "center", mb: 6 }}
          >
            Our Services
          </Typography>

          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
            {services.map((service, index) => (
              <Box
                key={index}
                sx={{
                  background: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "16px",
                  p: 4,
                  width: { xs: "100%", sm: "45%", md: "22%" },
                  minHeight: 200,
                  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Box mb={2}>{service.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {service.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
}

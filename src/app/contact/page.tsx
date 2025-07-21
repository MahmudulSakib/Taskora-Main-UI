"use client";

import NavMenu from "@/components/Navmenu";
import { Box, Typography, Container, Divider } from "@mui/material";

export default function ContactSection() {
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
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            fontWeight={700}
            mb={6}
          >
            Contact Us
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
          >
            {/* Contact Info */}
            <Box
              sx={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(14px)",
                borderRadius: 4,
                p: 4,
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Office Location
              </Typography>

              <Typography variant="body1" mb={2} sx={{ lineHeight: 1.8 }}>
                Taskora HQ
                <br />
                5th Avenue, Manhattan
                <br />
                New York, NY 10001, USA
              </Typography>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                <strong>Email:</strong> support@taskora.com <br />
                <strong>Phone:</strong> +1 (212) 555-1234 <br />
                <strong>Hours:</strong> Mon–Fri, 9AM–6PM EST
              </Typography>
            </Box>

            {/* Map */}
            <Box
              sx={{
                flex: 1,
                minHeight: 400,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              <iframe
                title="New York Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.9008424768656!2d-73.99108308459292!3d40.74881727932759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af18e3d7ef%3A0x345df78df932e1c!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1625827989580!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

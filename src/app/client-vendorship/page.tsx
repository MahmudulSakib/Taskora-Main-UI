"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";

export default function VendorShipForm() {
  const router = useRouter();
  const [toastOpen, setToastOpen] = useState(false);
  const { user, loading } = useClientAuth();
  const [form, setForm] = useState({
    shopName: "",
    shopAddress: "",
    contactNumber: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [loading, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        "https://taskora-main-backend.onrender.com/client/vendor-ship",
        form,
        {
          withCredentials: true,
        }
      );
      setMessage(
        "Thank you for applying, Our team will contact with you shortly."
      );
      setToastOpen(true);
      setForm({ shopName: "", shopAddress: "", contactNumber: "", email: "" });
    } catch (err) {
      setMessage(" Submission failed. Please try again.");
      setToastOpen(true);
    }
  };

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        minHeight="90vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "white",
            }}
          >
            <Typography variant="h5" mb={3} fontWeight="bold">
              Vendor Ship Request
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Shop Name"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  style: { color: "white" },
                }}
              />
              <TextField
                fullWidth
                label="Shop Address"
                name="shopAddress"
                value={form.shopAddress}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  style: { color: "white" },
                }}
              />
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  style: { color: "white" },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                required
                type="email"
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  style: { color: "white" },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#2ecc71",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#00C9A7" },
                }}
              >
                Submit
              </Button>
            </form>
            {/* {message && (
              <Typography
                variant="body1"
                mt={2}
                sx={{ color: message.startsWith("T") ? "lightgreen" : "red" }}
              >
                {message}
              </Typography>
            )} */}
          </Paper>
        </Container>
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
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

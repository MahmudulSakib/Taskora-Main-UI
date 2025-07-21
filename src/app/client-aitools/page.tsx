"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Typography,
  Fade,
  Backdrop,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import { useRouter } from "next/navigation";
import useClientAuth from "@/hooks/useClientAuth";
import { Columns } from "lucide-react";

interface AiPlan {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  createdAt: string;
}

export default function UserAiSubscriptionPlans() {
  const router = useRouter();
  const { user, loading: authloading } = useClientAuth();
  const [plans, setPlans] = useState<AiPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AiPlan | null>(null);

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [walletAmount, setWalletAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (!authloading && !user) {
      router.replace("/log-in");
    }
  }, [authloading, user, router]);

  const handleOpen = async (plan: AiPlan) => {
    setSelectedPlan(plan);
    setOpen(true);
    setMessage("");
    setEmail("");
    setMobile("");
    setPassword("");

    try {
      const res = await axios.get<any>(
        "https://taskora-main-backend.onrender.com/client/fund",
        {
          withCredentials: true,
        }
      );
      setWalletAmount(Number(res.data.balance));
    } catch (err) {
      setWalletAmount(null);
    }
  };

  const handleBuy = async () => {
    if (!selectedPlan || !email || !mobile || !password) {
      setMessage("All fields are required.");
      setToastOpen(true);
      return;
    }

    if (!walletAmount || walletAmount < selectedPlan.price) {
      setMessage("Insufficient wallet balance. Please add funds.");
      setToastOpen(true);
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post<any>(
        "https://taskora-main-backend.onrender.com/client/buy-ai-subscription",
        {
          planId: selectedPlan.id,
          email,
          mobileNumber: mobile,
          password,
        },
        { withCredentials: true }
      );

      if (res.data.needFund) {
        setMessage(res.data.message);
      } else if (res.data.success) {
        setOpen(false);
        setMessage("Subscription Successfully Purchase!");
        setToastOpen(true);
      } else {
        setMessage("Purchase failed.");
        setToastOpen(true);
      }
    } catch (err) {
      setMessage("Server error");
      setToastOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await axios.get<any>(
        "https://taskora-main-backend.onrender.com/client/available-ai-subscriptions",
        {
          withCredentials: true,
        }
      );
      setPlans(res.data);
      setLoading(false);
    };
    if (user) fetchPlans();
  }, [user]);

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
          minHeight: "100vh",
          color: "white",
          py: 8,
        }}
      >
        <Container>
          <Typography variant="h4" align="left" gutterBottom>
            AI Subscription Plans
          </Typography>

          {loading ? (
            <Box textAlign="center" mt={5}>
              <CircularProgress sx={{ color: "white" }} />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={3} mt={4}>
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                    color: "white",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: "all 0.3s",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 4,
                    py: 3,
                    "&:hover": {
                      transform: "scale(1.01)",
                      borderColor: "white",
                    },
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {plan.title}
                    </Typography>
                    <Typography>{plan.description}</Typography>
                    <Typography mt={1}>
                      Duration: {plan.duration} days
                    </Typography>
                    <Typography>Price: {plan.price} TK</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: "linear-gradient(to right, #2ecc71, #00C9A7)",
                      color: "white",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #00C9A7, #00C9A7)",
                      },
                      mt: { xs: 2, md: 0 },
                    }}
                    onClick={() => handleOpen(plan)}
                  >
                    Buy Now
                  </Button>
                </Card>
              ))}

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
          )}

          {/* Dialog */}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 400 }}
            BackdropComponent={Backdrop}
            BackdropProps={{
              sx: {
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(0,0,0,0.4)",
              },
            }}
            PaperProps={{
              sx: {
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(15px)",
                borderRadius: 4,
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                px: 3,
                py: 2,
              },
            }}
          >
            <DialogTitle>Purchase Subscription</DialogTitle>
            <DialogContent>
              <Typography mb={1}>
                <strong>Wallet Balance:</strong>{" "}
                {walletAmount !== null ? `${walletAmount} TK` : "Loading..."}
              </Typography>

              <TextField
                fullWidth
                label="Email"
                margin="dense"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <TextField
                fullWidth
                label="Mobile Number"
                margin="dense"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="dense"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpen(false)}
                sx={{ color: "white", textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBuy}
                disabled={submitting}
                sx={{
                  background: "linear-gradient(to right, #2ecc71, #00C9A7)",
                  color: "white",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    background: "linear-gradient(to right, #00C9A7, #00C9A7)",
                  },
                }}
              >
                {submitting ? "Processing..." : "Confirm"}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
}

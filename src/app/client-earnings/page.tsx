"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Container,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import { useRouter } from "next/navigation";
import useClientAuth from "@/hooks/useClientAuth";

export default function UserBonusWallet() {
  const router = useRouter();
  const { user, loading: authloading } = useClientAuth();
  const [wallet, setWallet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [form, setForm] = useState({
    amount: "",
    method: "mobile_banking",
    mobileBankType: "bkash",
    mobileNumber: "",
    accountNumber: "",
    branchName: "",
    accountName: "",
    bankName: "",
    password: "",
  });

  useEffect(() => {
    if (!authloading && !user) {
      router.replace("/log-in");
    }
  }, [authloading, user, router]);

  useEffect(() => {
    axios
      .get("https://taskora-main-backend.onrender.com/client/bonus-wallet", {
        withCredentials: true,
      })
      .then((res) => setWallet(res.data))
      .catch(() =>
        setToast({
          open: true,
          message: "Failed to fetch bonus wallet",
          type: "error",
        })
      )
      .then(() => setLoading(false));
  }, []);

  const canWithdraw = parseFloat(wallet?.amount || "0") >= 250;

  const handleSubmit = async () => {
    const postData = {
      amount: form.amount,
      method: form.method,
      mobileBankType:
        form.method === "mobile_banking" ? form.mobileBankType : undefined,
      mobileNumber:
        form.method === "mobile_banking" ? form.mobileNumber : undefined,
      accountNumber: form.method === "banking" ? form.accountNumber : undefined,
      branchName: form.method === "banking" ? form.branchName : undefined,
      accountName: form.method === "banking" ? form.accountName : undefined,
      bankName: form.method === "banking" ? form.bankName : undefined,
      password: form.password,
    };

    try {
      await axios.post(
        "https://taskora-main-backend.onrender.com/client/request-bonus-withdraw",
        postData,
        { withCredentials: true }
      );

      setToast({ open: true, message: "Request submitted", type: "success" });
      setOpen(false);
      setForm({
        amount: "",
        method: "mobile_banking",
        mobileBankType: "bkash",
        mobileNumber: "",
        accountNumber: "",
        branchName: "",
        accountName: "",
        bankName: "",
        password: "",
      });
    } catch (err: any) {
      setToast({
        open: true,
        message: err?.response?.data?.error || "Failed to submit",
        type: "error",
      });
    }
  };

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        minHeight="90vh"
        py={8}
        sx={{
          background: "linear-gradient(to right, #09203F, #537895)",
          color: "white",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight="bold" align="left">
            My Bonus Wallet
          </Typography>

          <Card
            sx={{
              backdropFilter: "blur(10px)",
              borderRadius: "50%",
              width: 200,
              height: 200,
              mx: "auto",
              backgroundColor: "#2ecc71",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <CardContent>
              {loading ? (
                <CircularProgress color="inherit" />
              ) : (
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  textAlign="center"
                  color="white"
                >
                  ৳{parseFloat(wallet?.amount || "0").toFixed(2)}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Box mt={6} textAlign="center">
            <Button
              variant="contained"
              color="success"
              disabled={!canWithdraw}
              onClick={() => setOpen(true)}
              fullWidth
              sx={{
                backgroundColor: "#2ecc71",
                color: "#fff",
                "&:hover": { backgroundColor: "#00C9A7" },
              }}
            >
              Request Withdraw
            </Button>

            <Typography mt={2} color="error">
              Minimum 250 TK required for withdraw
            </Typography>
          </Box>
          {/* 
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Withdraw Request</DialogTitle>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Withdraw Amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />

              <TextField
                select
                label="Method"
                value={form.method}
                onChange={(e) =>
                  setForm({
                    ...form,
                    method: e.target.value,
                    mobileNumber: "",
                    mobileBankType: "bkash",
                    accountNumber: "",
                    branchName: "",
                    accountName: "",
                    bankName: "",
                  })
                }
              >
                <MenuItem value="mobile_banking">Mobile Banking</MenuItem>
                <MenuItem value="banking">Banking</MenuItem>
              </TextField>

              {form.method === "mobile_banking" && (
                <>
                  <TextField
                    select
                    label="Select Mobile Bank"
                    value={form.mobileBankType}
                    onChange={(e) =>
                      setForm({ ...form, mobileBankType: e.target.value })
                    }
                  >
                    <MenuItem value="bkash">Bkash</MenuItem>
                    <MenuItem value="nagad">Nagad</MenuItem>
                    <MenuItem value="upay">Upay</MenuItem>
                  </TextField>
                  <TextField
                    label="Mobile Number"
                    value={form.mobileNumber}
                    onChange={(e) =>
                      setForm({ ...form, mobileNumber: e.target.value })
                    }
                  />
                </>
              )}

              {form.method === "banking" && (
                <>
                  <TextField
                    label="Bank Name"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm({ ...form, bankName: e.target.value })
                    }
                  />
                  <TextField
                    label="Account Number"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm({ ...form, accountNumber: e.target.value })
                    }
                  />
                  <TextField
                    label="Branch Name"
                    value={form.branchName}
                    onChange={(e) =>
                      setForm({ ...form, branchName: e.target.value })
                    }
                  />
                  <TextField
                    label="Account Holder Name"
                    value={form.accountName}
                    onChange={(e) =>
                      setForm({ ...form, accountName: e.target.value })
                    }
                  />
                </>
              )}

              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog> */}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="sm"
            slotProps={{
              backdrop: {
                sx: {
                  backdropFilter: "blur(8px)",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                },
              },
              paper: {
                sx: {
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 3,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  color: "white",
                },
              },
            }}
          >
            <h2 className="font-bold text-[18px] pt-5 pl-5">
              Withdraw Request
            </h2>
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Withdraw Amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                slotProps={{
                  inputLabel: { style: { color: "white" } },
                  input: { style: { color: "white" } },
                }}
              />

              <TextField
                select
                label="Method"
                value={form.method}
                onChange={(e) =>
                  setForm({
                    ...form,
                    method: e.target.value,
                    mobileNumber: "",
                    mobileBankType: "bkash",
                    accountNumber: "",
                    branchName: "",
                    accountName: "",
                    bankName: "",
                  })
                }
                slotProps={{
                  inputLabel: { style: { color: "white" } },
                  input: { style: { color: "white" } },
                }}
              >
                <MenuItem value="mobile_banking">Mobile Banking</MenuItem>
                <MenuItem value="banking">Banking</MenuItem>
              </TextField>

              {form.method === "mobile_banking" && (
                <>
                  <TextField
                    select
                    label="Select Mobile Bank"
                    value={form.mobileBankType}
                    onChange={(e) =>
                      setForm({ ...form, mobileBankType: e.target.value })
                    }
                    slotProps={{
                      inputLabel: { style: { color: "white" } },
                      input: { style: { color: "white" } },
                    }}
                  >
                    <MenuItem value="bkash">Bkash</MenuItem>
                    <MenuItem value="nagad">Nagad</MenuItem>
                    <MenuItem value="upay">Upay</MenuItem>
                  </TextField>

                  <TextField
                    label="Mobile Number"
                    value={form.mobileNumber}
                    onChange={(e) =>
                      setForm({ ...form, mobileNumber: e.target.value })
                    }
                    slotProps={{
                      inputLabel: { style: { color: "white" } },
                      input: { style: { color: "white" } },
                    }}
                  />
                </>
              )}

              {form.method === "banking" && (
                <>
                  <TextField
                    label="Bank Name"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm({ ...form, bankName: e.target.value })
                    }
                    slotProps={{
                      inputLabel: { style: { color: "white" } },
                      input: { style: { color: "white" } },
                    }}
                  />
                  <TextField
                    label="Account Number"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm({ ...form, accountNumber: e.target.value })
                    }
                    slotProps={{
                      inputLabel: { style: { color: "white" } },
                      input: { style: { color: "white" } },
                    }}
                  />
                  <TextField
                    label="Branch Name"
                    value={form.branchName}
                    onChange={(e) =>
                      setForm({ ...form, branchName: e.target.value })
                    }
                    slotProps={{
                      inputLabel: { style: { color: "white" } },
                      input: { style: { color: "white" } },
                    }}
                  />
                  <TextField
                    label="Account Holder Name"
                    value={form.accountName}
                    onChange={(e) =>
                      setForm({ ...form, accountName: e.target.value })
                    }
                    slotProps={{
                      inputLabel: { style: { color: "white" } },
                      input: { style: { color: "white" } },
                    }}
                  />
                </>
              )}

              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                slotProps={{
                  inputLabel: { style: { color: "white" } },
                  input: { style: { color: "white" } },
                }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            onClose={() => setToast({ ...toast, open: false })}
            variant="filled"
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

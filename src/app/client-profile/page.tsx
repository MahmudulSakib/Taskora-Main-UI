"use client";

import { useState, useEffect, useRef, use } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  MenuItem,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import useClientAuth from "@/hooks/useClientAuth";
import NavMenu from "@/components/Navmenu";

interface UserProfileResponse {
  user: {
    id: string;
    fullName: string;
    mobileNumber: string;
    email: string;
    referCode: string;
    gender?: string;
    address?: string;
    country?: string;
    profilePicture?: string;
  };
  message?: string;
}

interface UpdateProfileResponse {
  message: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useClientAuth();

  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    mobileNumber: "",
    email: "",
    gender: "",
    address: "",
    country: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [referCodes, setReferCodes] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const res = await axios.get<UserProfileResponse>(
          "https://taskora-main-backend.onrender.com/client/profile",
          { withCredentials: true }
        );
        const u = res.data.user;

        setReferCodes(u.referCode || "");

        setFormData({
          id: u.id,
          fullName: u.fullName || "",
          mobileNumber: u.mobileNumber || "",
          email: u.email || "",
          gender: u.gender || "",
          address: u.address || "",
          country: u.country || "",
        });

        if (u.profilePicture) setPreview(u.profilePicture);
      } catch {
        router.push("/log-in");
      }
    };

    fetchUserProfile();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("profileImage", image);

    try {
      const res = await axios.post<UpdateProfileResponse>(
        "https://taskora-main-backend.onrender.com/client/update-profile",
        data,
        { withCredentials: true }
      );
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const textFieldStyles = {
    InputProps: {
      sx: {
        color: "#fff",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#fff",
        },
      },
    },
    InputLabelProps: {
      sx: {
        color: "#fff",
        "&.Mui-focused": { color: "#fff" },
      },
    },
  };

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
        }}
      >
        <CircularProgress sx={{ color: "#F5A742" }} />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

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
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            maxWidth: 500,
            width: "100%",
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            mb={3}
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            Edit Profile
          </Typography>

          <Box display="flex" justifyContent="center" mb={3}>
            <IconButton onClick={handleAvatarClick}>
              <Avatar
                src={preview || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#2ecc71",
                  fontSize: 32,
                }}
              >
                {formData.fullName
                  ? formData.fullName.charAt(0).toUpperCase()
                  : ""}
              </Avatar>
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              {...textFieldStyles}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              {...textFieldStyles}
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              {...textFieldStyles}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#2ecc71",
                color: "#fff",
                borderRadius: 2,
                py: 1.3,
                fontWeight: "bold",
                "&:hover": { bgcolor: "#00C9A7" },
              }}
            >
              Update Profile
            </Button>
          </Box>
          <p className="pt-5 font-extrabold text-white">
            Your Referral Code is:{" "}
            <span className="text-red-200 text-2xl">{referCodes}</span>
          </p>
          <p className="text-white text-[12px]">
            Earn 10 tk for every referral
          </p>

          {message && (
            <Typography
              textAlign="center"
              mt={3}
              sx={{
                color: message.toLowerCase().includes("success")
                  ? "#4caf50"
                  : "red",
                fontWeight: 500,
              }}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
}

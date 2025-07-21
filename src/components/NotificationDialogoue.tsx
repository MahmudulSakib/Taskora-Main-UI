"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Tooltip,
  Slide,
  DialogProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState, useEffect } from "react";
import axios from "axios";
import { TransitionProps } from "@mui/material/transitions";
import { ReactElement, forwardRef } from "react";

// ✅ Slide transition
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function NotificationDialog() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; description: string; createdAt: string }[]
  >([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios
      .get<any>("http://localhost:5000/client/notifications", {
        withCredentials: true,
      })
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]));
  }, []);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpen} sx={{ color: "#fff" }}>
          <Badge
            badgeContent={notifications.length}
            color="error"
            overlap="circular"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        slotProps={{
          paper: {
            sx: {
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(12px)",
              color: "white",
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
              width: "100%",
              maxWidth: 500,
            },
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pt={2}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 0,
              fontWeight: "bold",
              fontSize: "1.25rem",
              color: "#ffffff",
            }}
          >
            🔔 User Notifications
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        <DialogContent dividers>
          {notifications.length === 0 ? (
            <Typography variant="body2" color="gray">
              No notifications yet.
            </Typography>
          ) : (
            <Box
              sx={{
                maxHeight: 350,
                overflowY: "auto",
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.02)",
                p: 1,
                borderRadius: 2,
                // 👇 Scrollbar blur simulation
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(6px)", // ✅ Adds blur under track
                  borderRadius: 10,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 10,
                  backdropFilter: "blur(10px)", // ✅ Simulates blur on thumb
                },
                scrollbarColor: "rgba(255,255,255,0.3) transparent", // For Firefox
              }}
            >
              <List dense disablePadding>
                {notifications.map((n) => (
                  <ListItem
                    key={n.id}
                    sx={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 2,
                      mb: 1,
                      px: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" color="white">
                          {n.description}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="gray">
                          {new Date(n.createdAt).toLocaleString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

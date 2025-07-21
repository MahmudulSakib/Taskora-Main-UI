"use client";

import { useState } from "react";
import { Box, Fab, Zoom, Tooltip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { MessageCircleMore } from "lucide-react";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  const toggleIcons = () => setOpen((prev) => !prev);

  const iconData = [
    {
      icon: <WhatsAppIcon />,
      label: "WhatsApp",
      url: "https://wa.me/your-number",
      color: "#25D366", // WhatsApp green
    },
    {
      icon: <TelegramIcon />,
      label: "Telegram",
      url: "https://t.me/yourusername",
      color: "#3390EC", // your app theme (custom blue)
    },
    {
      icon: <FacebookIcon />,
      label: "Facebook",
      url: "https://facebook.com/yourpage",
      color: "#1877F2", // Facebook blue
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3.2,
      }}
    >
      {iconData.map((item) => (
        <Zoom in={open} key={item.label}>
          <Tooltip title={item.label} placement="left">
            <Fab
              size="medium"
              onClick={() => window.open(item.url, "_blank")}
              sx={{
                backgroundColor: item.color,
                color: "#fff",
                "&:hover": {
                  backgroundColor: item.color,
                  opacity: 0.9,
                },
              }}
            >
              {item.icon}
            </Fab>
          </Tooltip>
        </Zoom>
      ))}

      <Fab
        color="default"
        onClick={toggleIcons}
        sx={{
          backgroundColor: "#09203F", // your app base color
          color: "#fff",
          "&:hover": {
            backgroundColor: "#537895", // your app hover color
          },
        }}
      >
        <MessageCircleMore />
      </Fab>
    </Box>
  );
}

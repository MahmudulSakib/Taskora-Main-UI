"use client";

import Link from "next/link";
import { Card, CardContent } from "@mui/material";
import { menuItems } from "@/constants/MainFeature";
import axios from "axios";

const handleAdClick = async (url: string) => {
  try {
    await axios.post(
      "http://localhost:5000/api/bonus/ad-click",
      {},
      {
        withCredentials: true,
      }
    );
  } catch (err) {
    console.error("Failed to add ad bonus", err);
  } finally {
    window.open(url, "_blank"); // open ad after recording click
  }
};

export default function MenuSection() {
  return (
    <section className="relative min-h-screen bg-fixed bg-center bg-cover text-white">
      <div className="py-16 min-h-screen px-4 ">
        <div className="max-w-6xl mx-auto">
          <h1 className="herofeature-text text-center">Our Features</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {menuItems.map((item) => {
              const IconComponent = item.logo;
              const card = (
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    color: "#fff",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                    },
                  }}
                  className="h-[180px]"
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      padding: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <div style={{ marginBottom: "12px", color: "#fff" }}>
                      <IconComponent fontSize="large" />
                    </div>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );

              return item.isAd ? (
                <div key={item.id} onClick={() => handleAdClick(item.aduri)}>
                  {card}
                </div>
              ) : (
                <Link key={item.id} href={item.href} className="no-underline">
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

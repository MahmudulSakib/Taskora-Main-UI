import type { Metadata } from "next";
import "./globals.css";
import MuiProvider from "@/lib/MuiProvider";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Good Life",
  description: "Microjob platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className="bg-[url('/hero.jpg')] bg-cover bg-fixed bg-center"
      >
        <MuiProvider>{children}</MuiProvider>
        <FloatingContact />
      </body>
    </html>
  );
}

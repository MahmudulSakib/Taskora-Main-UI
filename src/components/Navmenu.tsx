"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Avatar, Divider, CircularProgress } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import BuildIcon from "@mui/icons-material/Build";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaidIcon from "@mui/icons-material/Paid";
import WalletIcon from "@mui/icons-material/Wallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HelpIcon from "@mui/icons-material/Help";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GradeIcon from "@mui/icons-material/Grade";
import useClientAuth from "@/hooks/useClientAuth";
import NotificationDialog from "./NotificationDialogoue";

const navLinks = [
  { label: "Home", href: "/", icon: <HomeIcon fontSize="small" /> },
  { label: "About", href: "/about", icon: <InfoIcon fontSize="small" /> },
  {
    label: "Services",
    href: "/services",
    icon: <BuildIcon fontSize="small" />,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: <ContactMailIcon fontSize="small" />,
  },
];

const accountLinks = [
  {
    label: "Posted Job",
    href: "/client-joblist",
    icon: <AccountCircleIcon fontSize="small" />,
  },
  {
    label: "Transaction History",
    href: "/client-unifiedstatus",
    icon: <PaidIcon fontSize="small" />,
  },
  {
    label: "Add Balance",
    href: "/client-addmoney",
    icon: <WalletIcon fontSize="small" />,
  },
  {
    label: "Withdraw",
    href: "/client-earnings",
    icon: <CurrencyExchangeIcon fontSize="small" />,
  },
];

const supportLinks = [
  { label: "Help Center", href: "#help", icon: <HelpIcon fontSize="small" /> },
  {
    label: "Telegram Group",
    href: "#telegram",
    icon: <TelegramIcon fontSize="small" />,
  },
  {
    label: "Facebook Group",
    href: "#facebook",
    icon: <FacebookIcon fontSize="small" />,
  },
  {
    label: "Mobile App",
    href: "#mobile",
    icon: <MobileFriendlyIcon fontSize="small" />,
  },
  {
    label: "Privacy Policy",
    href: "#privacy",
    icon: <PrivacyTipIcon fontSize="small" />,
  },
  {
    label: "Rating & Reviews",
    href: "#reviews",
    icon: <GradeIcon fontSize="small" />,
  },
];

export default function NavMenu() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, handleLogout } = useClientAuth();

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  const profileImage = user?.profilePicture || "";
  const firstLetter = user?.fullName?.charAt(0).toUpperCase() || "";

  return (
    <header className="bg-gradient-to-r from-[#09203F] to-[#537895] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="text-white cursor-pointer"
            >
              <MenuIcon />
            </button>
            <div className="primary-logo">Good Life</div>
          </div>

          <nav className="hidden md:flex mx-auto space-x-8 text-lg">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="navmenu-text">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : user ? (
              <>
                <Link href="/client-profile">
                  <Avatar
                    src={profileImage || undefined}
                    sx={{ bgcolor: "#2ecc71", width: 32, height: 32 }}
                  >
                    {!profileImage && firstLetter}
                  </Avatar>
                </Link>
                <div className="text-sm">
                  <div>{user.fullName}</div>
                  <div className="text-xs">{user.email}</div>
                </div>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>

                <NotificationDialog />
              </>
            ) : (
              <>
                <Link href="/log-in">
                  <Button variant="outlined" color="inherit" size="small">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "#2ecc71",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#00C9A7" },
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 flex transition-all duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      >
        <div
          className={`transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } w-2/5 max-w-sm bg-gradient-to-r from-[#09203F] to-[#537895] p-6 space-y-4 h-full shadow-lg overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pt-2">
            <p className="hamburgermenu-logo">Good Life</p>
            <button
              onClick={closeMobileMenu}
              className="text-white cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hamburgermenu-text"
              onClick={closeMobileMenu}
            >
              <span className="flex items-center gap-2">
                {link.icon}
                {link.label}
              </span>
            </Link>
          ))}

          <p className="text-[12px] mt-5 mb-1">Account</p>
          <Divider className="!border-white" />

          <div className="mt-3">
            {accountLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="hamburgermenu-text"
                onClick={closeMobileMenu}
              >
                <span className="flex items-center gap-2">
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <p className="text-[12px] mt-5 mb-1">Support</p>
          <Divider className="!border-white" />

          <div className="mt-3">
            {supportLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="hamburgermenu-text"
                onClick={closeMobileMenu}
              >
                <span className="flex items-center gap-2">
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-6">
            {user ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar
                    src={profileImage || undefined}
                    sx={{ bgcolor: "#2ecc71", width: 32, height: 32 }}
                  >
                    {!profileImage && firstLetter}
                  </Avatar>
                  <div>
                    <div className="text-sm">{user.fullName}</div>
                    <div className="text-xs">{user.email}</div>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/log-in">
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    fullWidth
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={closeMobileMenu}
                    sx={{
                      backgroundColor: "#2ecc71",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#00C9A7" },
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex-grow backdrop-blur-sm" />
      </div>
    </header>
  );
}

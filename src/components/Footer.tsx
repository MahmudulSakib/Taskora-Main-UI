"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#09203F] to-[#537895] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="primary-logo mb-2">Taskora</h3>
          <p className="text-sm opacity-80 max-w-xs">
            Empowering businesses with seamless solutions and dedicated support.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 text-sm">
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="hover:underline">
            Contact Us
          </Link>
        </div>

        <div className="text-xs opacity-70">
          &copy; {new Date().getFullYear()} Life Good. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

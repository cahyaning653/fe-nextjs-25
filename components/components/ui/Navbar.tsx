"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { serviceLogout } from "@/services/services";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // cek login dari cookie
  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  const handleLogout = async () => {
    try {
      await serviceLogout();
      Swal.fire("Success", "Logged out successfully", "success");
    } catch (error) {
      console.error("Logout failed", error);
      Swal.fire("Error", "Logout failed", "error");
    } finally {
      Cookies.remove("token");
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  return (
    <nav className="w-full bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="Logo"
              className="h-8 w-auto"
            />

            <Link
              href="/"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
            >
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href="/product-category"
                  className="nav-link"
                >
                  Product Category
                </Link>

                <Link
                  href="/product"
                  className="nav-link"
                >
                  Product
                </Link>

                <Link
                  href="/product-variants"
                  className="nav-link"
                >
                  Product Variant
                </Link>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="nav-auth">
                  Login
                </Link>

                {/* 🔥 INI YANG PENTING: REGISTER KE /register */}
                <Link href="/register" className="nav-auth">
                  Register
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="nav-auth">
                Logout
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoMenuOutline } from "react-icons/io5";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const routes = [
    { title: "Home", href: "/" },
    { title: "All", href: "/product-list" },
    { title: "Contact", href: "/contact" },
  ];

  const protectedRoutes = [
    { title: "Profile", href: "/profile", icon: FiUser },
    { title: "Orders", href: "/orders" },
  ];

  const navItems = isAuthenticated
    ? [...routes, ...protectedRoutes]
    : [...routes, { title: "Login", href: "/auth" }];

  const pathname = usePathname();
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector("nav");
      const menuButton = document.querySelector('[aria-label="Toggle menu"]');

      if (
        isMenuOpen &&
        nav &&
        !nav.contains(event.target as Node) &&
        !menuButton?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Close nav when path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="relative p-6">
      <div className="absolute left-1/2 -translate-x-1/2 top-10 md:left-8 md:translate-x-0 transition-all duration-200">
        <Link href="/" className="block">
          <Image
            src="/globe.svg"
            alt="Company Logo"
            width={36}
            height={36}
            priority
            className="w-9 h-9"
          />
        </Link>
      </div>

      <button
        className="md:hidden absolute top-10 left-8 text-4xl hover:text-gray-600 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <IoMenuOutline />
      </button>

      <div className="absolute top-10 right-8 flex items-center space-x-4">
        {isAuthenticated && (
          <button
            className="text-2xl hover:text-gray-600 transition-colors"
            onClick={() => router.push("/profile")}
            aria-label="Profile"
          >
            <FiUser />
          </button>
        )}
        <button
          className="text-2xl hover:text-gray-600 transition-colors"
          onClick={() => router.push("/cart")}
          aria-label="Open cart"
        >
          <FiShoppingCart />
        </button>
      </div>

      <nav
        className={`
          ${isMenuOpen ? "block" : "hidden"}
          absolute top-24 left-4 right-4 bg-white shadow-lg rounded-lg z-50
          md:shadow-none md:static md:block md:flex md:justify-center
          transition-all duration-200 ease-in-out
        `}
        aria-label="Main navigation"
      >
        <ul className="flex flex-col space-y-4 p-4 md:flex-row md:space-x-8 md:space-y-0 md:p-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={`
                    block rounded-md px-3 py-2 text-sm font-medium
                    transition-colors duration-200 capitalize
                    ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

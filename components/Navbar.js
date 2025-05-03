"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDarkMode } from "@/context/ThemeContext";
import { Menu, X, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

const NavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact us" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const logoSrc =
    theme === "dark" ? "/pgec_logo_white_Svg.png" : "/pegcLogo_black.png";

    const isActive = (href) => pathname === href;
  return (
    <nav className="bg-background-light text-foreground-light dark:bg-background-dark dark:text-foreground-dark shadow px-6 py-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2 font-bold">
          <Image
            src={logoSrc}
            alt="Career Connect Logo"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
          <div className="leading-tight">
            <span className="text-2xl">Career Connect</span>
            <span className="block text-sm font-medium">
              Impossible made possible
            </span>
          </div>
        </Link>

        {/* Right Controls (Theme + Menu) */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground-light dark:text-foreground-dark"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 text-md font-medium uppercase tracking-wider">
            {NavLinks.map(({href,label}) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block py-2 transition-colors ${
                    isActive(href) ? "font-extrabold text-lg text-primary underline": "hover:text-primary hover:underline" 
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Theme Toggle (desktop) */}
            <button
              onClick={toggleTheme}
              className="hidden md:inline-block p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground-light dark:text-foreground-dark"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </ul> 
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in-down mt-4">
          <ul className="flex flex-col gap-4 text-md font-medium uppercase tracking-wider">
            {NavLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block border-b border-muted py-2 transition-colors ${
                    isActive(href)
                      ? "text-primary font-extrabold"
                      : "hover:text-primary"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme Toggle (mobile) */}
          <div className="mt-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground-light dark:text-foreground-dark"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDarkMode } from "@/context/ThemeContext";
import { Menu, X, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoSrc =
    theme === "dark" ? "/pgec_logo_white_Svg.png" : "/pegcLogo_black.png";

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
            <li><Link href="/" className="hover:underline font-extrabold"
                >
                  Home
                </Link>
            </li>
            <li><Link
                href="/services"
                className="block py-2 hover:text-primary transition-colors"
                >
                  Services
                </Link>
            </li>
            <li><Link
                href="/resources"
                className="block py-2 hover:text-primary transition-colors"
              >
                  Resources
                </Link>
            </li>
            <li><Link
                href="/about"
                className="block py-2 hover:text-primary transition-colors"
              >
                  About us
                </Link>
            </li>
            <li><Link
                href="/contact"
                className="block py-2 hover:text-primary transition-colors"
              >
                  Contact us
                </Link>
            </li>
            <li>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 mx-2 rounded-full hover:bg-muted/20 transition-colors text-foreground-light dark:text-foreground-dark"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </li>
          </ul>
         
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <ul className="flex flex-col gap-4 mt-4 text-md font-medium uppercase tracking-wider md:hidden animate-fade-in-down">
          <li><Link
              href="/"
              className="block border-b border-muted py-2 hover:text-primary transition-colors"
            >
              Home</Link>
          </li>
          <li><Link
              href="/services"
              className="block border-b border-muted py-2 hover:text-primary transition-colors"
            >
              Services</Link>
          </li>
          <li><Link
              href="/resources"
              className="block border-b border-muted py-2 hover:text-primary transition-colors"
            >
              Resources</Link>
          </li>
          <li><Link
              href="/about"
              className="block border-b border-muted py-2 hover:text-primary transition-colors"
            >
              About us</Link>
          </li>
          <li><Link
              href="/contact"
              className="block border-b border-muted py-2 hover:text-primary transition-colors"
            >
              Contact us</Link>
          </li>
          <li>
             {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2  rounded-full hover:bg-muted/20 transition-colors text-foreground-light dark:text-foreground-dark"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

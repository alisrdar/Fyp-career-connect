"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDarkMode } from "@/context/ThemeContext";

const Footer = () => {
  const { theme } = useDarkMode();
  const logoSrc =
    theme === "dark" ? "/pgec_logo_white_Svg.png" : "/pegcLogo_black.png";

 
  const aboutLinks = [
    { name: "Our Mission", href: "/about" },
    { name: "Terms of Service", href: "#" },
    { name: "Our Team", href: "#" },
  ];
  const resourcesLinks = [
    { name: "Articles", href: "/resources" },
    { name: "Career Paths", href: "#" },
    { name: "Guides", href: "#" },
  ];
  const contactUs = [
    { name: "Help Center", href: "#" },
    { name: "Chat Support", href: "#" },
    { name: "FAQs", href: "#" },
  ];

  return (
    <footer className="bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark px-6 pb-6 pt-12" >
      <div className=" mx-auto flex flex-col gap-12 md:flex-row justify-between">
        {/* Logo */}
        <div className="flex flex-col justify-center gap-4 max-w-sm">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src={logoSrc}
              alt="Career Connect Logo"
              width={70}
              height={70}
              className="object-contain"
              priority
            />
            <div>
              <h1 className="text-xl font-bold">Career Connect</h1>
              <p className="text-md opacity-80">Impossible made possible</p>
            </div>
          </Link>
        </div>

        {/* Link Columns */}
        <div className="lg:w-2/3 grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div></div>
          <FooterColumn title="Resources" links={resourcesLinks}/>
          <FooterColumn title="About" links={aboutLinks} />
          <FooterColumn title="Contact Us" links={contactUs} />
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center text-sm text-muted mt-12 border-t border-extra-muted pt-4">
        © 2025 Career Connect. All rights reserved.
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="font-semibold text-lg mb-4">{title}</h4>
    <ul className="space-y-3 text-base">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            href={link.href}
            className="hover:text-primary transition-colors"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;

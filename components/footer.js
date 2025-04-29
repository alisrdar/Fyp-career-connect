"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDarkMode } from "@/context/ThemeContext";

const Footer = () => {

  const {theme} = useDarkMode();
 
  const logoSrc =
  theme === "dark" ? "/pgec_logo_white_Svg.png" : "/pegcLogo_black.png";

  const servicesLinks = [{
     name: "Career Assesment", href: "#",
     name: "Career Guidance", href: "#",
     name: "Extensive Resources", href: "#"
     
  }];
  const aboutLinks= [{
    name: "Our mission", href: "#",
    name: "Terms of services", href: "#",
    name: "Our Team", href: "#",
    name: "Lorem", href: "#",
  }];
  const resourcesLinks = [{
    name: "Lorem", href: "#",
    name: "Lorem", href: "#",
    name: "Lorem", href: "#",
    name: "Lorem", href: "#",
  }];
  const SupportLinks = [{
    name: "Help Center", href: "#",
    name: "Chat Support", href: "#",
    name: "Lorem", href: "#",
    name: "Lorem", href: "#",
  }];
  const settingLinks= [{
    name: "Epsum", href: "#",
    name: "Epsum", href: "#",
    name: "Epsum", href: "#",
    name: "Epsum", href: "#",
  }] 
  return (
    <footer className="bg-background-light text-foreground-light dark:text-foreground-dark dark:bg-background-dark max-md:w-full max-md:pr-3 w-full pl-2.5 pr-10 pt-12 pb-3">
      {/* All navlinks */}
      <section className="flex justify-between max-md:w-full  ">
        {/* logo and text */}
        <div className="py-16">
          <Link href={"/"} className="flex gap-4 items-center  font-bold ">
            <Image
              src={logoSrc}
              alt="Career Connect Logo"
              width={70}
              height={70}
              className="object-contain"
              priority
            >
              
            </Image>
            <div className="leading-tight  ">
                <span className="text-xl ">Career Connect</span>
                <span className="text-sm font-medium block">imposible made possible</span>
            </div>
          </Link>
        </div>
        {/* Links */}
        <div className="flex justify-between px-4 w-3/4">
        <div className="flex items-center ">
          <ul className="list-none ">
            <li>
              <Link href={'/services'} className="py-2 block text-md font-semibold">Services</Link>
            </li>  
            {servicesLinks.map((link) => (
              <li className="py-2 block text-sm">
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            )
            )}
          </ul>
        </div>
        
        <div className="flex items-center ">
          <ul className="list-none ">
            <li>
              <Link href={'/services'} className="py-2 block text-md font-semibold">Resources</Link>
            </li>  
            {resourcesLinks.map((link) => (
              <li className="py-2 block text-sm">
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            )
            )}
          </ul>
        </div>
        <div className="flex items-center ">
          <ul className="list-none ">
            <li>
              <Link href={'/services'} className="py-2 block text-md font-semibold">About</Link>
            </li>  
            {aboutLinks.map((link) => (
              <li className="py-2 block text-sm">
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            )
            )}
          </ul>
        </div>
        <div className="flex items-center ">
          <ul className="list-none ">
            <li>
              <Link href={'/services'} className="py-2 block text-md font-semibold">Support</Link>
            </li>  
            {SupportLinks.map((link) => (
              <li className="py-2 block text-sm">
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            )
            )}
          </ul>
        </div>
        </div>

      </section>
    </footer>
  );
};

export default Footer;
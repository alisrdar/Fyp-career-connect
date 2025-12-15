import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { icons } from "lucide-react";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  icons: {
    icon: "pgec_logo_white_Svg.png"
  },
  title: "Career Connect",
  description: "Unlock your potential and achieve your career goals with our Comprehensive counseling Services.",
  keywords: "Career Connect, Career Counseling, Career Guidance, AI-Powered Assessment, Personalized Guidance, Resource Library",
};



// app/layout.js
export default function RootLayout({ children }) {
  // const pathname = usePathname();

  return (
    <html suppressHydrationWarning>
      <ThemeProvider>
        <AuthProvider>
          <body className={`${geistSans.variable} ${geistMono.variable} bg-background-light dark:bg-background-dark antialiased`}>
            {children}
          </body>
        </AuthProvider>
      </ThemeProvider>
    </html>
  );
}

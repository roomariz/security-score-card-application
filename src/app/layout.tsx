import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Security Scorecard - Digital Security Assessment",
  description: "Get a comprehensive security assessment of your digital life. Check for password reuse, data breaches, 2FA setup, and more with our easy-to-use security scorecard.",
  keywords: ["security", "password", "2FA", "data breach", "digital security", "cybersecurity", "privacy", "authentication"],
  authors: [{ name: "Security Scorecard Team" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Security Scorecard - Digital Security Assessment",
    description: "Comprehensive security assessment for your digital life",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Scorecard",
    description: "Get a comprehensive security assessment of your digital life",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

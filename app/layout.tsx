import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./features/navbar/components/Navbar";
import { Toaster } from "sonner";
import { getProfile } from "./features/profile/actions/profile";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DBOP March Madness",
  description: "Curated by the Deiley Twins",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch profile inside the server component so request-scoped
  // APIs like `cookies()` are called within a request context.
  const profile = await getProfile().catch(() => null)
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar profile={profile} />
          <Toaster />
        {children}
      </body>
    </html>
  );
}

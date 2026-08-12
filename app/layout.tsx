import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameFlow — Game Build Version Control",
  description:
    "Platform version control untuk build game Unity/Godot. Jembatan antara game designer dan programmer.",
};

import { NotificationProvider } from "@/components/notification/NotificationContext";
import NotificationToast from "@/components/notification/NotificationToast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NotificationProvider>
          {children}
          <NotificationToast />
        </NotificationProvider>
      </body>
    </html>
  );
}


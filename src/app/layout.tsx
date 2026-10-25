import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Gulzar,
  Lateef,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const urduNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-urdu-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const urduGulzar = Gulzar({
  variable: "--font-urdu-gulzar",
  subsets: ["arabic"],
  weight: "400",
});

const urduNaskh = Noto_Naskh_Arabic({
  variable: "--font-urdu-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const urduLateef = Lateef({
  variable: "--font-urdu-lateef",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "StoreApp",
  description: "Manage store stock, inventory, and daily sales.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${urduNastaliq.variable} ${urduGulzar.variable} ${urduNaskh.variable} ${urduLateef.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

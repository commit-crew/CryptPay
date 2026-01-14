import type { Metadata } from "next";
import { poppinsFont } from "./fonts";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptoPay",
  description: "Global Crypto Payment solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppinsFont.className}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { poppinsFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptPay",
  description: "Global Crypto Payment solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppinsFont.className}>{children}</body>
    </html>
  );
}

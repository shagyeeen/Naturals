import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ClearCache } from "@/components/ClearCache";
import { AOSInitializer } from "@/components/AOSInitializer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naturals AI Beauty Intelligence Platform",
  description: "Transforming Salons into Intelligent Beauty Ecosystems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}>
        <AOSInitializer />
        <ClearCache />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

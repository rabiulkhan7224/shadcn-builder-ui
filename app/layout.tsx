import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab, Public_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/landing/Navbar";
import { cn } from "@/lib/utils";

const publicSansHeading = Public_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-serif",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shadcn builder ui",
  description:
    "A powerful open-source drag-and-drop builder for creating beautiful forms, tables, and UI interfaces with React, TypeScript, Tailwind CSS, and shadcn/ui",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-serif",
        robotoSlab.variable,
        publicSansHeading.variable,
      )}
    >
      <body className="">
        <Navbar />
        <main className="flex flex-col items-center mt-24 gap-10 md:gap-36">
          {children}
        </main>
      </body>
    </html>
  );
}

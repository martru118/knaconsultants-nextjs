import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/events/CreateEventDrawer";

export const metadata: Metadata = {
  title: "Schedulrr",
  description: "Meeting scheduling app",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {children}
          </main>

          <CreateEventDrawer />
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/events/CreateEventDrawer";

export const metadata: Metadata = {
  title: "K & A Consulting Ltd",
  description: "K & A Consulting",
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
          <main className="min-h-screen">
            {children}
          </main>

          <CreateEventDrawer />
        </ClerkProvider>
      </body>
    </html>
  );
}

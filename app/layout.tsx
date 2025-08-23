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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {children}
          </main>
          <footer className="bg-blue-100 py-12">
            <div className="container mx-auto px-4 text-center">
              <p>© Copyright {new Date().getFullYear()} K & A Consulting LLC.</p>
            </div>
          </footer>

          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}

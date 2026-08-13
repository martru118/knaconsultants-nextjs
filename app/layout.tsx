import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/events/CreateEventDrawer";

export const metadata: Metadata = {
  title: "K & A Consulting Ltd",
  description: "K & A Consulting",
};

const font = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
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

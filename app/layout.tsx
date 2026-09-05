import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/events/CreateEventDrawer";
import { ThemeProvider } from 'next-themes'
import { shadcn } from '@clerk/ui/themes'

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
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              theme: shadcn
            }}
          >
            {children}
            <CreateEventDrawer />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

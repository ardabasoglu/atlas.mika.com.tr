import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Atlas - Kurumsal Bilgi Platformu",
  description: "Mika'nın gelişmiş bilgi platformu",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={outfit.variable} suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ThemeProvider>
            <SidebarProvider>
              {children}
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

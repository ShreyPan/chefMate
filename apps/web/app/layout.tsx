import type { Metadata } from "next";
import { Inter, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

// Font for headings - Inter (modern, clean, professional)
const inter = Inter({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

// Font for body text - Source Sans 3 (highly readable, optimized for UI)
const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Font for code/monospace - JetBrains Mono (excellent for code)
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChefMate - AI-Powered Cooking Assistant",
  description: "Your intelligent cooking companion with AI recipe generation and voice control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceSans.variable} ${jetbrainsMono.variable} antialiased font-body`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

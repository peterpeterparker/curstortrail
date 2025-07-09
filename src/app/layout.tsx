import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { JunoProvider } from "@/components/juno-provider";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Curstor Trail - Personal Trail Running Adventures",
  description: "Share my trail running adventures with detailed routes, photos, and experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <JunoProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
          </AuthProvider>
        </JunoProvider>
      </body>
    </html>
  );
}

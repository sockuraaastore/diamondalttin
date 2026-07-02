import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Diamond Alttin | Luxury Jewelry",
  description: "Premium gold, silver, and precious stone jewelry collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hsiningwang.com"),
  title: "Hsi-Ning Wang",
  description:
    "The personal website of Hsi-Ning Wang — a home for work, notes, and ideas.",
  authors: [{ name: "Hsi-Ning Wang" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Hsi-Ning Wang",
    description: "A home for work, notes, and ideas.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "comeback.mjg — A Better You. Everyday.",
  description:
    "Small steps, big changes. A personal operating system and execution engine that turns goals into actions and actions into lasting progress.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-50 text-slate-900">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-500/20">
        {children}
      </body>
    </html>
  );
}

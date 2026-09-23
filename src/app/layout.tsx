import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Transformation OS — Execution Engine & Adaptive Habit System",
  description:
    "A personal operating system that bridges the gap between intention and execution. Know yourself. Do the work. Become who you want to be.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

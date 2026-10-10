import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReelForge — Create technical videos",
  description: "Turn programming ideas into technical video storyboards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

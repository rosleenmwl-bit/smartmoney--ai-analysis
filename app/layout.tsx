import type { Metadata } from "next";
import "./globals.css";
import "./preview.css";
import "./dashboard.css";
import "./summary.css";
import "./shell.css";
import "./expenses.css";
import "./recommendation.css";

export const metadata: Metadata = {
  title: "SmartMoney — AI budget coach",
  description: "A clear, calm view of your monthly spending.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

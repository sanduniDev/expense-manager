import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayoutContent } from "@/components/root-layout-content";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}

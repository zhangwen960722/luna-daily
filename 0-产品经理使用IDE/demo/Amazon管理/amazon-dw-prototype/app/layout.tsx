import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amazon DW 管理 · 飞点跨境供应链",
  description: "Amazon FIST、Delivery Window、ShipTrack 与 Smart Reroute 运营管理原型。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className="antialiased">{children}</body></html>;
}

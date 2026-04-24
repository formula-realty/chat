import type { Metadata, Viewport } from "next";

import "@/app/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://formula-tyumen.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Формула | Подбор квартир в новостройках Тюмени",
  description:
    "Ответьте на несколько коротких вопросов и получите подборку квартир в новостройках Тюмени под ваш бюджет, район и цель покупки.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "Формула | Подбор квартир в Тюмени",
    description:
      "Чат-подбор квартир в новостройках Тюмени под бюджет, район, ипотеку и цель покупки.",
    url: siteUrl,
    siteName: "Формула",
    locale: "ru_RU",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F7FA"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="stylesheet" href="/formula.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
